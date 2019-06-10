#!/bin/bash

# Iterate up the directory structure until we find the root of the NEPAL Library repo that we are being executed within
while [[ $PWD != '/' && ! ( -f "$PWD/package.json" ) ]]; do
    cd ..
done

CONTAINER_PATH=$(cd ../..; pwd)
if [[ $CONTAINER_PATH == *"node_modules" ]]
then
    # If this library is installed as another project's dependency, do NOT attempt to install pre-push hooks; it will not end well.
    exit 0
fi

echo "You are in $CONTAINER_PATH"

if [ $PWD = '/' ]
then
    echo "The root of the current NEPAL Library repository could not be found: \033[1;31mABORTING\033[0m (make sure you run the npm postinstall task)"
    echo "Evaluated from this path: $WHERE_AM_I"
    exit 1
fi

if [ ! -f package.json ]
then
    echo "The root of your NEPAL Library repository does not actually appear to be an NEPAL Library repository: \033[1;31mABORTING\033[0m"
    echo "Using NEPAL Library root $PWD derived from origin path $WHERE_AM_I"
    exit 1
fi

echo "=================================================================="
echo "Installing git hooks to NEPAL Library repository at \033[1;36m$PWD\033[0m..."
echo "=================================================================="

cp scripts/pre-push.git .git/hooks/pre-push
chmod a+x .git/hooks/pre-push
