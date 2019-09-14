import Vue from 'vue'
import ApiStatusCodes from '@/utils/api-status-codes'
import { defaultClient as apollo } from '@/apollo'
import imageCompression from 'browser-image-compression'
import { showErrorMsg } from '@/utils/alerts'
import { handleCommonErrors, hasGraphqlErrorCode } from '@/utils/api-response-errors'
import swal from 'sweetalert2'
import {
  updateToolMutation,
  decomissionToolMutation,
  createNewToolMutation
} from '@/utils/gql'

const tools = {
  namespaced: true,

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
      let brandResponse = await dispatch('configurableItems/createNewConfigurableItem', tool.brand, { root: true })
      let typeResponse = await dispatch('configurableItems/createNewConfigurableItem', tool.type, { root: true })
      let purchaseResponse = await dispatch('configurableItems/createNewConfigurableItem', tool.purchased_from, { root: true })
      let photoResponse = await dispatch('savePhoto', tool.image)

      if (brandResponse) tool.brand.id = brandResponse.data.createConfigurableItem.id
      if (typeResponse) tool.type.id = typeResponse.data.createConfigurableItem.id
      if (purchaseResponse) tool.purchased_from.id = purchaseResponse.data.createConfigurableItem.id
      if (photoResponse) tool.photo = photoResponse
    },

    savePhoto (store, image) {
      if (!image) {
        return
      }

      return new Promise((resolve, reject) => {
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

          let xhr = new XMLHttpRequest()

          xhr.open('POST', 'https://retina-images.s3.amazonaws.com/', true)

          xhr.onload = () => {
            resolve(`https://s3.us-east-2.amazonaws.com/retina-images/${key}`)
          }

          xhr.onerror = (error) => {
            reject(error)
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
        if (handleCommonErrors(error)) {
          return
        }

        showErrorMsg()
        Vue.rollbar.error('Error in store:modules:tools:updateTool', error)
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
        if (handleCommonErrors(error)) {
          return
        }

        if (hasGraphqlErrorCode(error, ApiStatusCodes.TOOL_UNIQUE_IN_SERVICE_CONSTRAINT_VIOLATION)) {
          showErrorMsg('This tool already exists', 'Duplicate Tool')
        } else {
          showErrorMsg()
          Vue.rollbar.error('Error in store:modules:tools:createNewTool', error)
        }
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
        tool.status = currentStatus

        if (handleCommonErrors(error)) {
          return
        }

        showErrorMsg()
        Vue.rollbar.error('Error in store:modules:tools:saveStatusChange', error)
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
        return false
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
        return true
      } catch (error) {
        if (handleCommonErrors(error)) {
          return false
        }

        showErrorMsg()
        Vue.rollbar.error('Error in store:modules:tools:decomissionTool', error)
        return false
      }
    }
  }
}

export default tools
