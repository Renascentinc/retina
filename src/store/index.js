import Vuex from 'vuex'
import Vue from 'vue'
import users from './modules/users'
import tools from './modules/tools'
import configurableItems from './modules/configurable-items'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    users,
    tools,
    configurableItems
  }
})

export default store
