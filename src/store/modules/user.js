import { login, logout, getInfo, get, post } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import  global_ from '@/utils/public'

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    roles: [],
    sideItem: [],
    labelList: [],
    labelId: '',
    dictLabels: [],
    userIsClass: '/manager/user',
    navType: '',
    mesCount: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    USER_INFO: (state, userInfo) => {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      const user = JSON.parse(sessionStorage.getItem('userInfo'))
      state.userInfo = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LABLE_ITEM: (state, labelList) => {
      state.labelList = labelList
    },
    SET_LABLE_ID: (state, labelId) => {
      state.labelId = labelId
    },
    SET_SIDE: (state, sideItem) => {
      state.sideItem = sideItem
    },
    SET_DICT_LABELS: (state, dictLabels) => {
      state.dictLabels = dictLabels
    },
    SET_NAV_TYPE: (state, navType) => {
      state.navType = navType
    },
    SET_IS_CLASS: (state, userIsClass) => {
      state.userIsClass = userIsClass
    },
    SET_MES_COUNT: (state, mesCount) => {
      state.mesCount = mesCount
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
    GetLablesList({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        get(data.url, data.params).then(response => {
          commit('SET_DICT_LABELS', response.data)
          // resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetCategorys({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        get(data.url, data.params).then(response => {
          commit('SET_SIDE', response.data)
          console.log(response.data)
          commit('SET_LABLE_ITEM', response.data[0].labelDtoList)
          const type = global_.categoryItems[response.data[0].id]
          commit('SET_NAV_TYPE', type)
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
