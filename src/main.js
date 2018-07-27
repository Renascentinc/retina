import Vue from 'vue'
import App from './App'
import router from './router'
import attachFastClick from 'fastclick'

Vue.config.productionTip = false

attachFastClick(document.body)

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
