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

if (process.env.VUE_APP_PLATFORM === 'cordova') {
  let cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

<<<<<<< HEAD
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

    if (object.__typename === 'ToolSnapshotMetadata') {
      return `${object.timestamp}${object.__typename}`
    }

    if (router.currentRoute.path.includes('history') && (object.__typename === 'Tool' || object.__typename === 'ConfigurableItem' || object.__typename === 'User')) {
      return `${JSON.stringify(object)}`
    }

    return `${object.id}${object.__typename}`
  }
})

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production' ? 'https://retina-api.renascentinc.com/graphql' : 'http://retina-api-develop.us-east-2.elasticbeanstalk.com/graphql'
})

const authLink = setContext(({ operationName }, { headers = {} }) => {
  const token = localStorage.getItem('token')
  if (token && operationName !== 'attemptUserLogin' && operationName !== 'attemptPasswordReset') {
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
      swal({
        type: 'error',
        title: 'SESSION EXPIRED',
        text: 'Your Session Has Expired. Please Log In Again',
        timer: 2000,
        showConfirmButton: false
      })
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

=======
>>>>>>> retina-339-refactor
Vue.config.productionTip = false
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

<<<<<<< HEAD
fastclick.attach(document.body)

new Vue({
  router,
  store,
  el: '#app',
  apolloProvider,
  render: h => h(App)
})

const dictionary = {
=======
Validator.localize({
>>>>>>> retina-339-refactor
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
<<<<<<< HEAD
}

Validator.localize(dictionary)
=======
})

window.addEventListener('load', () => {
  fastclick.attach(document.body)

  new Vue({
    router,
    store,
    el: '#app',
    apolloProvider,
    render: h => h(App)
  })
})
>>>>>>> retina-339-refactor
