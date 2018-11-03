/* eslint-disable no-new */

import '../node_modules/v-calendar/lib/v-calendar.min.css'
import '../node_modules/vue-snotify/styles/simple.css'

import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import App from './App'
import router from './router'
import store from './store'
// import attachFastClick from 'fastclick'
import DrawerLayout from 'vue-drawer-layout'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import ApiStatusCodes from './utils/api-status-codes'
import VCalendar from 'v-calendar'
import VeeValidate, { Validator } from 'vee-validate'
import VueMq from 'vue-mq'
// import Snotify from 'vue-snotify'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    '__schema': {
      'types': [
        {
          'kind': 'UNION',
          'name': 'ToolOwner',
          'possibleTypes': [
            {
              'name': 'Location'
            },
            {
              'name': 'User'
            }
          ]
        }
      ]
    }
  }
})

const cache = new InMemoryCache({ fragmentMatcher })

const httpLink = new HttpLink({
  uri: 'http://retina-api-develop.us-east-2.elasticbeanstalk.com/graphql'
})

const authLink = setContext(({ operationName }, { headers = {} }) => {
  const token = localStorage.getItem('token')
  if (token && operationName !== 'attemptUserLogin') {
    headers.authorization = `Bearer ${token}`
  }

  return {
    headers
  }
})

const errorLink = onError(({ graphQLErrors = [] }) => {
  graphQLErrors.map(({ extensions: { code } }) => {
    if (code === ApiStatusCodes.UNAUTHENTICATED && router.currentRoute.path !== '/login') {
      window.localStorage.removeItem('token')
      window.confirm('Your Session Has Expired. Click Ok To Return To Log In')
      router.push({ path: '/login' })
    }
  })
})

const defaultClient = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  connectToDevTools: false,
  shouldBatch: true,
  cache
})

const apolloProvider = new VueApollo({
  defaultClient
})

Vue.config.productionTip = false
Vue.use(VueLazyload)
Vue.use(DrawerLayout)
Vue.use(VueApollo)
Vue.use(VCalendar)
Vue.use(VeeValidate)
Vue.use(VueMq, {
  mobile: 450,
  tablet: 1250,
  desktop: Infinity
})
// Vue.use(Snotify)

// attachFastClick(document.body)

new Vue({
  router,
  store,
  el: '#app',
  apolloProvider,
  render: h => h(App)
})

const dictionary = {
  en: {
    attributes: {
      brand: 'brand',
      type: 'type',
      owner: 'owner',
      modelNumber: 'model number',
      serialNumber: 'serial number',
      modelYear: 'model year',
      purchasedFrom: 'purchased from',
      price: 'price'
    }
  }
}

Validator.localize(dictionary)
