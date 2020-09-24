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
import fastclick from '@jbcampbell/fastclick'
import ToggleButton from 'vue-js-toggle-button'
import Rollbar from 'vue-rollbar'
import pkg from '../package.json'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

if (process.env.VUE_APP_PLATFORM === 'cordova') {
  let cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

const vuetify = new Vuetify({
  icons: {
    iconfont: 'fa'
  },
  theme: {
    themes: {
      dark: {
        primary: '#CE352F'
      },
      light: {
        primary: '#CE352F'
      }
    }
  }
})

Vue.use(Vuetify)
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
Vue.use(Rollbar, {
  accessToken: 'b3993039bb7140109207d1ac672f0848',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: true,
  environment: process.env.NODE_ENV,
  payload: {
    client: {
      javascript: {
        code_version: pkg.version
      }
    }
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
    vuetify,
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
