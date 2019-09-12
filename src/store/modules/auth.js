import { defaultClient as apollo } from '@/apollo'
import Roles from '@/utils/roles'
import User from '@/models/user'
import {
  loginMutation,
  logoutMutation
} from '@/utils/gql'
import router from '@/router'
import Vue from 'vue'
import { handleCommonErrors } from '@/utils/api-response-errors'
import { showErrorMsg } from '@/utils/alerts'

const auth = {
  namespaced: true,

  state: {
    currentUser: null,
    token: null
  },

  getters: {
    isAdminUser (state, getters) {
      return state.currentUser.role === Roles.ADMIN
    },

    isAuthenticated (state) {
      return !!state.token
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
    },

    setAuthStatus (state, { token, currentUser }) {
      let user = currentUser ? JSON.stringify(currentUser) : null
      window.localStorage.setItem('token', token)
      window.localStorage.setItem('currentUser', user)
      state.token = token
      state.currentUser = currentUser
    },

    clearAuthStatus (state) {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('currentUser')
      state.currentUser = null
      state.token = null
      router.push({ path: '/login' })
    }
  },

  actions: {
    async login ({ commit }, { email, password, organization_name }) {
      try {
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
      } catch (error) {
        if (handleCommonErrors(error)) {
          return
        }

        showErrorMsg()
        Vue.rollbar.error('Error in store:modules:auth:login', error)
      }
    },

    async logout ({ commit }) {
      try {
        await apollo.mutate({
          mutation: logoutMutation
        })
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('currentUser')
        commit('setToken', null)
        router.push({ path: '/login' })
        commit('setCurrentUser', null)
      } catch (error) {
        if (handleCommonErrors(error)) {
          return
        }

        showErrorMsg()
        Vue.rollbar.error('Error in store:modules:auth:logout', error)
      }
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
