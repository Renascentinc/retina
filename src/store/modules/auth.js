import { defaultClient as apollo } from '@/apollo'
import Roles from '@/utils/roles'
import {
  loginMutation,
  logoutMutation
} from '@/utils/gql'

const auth = {
  namespaced: true,

  state: {
    currentUser: null,
    token: null
  },

  getters: {
    isAdminUser (state, getters) {
      return getters.currentUser.role === Roles.ADMIN
    }
  },

  actions: {
    login (store) {
      window.localStorage.setItem('token', store.state.auth.token)
      window.localStorage.setItem('userId', JSON.stringify(store.state.auth.userId))
    },

    logout (store) {
      window.localStorage.clearItem('token')
      window.localStorage.clearItem('userId')
    },

    validateToken () {

    },

    fetchOrganizationName () {

    },

    initialize () {
      // check for token and user id
      let token = window.localStorage.getItem('token')
      let userId = window.localStorage.getItem('userId')

      if (!token || !userId) {
        // should just always route to login I think (check for edge cases)
      }

      // confirm token is valid

      // fetch user

      // set state
    }
  }
}

export default auth
