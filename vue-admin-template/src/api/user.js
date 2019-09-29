import request from '@/utils/request'
import  path from "@/utils/url"

// 用户请求类
export function login(data) {
  return request({
    url: path.login,
    method: 'post',
    data
  })
}

//根据token获取用户信息
export function getInfo(access_token) {
  //管理端默认登查询类型为1
  let platform=1;
  return request({
    url: path.getUserInfo,
    method: 'get',
    params: { key:platform }
  })
}

export function logout() {
  return request({
    url: path.userLogOut,
    method: 'get'
  })
}
