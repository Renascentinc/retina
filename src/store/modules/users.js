import Vue from 'vue'
import { defaultClient as apollo } from '@/apollo'
import swal from 'sweetalert2'
import {
  deleteUserMutation,
  updateUserMutation
} from '@/utils/gql'
import { handleCommonErrors } from '@/utils/api-response-errors'

const users = {
  namespaced: true,

  actions: {
    async deleteUser (store, user) {
      let result = await swal({
        type: 'warning',
        title: 'CONFIRM DELETE USER',
        text: `Are You Sure You Want To Delete ${user.name}? This Action Cannot Be Undone`,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: 'DELETE',
        cancelButtonText: 'CANCEL',
        confirmButtonColor: '#CE352F'
      })

      if (!result.value) {
        return
      }

      try {
        await apollo.mutate({
          mutation: deleteUserMutation,
          variables: {
            updatedUser: user.getState()
          }
        })

        user.status = 'INACTIVE'
      } catch (error) {
        if (handleCommonErrors(error)) {
          return
        }

        Vue.rollbar.error('Error in store:modules:user:deleteUser', error)
        throw error
      }
    },

    async updateUser (store, user) {
      try {
        await apollo.mutate({
          mutation: updateUserMutation,

          variables: {
            user: user.getState()
          }
        })
      } catch (error) {
        if (handleCommonErrors(error)) {
          return
        }

        Vue.rollbar.error('Error in store:modules:user:updateUser', error)
        throw error
      }
    }
  }
}

export default users
