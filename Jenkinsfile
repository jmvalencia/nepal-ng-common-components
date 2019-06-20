#!/usr/bin/env groovy

import groovy.json.JsonOutput

@NonCPS
def cancelPreviousBuilds() {
    def jobName = env.JOB_NAME
    def buildNumber = env.BUILD_NUMBER.toInteger()
    /* Get job name */
    def currentJob = Jenkins.instance.getItemByFullName(jobName)

    /* Iterating over the builds for specific job */
    for (def build : currentJob.builds) {
        /* If there is a build that is currently running and it's not current build */
        if (build.isBuilding() && build.number.toInteger() != buildNumber) {
            /* Then stopping it */
            build.doStop()
        }
    }
}

@NonCPS
Gitrepo getUserRepo(String url) {

    def findgits = (url =~ /^(?:(?:\w+:\/\/)|(?:\w+@))[\w.]+[\/:](\w+)\/([\w-]+)\.git$/)
    findgits.matches()
    String currepouser = findgits.group(1)
    String curreponame = findgits.group(2)
    return new Gitrepo(user: currepouser, repo: curreponame)

}

class Gitrepo {
    String user
    String repo
}

    String integrationBranch = 'integration'
    String apibase = 'https://algithub.pd.alertlogic.net/api/v3/'
    String TYPES_COVEAGE = ''
    String NewS3Bucket = 's3://ui-dev-pipeline'

    statuses = ['lint', 'test', 'build', 'deploy']

    pipeline {
        agent any
        options { buildDiscarder(logRotator(numToKeepStr: '20')) }

        stages {
            stage('Init-Common') {
                steps {

                    script {
                        cancelPreviousBuilds()

                        //bump the package version

                        sh "jq \".version=\\\"\$(date '+%Y%m%d.%H%M%S.$BUILD_NUMBER')\\\"\" package.json > package.json.tmp && mv package.json.tmp package.json"
                        def packagedotJSON = readJSON file: 'package.json'
                        env.PKG_NAME = packagedotJSON['name']
                        env.PKG_VERSION = packagedotJSON['version']
                        env.OUTPUT_PATH = "dist/usage-guide"
                        echo "New Package Version: " + env.PKG_VERSION

                      env.cleanPackageName = env.PKG_NAME.replace("o3-", "").replace('nepal-', '').replace('amp-', '').replace('.', '-')
                      env.INTEGRATION_S3 = NewS3Bucket + '/' + cleanPackageName


                        if (packagedotJSON['buildData']) {
                            echo "found packagedotJSON['buildData']"

                            if (packagedotJSON['buildData']['branches']) {
                                echo "found packagedotJSON['buildData']['branches']"
                                if (packagedotJSON['buildData']['branches']['integration']) {
                                    integrationBranch = packagedotJSON['buildData']['branches']['integration']
                                }
                            }
                        }
                    }

                    echo sh(returnStdout: true, script: 'env')

                }
            }

            stage('Init - PR') {
                when {
                    branch "PR-*"
                }
                steps {
                    echo "stage init PR"
                    script {

                        statuses.each { status ->
                            setStatus(status, 'pending')
                        }

                        def modbuildnum = (env.CHANGE_ID).toInteger() % 20
                        env.MOD_BUILD_NUM = modbuildnum
                        def packagedotJSON = readJSON file: 'package.json'

                        env.NewS3BucketEnv = NewS3Bucket
                        String NewS3Folder = "$cleanPackageName-pr-${MOD_BUILD_NUM}"
                        env.NewS3FullLoc = "$NewS3Bucket/$NewS3Folder"
                        env.NewS3Url = "${NewS3Folder}.ui-dev.product.dev.alertlogic.com"

                    }

                    echo sh(returnStdout: true, script: 'env')
                }
            }

            stage('Integration Merge') {
                when {
                    branch integrationBranch
                }
                steps {
                    echo "Merging new integration into open pull requests"

                    withCredentials([[$class: 'StringBinding', credentialsId: 'CD_GITHUB_TOKEN', variable: 'GITHUB_TOKEN']]) {
                        script {

                            Gitrepo repothing = getUserRepo(env.GIT_URL);
                            String commit = env.GIT_COMMIT
                            String currepouser = repothing.user
                            String curreponame = repothing.repo

                            String releaseurl = apibase + "repos/${currepouser}/${curreponame}/pulls"
                            String releaseResponse = sh(
                                    script: "curl -H 'Authorization: token $GITHUB_TOKEN' $releaseurl",
                                    returnStdout: true
                            )

                            Object ReleaeJson = readJSON text: releaseResponse

                            ReleaeJson.findAll { pull -> pull.base.ref == integrationBranch }
                                    .each { pull ->

                                        echo "trying to merge ${integrationBranch} into ${pull.head.label}"

                                        String mergeurl = pull.head.repo.merges_url
                                        String megeData = JsonOutput.toJson([head: commit, base: pull.head.ref])

                                        echo mergeurl
                                        echo megeData

                                        String mergeResponse = sh(
                                                script: "curl -H 'Authorization: token $GITHUB_TOKEN'  --data '$megeData' $mergeurl",
                                                returnStdout: true
                                        )
                                        echo mergeResponse
                                    }

                        }
                    }
                }
            }

            stage('Setup') {
                steps {
                    sh 'npm install'
                }
            }

            stage('Gate 2 - Lint') {
                when {
                    branch "PR-*"
                }
                steps {
                    echo "GATE 2 - Lint"
                    sh '''rm -f "checkstyle.*"'''
                    sh '''
set +e
rm -f lintresult
npm run lint -- --format=checkstyle > checkstyle.xml
echo $? > lintresult
sed -i -e '1,4d' checkstyle.xml
split -l 1 checkstyle.xml checkstyle.xml.
set -e
'''
                    script {

                        Gitrepo repothing = getUserRepo(env.GIT_URL);

                        step(
                                [
                                        $class: 'ViolationsToGitHubRecorder',
                                        config: [
                                                gitHubUrl                             : 'https://algithub.pd.alertlogic.net/api/v3/',
                                                repositoryOwner                       : repothing.user,
                                                repositoryName                        : repothing.repo,
                                                pullRequestId                         : CHANGE_ID,

                                                credentialsId                         : 'CIBOT_ALGITHUB',

                                                createCommentWithAllSingleFileComments: false,
                                                createSingleFileComments              : true,
                                                commentOnlyChangedContent             : true,
                                                minSeverity                           : 'INFO',
                                                keepOldComments                       : false,
                                                violationConfigs                      : [
                                                        [pattern: '.*/checkstyle\\.xml\\..+$', parser: 'CHECKSTYLE', reporter: 'Checkstyle'],
                                                ]
                                        ]
                                ]
                        )
                    }
                    sh '''

if [ "0" == "$(cat lintresult)" ] ;then
        echo "lint passed"
else
    echo "lint failure"
    exit 1
fi
'''

                }
                post {
                    success {
                        script {
                            setStatus('lint', 'success')
                        }
                    }
                    failure {
                        script {
                            setStatus('lint', 'failure')
                        }
                    }
                }
            }

            stage('Gate 2 - Test') {
                when {
                        branch "PR-*"
                }
                steps {
                    echo "GATE 2 - Test"
                    ansiColor('xterm') {
                        sh 'npm run test-focus-checks'
                        sh 'npm run test -- --code-coverage'

                        script {
                            if (fileExists('test-results.xml')) {
                                junit 'test-results.xml'
                            }
                        }
                    }
                }
                post {
                    success {
                        script {
                            setStatus('test', 'success')
                        }
                    }
                    failure {
                        script {
                            setStatus('test', 'failure')
                        }
                    }
                }
            }
            stage('Gate 2 - Build PR') {
                when {
                    branch "PR-*"
                }
                steps {
                    echo "GATE 2 - Build"

                    sh 'rm -rf dist'
                    // if angular old, use environment, if new, use configuration
                    sh '''

        node --max_old_space_size=8000 ./node_modules/@angular/cli/bin/ng build --configuration=integration --stats-json

        npx webpack-bundle-analyzer $OUTPUT_PATH/stats.json -m static --no-open
        rm $OUTPUT_PATH/stats.json
        mv report.html $OUTPUT_PATH/webpack-bundle-analyzer-report.html



    if [ -f coverage/cobertura-coverage.xml ]; then
        mv coverage/cobertura-coverage.xml .
    fi

    if [ -f coverage/index.html ]; then
        mv coverage $OUTPUT_PATH
    fi

'''

                    echo "calculating typescript coverage"
                    script {
                        TYPES_COVEAGE = sh(
                                script: "npx --package typescript --package type-coverage -c 'type-coverage -p src/tsconfig.app.json --strict'",
                                returnStdout: true
                        )
                        echo TYPES_COVEAGE
                    }

                }
                post {
                    success {
                        script {
                            setStatus('build', 'success')
                        }
                    }
                    failure {
                        script {
                            setStatus('build', 'failure')
                        }
                    }
                }

            }

            stage('Gate 3 - Build and Deploy to integration') {
                when {
                    branch integrationBranch
                }
                steps {
                    echo 'temp comment out'
                    ansiColor('xterm') {
                        sh '''


        node --max_old_space_size=8000 ./node_modules/@angular/cli/bin/ng build usage-guide --configuration=integration --stats-json

        npx webpack-bundle-analyzer $OUTPUT_PATH/stats.json -m static --no-open
        rm $OUTPUT_PATH/stats.json
        mv report.html $OUTPUT_PATH/webpack-bundle-analyzer-report.html

        export AWS_CONFIG_FILE=/etc/aws/route105.config

    ~/.local/bin/aws s3 rm ${INTEGRATION_S3} --recursive --region us-east-2
     ~/.local/bin/aws s3 sync $OUTPUT_PATH ${INTEGRATION_S3} --delete --cache-control max-age=3600,public --exclude index.html --region us-east-2
     ~/.local/bin/aws s3 cp $OUTPUT_PATH/index.html ${INTEGRATION_S3}/index.html --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read --region us-east-2
     
'''
                    }
                }
            }

            stage('Deploy-PR') {
                when {
                    branch "PR-*"
                }
                steps {
                    echo "GATE 2 - Deploy to Demo Env"
                    sh '''
                export AWS_CONFIG_FILE=/etc/aws/route105.config

    ~/.local/bin/aws s3 rm ${NewS3FullLoc} --recursive --region us-east-2
     ~/.local/bin/aws s3 sync $OUTPUT_PATH ${NewS3FullLoc} --delete --cache-control max-age=3600,public --exclude index.html --region us-east-2
     ~/.local/bin/aws s3 cp $OUTPUT_PATH/index.html ${NewS3FullLoc}/index.html --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read --region us-east-2
     '''
                    script {
                        String buildchart = "[webpack bundle analyzer report](https://$NewS3Url/webpack-bundle-analyzer-report.html)"

                        String coverageData = '### Unit Test Coverage Report\n\n'


                        if (fileExists("$OUTPUT_PATH/coverage/coverage-summary.json")) {
                            def cov = readJSON file: "$OUTPUT_PATH/coverage/coverage-summary.json"
                            coverageData += """
<dl>
  <dt>Statements</dt>
  <dd>${cov.total.statements.pct}% ${cov.total.statements.covered}/${cov.total.statements.total}</dd>
  <dt>Branches</dt>
  <dd>${cov.total.branches.pct}% ${cov.total.branches.covered}/${cov.total.branches.total}</dd>
    <dt>Functions</dt>
  <dd>${cov.total.functions.pct}% ${cov.total.functions.covered}/${cov.total.functions.total}</dd>
    <dt>Lines</dt>
  <dd>${cov.total.lines.pct}% ${cov.total.lines.covered}/${cov.total.lines.total}</dd>
</dl>

"""
                        } else {
                            coverageData += 'coverage json data not found. Add `json-summary` to .coverageIstanbulReporter.reports in `karma.conf.js`\n\n'
                        }

                        if (fileExists("$OUTPUT_PATH/coverage/index.html")) {
                            coverageData += '[coverage report](https://' + String.valueOf(NewS3Url) + '/coverage/index.html)\n\n'
                        } else {
                            coverageData += 'coverage html report not found. Add `html` to .coverageIstanbulReporter.reports in `karma.conf.js`\n\n'
                        }

                        pullRequest.comment(
                                """
PR is build and deployed: [https://$NewS3Url](https://${NewS3Url})

$coverageData

### Webpack Bundle Analyzer Report
$buildchart

### Types Coverage
```
$TYPES_COVEAGE
```

[❤️ jenkins](${env.BUILD_URL})
""".trim())
                    }
                }

                post {
                    success {
                        script {
                            setStatus('deploy', 'success')
                        }
                    }
                    failure {
                        script {
                            setStatus('deploy', 'failure')
                        }
                    }
                }

            }

        }

        post {
            // using just success here instead of always so that failed pipelines can be
            success {
                sh 'rm -rf node_modules'
            }
        }
    }

def setStatus(String sectionName, String passOrFail) {
    pullRequest.createStatus(
            status: passOrFail,
            context: 'continuous-integration/jenkins/pr-merge/' + sectionName,
            description: sectionName + ' ' + passOrFail,
            targetUrl: "${env.BUILD_URL}"
    )

}
