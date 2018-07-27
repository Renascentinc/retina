const Bundler = require('parcel-bundler')
const Path = require('path')

const file = Path.join(__dirname, './index.html')

const options = {
  outDir: './cordova/www',
  outFile: 'index.html',
  publicUrl: './',
  watch: false,
  cache: true,
  cacheDir: '.cache',
  contentHash: false,
  minify: true,
  target: 'browser',
  https: false,
  logLevel: 1,
  hmrPort: 0,
  sourceMaps: false,
  hmrHostname: '',
  detailedReport: false
}

new Bundler(file, options).bundle()
