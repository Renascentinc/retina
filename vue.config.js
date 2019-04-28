module.exports = {
  publicPath: process.env.CORDOVA === 'true' ? './' : '/',
  outputDir: process.env.CORDOVA === 'true' ? 'www' : 'dist'
}
