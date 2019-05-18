import Vuex from 'vuex'
import Vue from 'vue'
import { defaultClient as apollo } from './apollo'
import imageCompression from 'browser-image-compression'
import { updateToolMutation, createConfigurableItemMutation, decomissionToolMutation } from './utils/gql'
import { showErrorMsg } from './utils/swal'
import swal from 'sweetalert2'

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
    createNewConfigurableItemIfNecessary (store, configurableItem) {
      if (configurableItem.isNewConfigurableItem) {
        return apollo.mutate({
          mutation: createConfigurableItemMutation,
          variables: {
            newConfigurableItem: {
              type: configurableItem.type,
              name: configurableItem.name,
              sanctioned: true
            }
          }
        })
      }

      return null
    },

    savePhotoIfNecessary (store, image) {
      return new Promise((resolve) => {
        if (image) {
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
        } else {
          resolve(null)
        }
      })
    },

    async updateTool ({ dispatch }, tool) {
      try {
        let brandRequest = dispatch('createNewConfigurableItemIfNecessary', tool.brand)
        let typeRequest = dispatch('createNewConfigurableItemIfNecessary', tool.type)
        let purchaseRequest = dispatch('createNewConfigurableItemIfNecessary', tool.purchased_from)
        let photoRequest = dispatch('savePhotoIfNecessary', tool.image)

        let [brandResponse, typeResponse, purchaseResponse, photoResponse] = await Promise.all([brandRequest, typeRequest, purchaseRequest, photoRequest])

        if (brandResponse) tool.brand.id = brandResponse.data.createConfigurableItem.id
        if (typeResponse) tool.type.id = typeResponse.data.createConfigurableItem.id
        if (purchaseResponse) tool.purchased_from.id = purchaseResponse.data.createConfigurableItem.id
        if (photoResponse) tool.photo = photoResponse

        await apollo.mutate({
          mutation: updateToolMutation,
          variables: {
            tool: tool.getState()
          }
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
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
        // eslint-disable-next-line no-console
        console.error(error)
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
        // eslint-disable-next-line no-console
        console.error(error)
        showErrorMsg()
      }
    }
  }
})
