import Vuex from 'vuex'
import Vue from 'vue'

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
  }
})
