import Vuex from 'vuex'
import Vue from 'vue'
import { defaultClient as apollo } from './apollo'
import imageCompression from 'browser-image-compression'
import { showErrorMsg } from './utils/alerts'
import swal from 'sweetalert2'
import {
  updateToolMutation,
  createConfigurableItemMutation,
  decomissionToolMutation,
  createNewToolMutation,
  deleteUserMutation,
  updateUserMutation
} from './utils/gql'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedToolsMap: { },
    transferState: 'INITIAL',
    showOnlySelectedTools: false
  },

  getters: {
    selectedTools (state) {
      let selectedTools = []
      Object.entries(state.selectedToolsMap).forEach(entry => {
        if (entry[1]) {
          selectedTools.push(entry[0])
        }
      })
      return selectedTools
    }
  },

  mutations: {
    toggleToolSelection (state, id) {
      Vue.set(state.selectedToolsMap, id, !state.selectedToolsMap[id])
    },

    setToolSelection (state, id, newValue) {
      Vue.set(state.selectedToolsMap, id, newValue)
    },

    resetSelectedTools (state) {
      state.selectedToolsMap = {}
    },

    updateTransferStatus (state, newStatus) {
      state.transferState = newStatus
    },

    toggleShowOnlySelectedTools (state) {
      state.showOnlySelectedTools = !state.showOnlySelectedTools
    },

    setShowOnlySelectedTools (state, newState) {
      state.showOnlySelectedTools = newState
    }
  },

  actions: {
    async saveSpecialToolMetadata ({ dispatch }, tool) {
      let brandResponse = await dispatch('createNewConfigurableItem', tool.brand)
      let typeResponse = await dispatch('createNewConfigurableItem', tool.type)
      let purchaseResponse = await dispatch('createNewConfigurableItem', tool.purchased_from)
      let photoResponse = await dispatch('savePhoto', tool.image)

      if (brandResponse) tool.brand.id = brandResponse.data.createConfigurableItem.id
      if (typeResponse) tool.type.id = typeResponse.data.createConfigurableItem.id
      if (purchaseResponse) tool.purchased_from.id = purchaseResponse.data.createConfigurableItem.id
      if (photoResponse) tool.photo = photoResponse
    },

    async createNewConfigurableItem (store, configurableItem) {
      if (!configurableItem || !configurableItem.isNewConfigurableItem) {
        return
      }

      await apollo.mutate({
        mutation: createConfigurableItemMutation,
        variables: {
          newConfigurableItem: {
            type: configurableItem.type,
            name: configurableItem.name,
            sanctioned: true
          }
        }
      })
    },

    savePhoto (store, image) {
      if (!image) {
        return
      }

      return new Promise((resolve) => {
        imageCompression(image, 1, 1920).then(compressedImage => {
          let fd = new FormData()

          let key = `tool_preview-${new Date().getTime()}`

          fd.append('key', key)
          fd.append('acl', 'public-read')
          fd.append('Content-Type', compressedImage.type)
          // TODO enable auth for photo upload
          // fd.append('AWSAccessKeyId', 'YOUR ACCESS KEY')
          // fd.append('policy', 'YOUR POLICY')
          // fd.append('signature', 'YOUR SIGNATURE')

          fd.append('file', compressedImage)

          var xhr = new XMLHttpRequest()

          xhr.open('POST', 'https://retina-images.s3.amazonaws.com/', true)

          xhr.onload = () => {
            resolve(`https://s3.us-east-2.amazonaws.com/retina-images/${key}`)
          }

          xhr.send(fd)
        })
      })
    },

    async updateTool ({ dispatch }, tool) {
      try {
        await dispatch('saveSpecialToolMetadata', tool)

        await apollo.mutate({
          mutation: updateToolMutation,
          variables: {
            tool: tool.getState()
          }
        })
      } catch (error) {
        window.console.error(error)
        showErrorMsg()
      }
    },

    async createNewTool ({ dispatch }, tool) {
      try {
        await dispatch('saveSpecialToolMetadata', tool)

        let response = await apollo.mutate({
          mutation: createNewToolMutation,
          variables: {
            newTool: tool.getState()
          }
        })

        return response
      } catch (error) {
        window.console.error(error)
        showErrorMsg()
      }
    },

    async saveStatusChange (store, { tool, newStatus }) {
      // save current status in case request fails but set the tool status assuming it will succeed
      let currentStatus = tool.status

      try {
        tool.status = newStatus

        await apollo.mutate({
          mutation: updateToolMutation,
          variables: {
            tool: tool.getState()
          }
        })
      } catch (error) {
        window.console.error(error)
        tool.status = currentStatus
        showErrorMsg()
      }
    },

    async decomissionTool ({ commit }, { tool, newStatus }) {
      let result = await swal({
        type: 'warning',
        title: 'CONFIRM DECOMISSION',
        text: `Are you sure you want to mark this tool as ${newStatus}? This action cannot be undone.`,
        input: 'textarea',
        inputPlaceholder: `Please Explain Why This Tool is Being Marked as ${newStatus}`,
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonText: 'CANCEL',
        confirmButtonText: 'SUBMIT',
        confirmButtonColor: '#404040',
        inputValidator: (value) => !value && 'Decomission Reason is Required'
      })

      if (!result.value) {
        return
      }

      try {
        await apollo.mutate({
          mutation: decomissionToolMutation,
          variables: {
            tool_id: tool.id,
            decomissioned_status: newStatus,
            decomission_reason: result.value
          }
        })
        commit('setToolSelection', tool.id, false)
      } catch (error) {
        window.console.error(error)
        showErrorMsg()
      }
    },

    async deleteUser (store, user) {
      let result = await swal({
        type: 'warning',
        title: 'CONFIRM DELETE USER',
        text: `Are You Sure You Want To Delete ${user.full_name}? This Action Cannot Be Undone`,
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
})
