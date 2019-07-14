/* eslint-disable no-new */

import '../node_modules/v-calendar/lib/v-calendar.min.css'

import Vue from 'vue'
import App from './App'
import DrawerLayout from 'vue-drawer-layout'
import VCalendar from 'v-calendar'
import VeeValidate, { Validator } from 'vee-validate'
import VueMq from 'vue-mq'
import VueInfiniteScroll from 'vue-infinite-scroll'
import money from 'v-money'
import router from './router'
import store from './store'
import apolloProvider from './apollo'
import fastclick from 'fastclick'
import ToggleButton from 'vue-js-toggle-button'

if (process.env.VUE_APP_PLATFORM === 'cordova') {
  let cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

Vue.config.productionTip = false
Vue.use(ToggleButton)
Vue.use(VueInfiniteScroll)
Vue.use(DrawerLayout)
Vue.use(VCalendar)
Vue.use(VeeValidate)
Vue.use(money, { precision: 2 })
Vue.use(VueMq, {
  breakpoints: {
    mobile: 500,
    desktop: Infinity
  }
})

Validator.localize({
  en: {
    attributes: {
      brand: 'brand',
      type: 'type',
      owner: 'owner',
      modelNumber: 'model number',
      serialNumber: 'serial number',
      modelYear: 'model year',
      purchasedFrom: 'purchased from',
      price: 'price',
      passwordResetEmail: 'email'
    }
  }
})

window.addEventListener('load', () => {
  fastclick.attach(document.body)

  new Vue({
    router,
    store,
    el: '#app',
    apolloProvider,
    render: h => h(App),
    beforeCreate () {
      this.$store.dispatch('auth/initialize')
    }
  })
})
