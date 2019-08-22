#!/bin/bash

PACKAGE_VERSION=$npm_package_version
echo $PACKAGE_VERSION

json -I -f projects/nepal-ng-common-components/package.json -e "this.version='$PACKAGE_VERSION'"
