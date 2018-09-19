import request from '@/utils/request'

export function login(userName, password) {
  return request({
    url: '/bbsusercenter/front/login',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}
export function get(url, params) {
  return request({
    url: url,
    params
  })
}
export function post(url, data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}
export function getInfo(token) {
  return request({
    url: '/bbsusercenter/frontuser/info',
    method: 'post',
    data:{token:token}
  })
}

export function logout(token) {
  return request({
    url: '/bbsusercenter/front/logout/'+token,
    method: 'get',
  })
}
