module.exports = {
  publicPath: process.env.VUE_APP_PLATFORM === 'cordova' ? '' : '/',
  outputDir: process.env.VUE_APP_PLATFORM === 'cordova' ? 'www' : 'dist',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.scss";`
      }
    }
  }
}
