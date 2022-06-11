
const state = {
  PublicKey: '',
  PrivateKey: '',
  AccountAddress: ''
}

const mutations = {
  SET_ACCOUNT: (state, payload) => {
    state.PublicKey = payload.PublicKey;
    state.PrivateKey = payload.PrivateKey;
    state.AccountAddress = payload.AccountAddress;
  }
}


export default {
  namespaced: true,
  state,
  mutations
}
