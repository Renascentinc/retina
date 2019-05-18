import Vuex from 'vuex'
import Vue from 'vue'

import imageCompression from 'browser-image-compression'
import gql from 'graphql-tag'

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
        return this.$apollo.mutate({
          mutation: gql`
            mutation newConfigurableItem($newConfigurableItem: NewConfigurableItem!) {
              createConfigurableItem(newConfigurableItem: $newConfigurableItem) {
                id
              }
            }
          `,
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

    async createNewTool ({ dispatch }, tool) {
      let brandRequest = dispatch('createNewConfigurableItemIfNecessary', tool.brand)
      let typeRequest = dispatch('createNewConfigurableItemIfNecessary', tool.type)
      let purchaseRequest = dispatch('createNewConfigurableItemIfNecessary', tool.purchased_from)
      let photoRequest = dispatch('savePhotoIfNecessary', tool.image)

      let [brandResponse, typeResponse, purchaseResponse, photoResponse] = await Promise.all([brandRequest, typeRequest, purchaseRequest, photoRequest])

      if (brandResponse) tool.brand.id = brandResponse.data.createConfigurableItem.id
      if (typeResponse) tool.type.id = typeResponse.data.createConfigurableItem.id
      if (purchaseResponse) tool.purchased_from.id = purchaseResponse.data.createConfigurableItem.id
      if (photoResponse) tool.photo = photoResponse

      await this.$apollo
        .mutate({
          mutation: gql`
                mutation updateTool($tool: UpdatedTool!) {
                  updateTool(updatedTool: $tool) {
                    id
                  }
                }
              `,

          variables: {
            tool: this.editedTool.getState()
          }
        })
    }
  }
})
