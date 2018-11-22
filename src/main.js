/* eslint-disable no-new */

import '../node_modules/v-calendar/lib/v-calendar.min.css'

import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import App from './App'
import router from './router'
import store from './store'
import attachFastClick from 'fastclick'
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
import VueSVGIcon from 'vue-svgicon'
import VueJsModal from 'vue-js-modal'
import VueNotifications from 'vue-notifications'
import swal from 'sweetalert'

function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return swal(title, message, type)
}

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

const cache = new InMemoryCache({
  fragmentMatcher,
  dataIdFromObject: object => {
    // fixing issue on history page where objects were getting scrambled with each other (same ids but different data at different snapshots in time).
    // using a combination of fields to create a unique identifier for the entries
    if (object.__typename === 'PreviousToolSnapshotDiff') {
      return `${object.id}${object.__typename}${object.owner ? object.owner.id || object.owner.id : ''}${object.status}`
    }

    if (object.__typename === 'ToolHistoryEntryMetadata') {
      return `${object.timestamp}${object.__typename}`
    }

    if (router.currentRoute.path === '/history' && object.__typename === 'Tool') {
      return `${object.id}${object.brand ? object.brand.name : ''}${object.type ? object.type.name : ''}${object.__typename}`
    }

    return `${object.id}${object.__typename}`
  }
})

// TODO: dynamically switch between prod and develop api's
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
    if (code === ApiStatusCodes.UNAUTHENTICATED && router.currentRoute.path !== '/login' && router.currentRoute.path !== '/password-reset') {
      window.localStorage.removeItem('token')
      swal('SESSION EXPIRED', 'Your Session Has Expired. Please Log In Again', VueNotifications.types.error)
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
Vue.use(DrawerLayout)
Vue.use(VueApollo)
Vue.use(VCalendar)
Vue.use(VeeValidate)
Vue.use(VueSVGIcon)
Vue.use(VueLazyload)
Vue.use(VueJsModal, {
  dialog: true
})
Vue.use(VueNotifications, {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
})
Vue.use(VueMq, {
  breakpoints: {
    mobile: 500,
    desktop: Infinity
  }
})

attachFastClick(document.body, { tapDelay: 200 })

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
      price: 'price',
      passwordResetEmail: 'email'
    }
  }
}

Validator.localize(dictionary)
