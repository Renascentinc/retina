import { defaultClient as apollo } from '@/apollo'
import swal from 'sweetalert2'
import {
  deleteUserMutation,
  updateUserMutation
} from '@/utils/gql'

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

      user.status = 'INACTIVE'
      await apollo.mutate({
        mutation: deleteUserMutation,
        variables: {
          updatedUser: user.getState()
        }
      })
    },

    async updateUser (store, user) {
      await apollo.mutate({
        mutation: updateUserMutation,

        variables: {
          user: user.getState()
        }
      })
    }
  }
}

export default users
