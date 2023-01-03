export default {
  SAVEUSERNAME({ commit }, username) {
    commit("saveUsername", username)
  },
  SAVECARTCOUNT({ commit }, count) {
    commit("saveCartCount", count)
  },
}
