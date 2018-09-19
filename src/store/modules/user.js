import { login, logout, getInfo, get, post } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userInfo:{},
    roles: [],
    sideItem: {},
    labelList:[],
    labelId:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    USER_INFO:(state,userInfo) => {
      sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
      const  user =JSON.parse(sessionStorage.getItem('userInfo'))
      state.userInfo = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LABLE_ITEM:(state, labelList) => {
      state.labelList=labelList
    },
    SET_LABLE_ID:(state, labelId) =>{
      state.labelId=labelId
    },
    SET_SIDE: (state,sideItem) => {
      state.sideItem = sideItem
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const userName = userInfo.userName
      return new Promise((resolve, reject) => {
        login(userName, userInfo.password).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if(data){
            commit('USER_INFO', data)
            sessionStorage.setItem("userInfo",JSON.stringify(data))
          }else{
            commit('USER_INFO', {})
            sessionStorage.removeItem('userInfo')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('USER_INFO', {})
          sessionStorage.removeItem('userInfo')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // get 请求
    Get({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        get(data.url, data.params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    TokenPost({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        data.data.token = state.token
        post(data.url, data.data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // post 请求
    Post({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        post(data.url, data.data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
