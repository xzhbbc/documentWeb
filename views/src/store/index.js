import Vue from 'vue';
import Vuex from 'vuex'
import * as api from '../util/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: false,
    department: [],
    user: {},
    routeId: ''
  },
  mutations: {
    setLogin(state, data) {
      if (data) {
        state.login = true
        state.user = data
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        state.login = false
        state.user = {}
        localStorage.removeItem('user')
      }
    },
    async getLogin(state) {
      let checkUser = await api.get('/user/loginStatus')
      // let user = JSON.parse(localStorage.getItem('user'))
      if (checkUser._id) {
        state.login = true
        state.user = checkUser
      } else {
        state.login = false
        state.user = {}
      }
    },
    async getDepartment(state) {
      let data = await api.get('/front/getDepartment')
      // console.log(data)
      if (data.length != void 0&&data.length != 0) {
        state.department = data
        localStorage.setItem('department', JSON.stringify(data))
      }
    },
    setRouterId(state, id) {
      state.routeId = id
    }
  },
  getters: {
    login: state => state.login,
    getDepartment: state => state.department,
    user: state => state.user,
    routeId: state => state.routeId
  }
})

export default store
