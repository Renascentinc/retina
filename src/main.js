/* eslint-disable no-new */

import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import App from './App'
import router from './router'
import attachFastClick from 'fastclick'
import DrawerLayout from 'vue-drawer-layout'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  uri: 'http://retina-api-develop.us-east-2.elasticbeanstalk.com/graphql'
})

const authLink = setContext((_, { headers = {} }) => {
  const token = localStorage.getItem('token')
  if (token) {
    headers.authorization = `Bearer ${token}`
  }

  return {
    headers
  }
})

const defaultClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient
})

Vue.config.productionTip = false

Vue.use(VueLazyload)
Vue.use(DrawerLayout)
Vue.use(VueApollo)

attachFastClick(document.body)

new Vue({
  router,
  el: '#app',
  apolloProvider,
  render: h => h(App)
})
