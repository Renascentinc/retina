#!/bin/sh

set -e
if [ $TRAVIS_BRANCH = 'master' ]; then
  ember build --provider;
else
  ember build;
fi
