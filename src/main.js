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
import { InMemoryCache } from 'apollo-cache-inmemory'

const link = new HttpLink({
  uri: 'http://retina-api-release.us-east-2.elasticbeanstalk.com/graphql'
})

const defaultClient = new ApolloClient({
  link,
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
