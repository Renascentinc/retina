# Retina

Renascent Inc. Asset Tracking Application

[![Build Status](https://travis-ci.org/Renascentinc/retina.png)](https://travis-ci.org/Renascentinc/retina)

### Project setup
```
brew install imagemagick
git clone git@github.com:Renascentinc/retina.git
cd retina
yarn setup
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Run tests
```
yarn test
```

### Branching
This project follows [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

### Releasing Web Version
```
git checkout develop
git pull
git checkout -b release/v1.2.3
yarn version (--major, --minor, --patch)
git push --follow-tags
open https://github.com/Renascentinc/retina/compare/master...release/v1.2.3
```

#### Note
If you don't see the new version immediately this is because CloudFront caches assets. You can manually invalidate the cache if you want to confirm that the deploy worked as expected

#### Releasing Android Version
```
yarn build:mobile
cordova prepare
```
open the project in android studio


#### Releasing iOS Version