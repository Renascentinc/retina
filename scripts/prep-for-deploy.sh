#!/bin/sh

branch=$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
echo $branch
if [ $branch = "master" ]
then
    echo "ember build --prod"
    ember build --prod
else
    echo "ember build"
    ember build
fi

find . -maxdepth 1 ! -iname dist ! -iname ".." ! -iname "." ! -iname ".git" -exec rm -rf {} \;
mv dist/* .
rm -rf dist
