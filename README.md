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
From the github webpage you can create a pull request from the release branch to master.
Once the PR has been approved and merged into `master` run the following
```
git checkout master
git pull
git checkout develop
git merge master
yarn version --preminor --preid alpha
git push --follow-tags
```

#### Note
If you don't see the new version immediately this is because CloudFront caches assets. You can manually invalidate the cache if you want to confirm that the deploy worked as expected

#### Releasing Android Version
1. open config.xml and set the `id` to `com.retina.renascentinc`
2. From the command line
```
rm -rf www/*
yarn android
```
3. Open the project in android studio
4. Select `Build` > `Generate Signed Bundle/APK`
5. When you reach the step that requires a keystore, use the keystore.jks file from previous releases. The key is `key0`.
6. When it has generated the apk select `locate file` from the toast message.
7. Log into the [google play console](https://play.google.com/apps/publish/?pli=1&account=8580391619787055888#AppListPlace)
8. Select `Release Management` > `App Releases` > `Edit Release`
9. Upload the apk you generated and fill in the rest of the necessary info to release. 

#### Releasing iOS Version
1. open config.xml and set the `id` to `com.retinaenterprise.renascentinc`
2. From the command line
```
rm -rf www/*
yarn ios
```
3. Open RETINA.xcworkspace in Xcode
4. Set the target device to `Generic iOS Device`
5. Select `Produce` > `Archive`
6. After that completes, select `Distribute App`
7. Select `Enterprise Distribution`
8. Set the following values when prompted
```
Name: retina
App URL: https://retina.renascentinc.com/ios/RETINA.ipa
Display Image URL: https://retina.renascentinc.com/ios/display_image.png
Full Display Image URL: https://retina.renascentinc.com/ios/full_display_image.png
```
9. Increment version number in `public/download.html`
10. Upload `RETINA.ipa`, `manifest.plist` and `download.html` to S3 > retina-us-east-1/ios