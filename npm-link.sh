#!/bin/sh
if [ -z "$1" ]
  then
    echo "PASS A 2nd PARAM: link.sh <name-of-a-project-to-copy-into>"
    exit 1
fi

curFolderName=${PWD##*/}
echo "Current folder name $curFolderName"

echo "Adding the current folder is added as a global npm link"
cd dist/
npm link

echo "Moving to the target folder and add the global npm link into it"
cd "../../${1}/node_modules/"
npm link "$curFolderName"