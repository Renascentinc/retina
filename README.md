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

### Releasing
```
git checkout develop
git pull
git checkout -b release/v1.2.3
yarn version (--major, --minor, --patch)
git push --follow-tags
```