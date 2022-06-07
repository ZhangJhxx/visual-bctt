import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    language: 'zh'
  },
  mutations:{
    set_language(state,language) {
      state.language = language;
    }
  },
  modules: {
    app,
    permission,
    settings,
    user
  },
  getters:{
    ...getters,
  }
})

export default store
