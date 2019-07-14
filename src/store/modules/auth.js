import { defaultClient as apollo } from '@/apollo'
import Roles from '@/utils/roles'
import User from '@/models/user'
import {
  loginMutation,
  logoutMutation
} from '@/utils/gql'
import router from '@/router'

const auth = {
  namespaced: true,

  state: {
    currentUser: null,
    token: null
  },

  getters: {
    isAdminUser (state, getters) {
      return state.currentUser.role === Roles.ADMIN
    }
  },

  mutations: {
    setCurrentUser (state, currentUser) {
      if (currentUser) {
        state.currentUser = new User(currentUser)
      } else {
        state.currentUser = null
      }
    },

    setToken (state, token) {
      state.token = token
    }
  },

  actions: {
    async login ({ commit }, { email, password, organization_name }) {
      let { data: { login: { token, user } } } = await apollo.mutate({
        mutation: loginMutation,
        variables: {
          organization_name,
          email,
          password
        }
      })

      commit('setCurrentUser', user)
      commit('setToken', token)

      window.localStorage.setItem('token', token)
      window.localStorage.setItem('currentUser', JSON.stringify(user))
      router.push({ path: '/' })
    },

    async logout ({ commit }) {
      await apollo.mutate({
        mutation: logoutMutation
      })
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('currentUser')
      commit('setCurrentUser', null)
      commit('setToken', null)
      router.push({ path: '/login' })
    },

    async initialize ({ commit, dispatch }) {
      let token = window.localStorage.getItem('token')
      let currentUser = JSON.parse(window.localStorage.getItem('currentUser'))

      if (token && currentUser) {
        commit('setCurrentUser', currentUser)
        commit('setToken', token)
      }
    }
  }
}

export default auth
