import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

//定义操作的类型
const types = {
  //判断身份认证是否通过
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: " SET_USER",
};
export default new Vuex.Store({
  state: {
    //是否授权
    isAuthenticated: false,
    //解析的用户信息
    user: {},
    isCollapse: false,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user,
  },
  mutations: {
    [types.SET_AUTHENTICATED](state, isAuthenticated) {
      if (isAuthenticated) {
        return (state.isAuthenticated = isAuthenticated);
      } else {
        return (state.isAuthenticated = false);
      }
    },
    [types.SET_USER](state, user) {
      if (user) {
        return (state.user = user);
      } else {
        return (state.user = {});
      }
    },
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse;
    },
  },
  actions: {
    setAuthenticated: ({ commit }, isAuthenticated) => {
      commit(types.SET_AUTHENTICATED, isAuthenticated);
    },
    setUser: ({ commit }, user) => {
      commit(types.SET_USER, user);
    },
    //退出方法
    clearCurrentState: ({ commit }) => {
      commit(types.SET_AUTHENTICATED, false);
      commit(types.SET_USER, null);
    },
  },
  modules: {},
  types,
});
