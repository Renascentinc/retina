import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
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
    },
    currentUser () {
      return JSON.parse(window.localStorage.getItem('currentUser'))
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
