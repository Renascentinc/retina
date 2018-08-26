import Vue from 'vue'
import App from './App'
import router from './router'
import attachFastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(VueLazyload)

attachFastClick(document.body)

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
