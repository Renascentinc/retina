#!/usr/bin/env bash

echo "Cleaning out bower and npm dependencies and reimporting them"

echo "rm -rf node_modules"
rm -rf ../node_modules

echo "rm -rf bower_components"
rm -rf ../bower_components

echo "npm cache clean"
npm cache clean

echo "bower cache clean"
bower cache clean

echo "npm install"
npm install

echo "bower install"
bower install

echo "Done"
