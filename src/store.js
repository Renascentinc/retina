import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vueg.Store({
  state: {
    selectedToolsMap: { }
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

    resetSelectedTools (state) {
      state.selectedToolsMap = {}
    }
  }
})
