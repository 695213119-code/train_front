import request from '@/utils/request'
import  path from "@/utils/url"

//获取用户列表
export function queryUserTabulation(data) {
    return request({
      url: path.queryUserTabulation,
      method: 'post',
      data
    })
  }

//添加管理员
export function addAdministrators(data) {
  return request({
    url: path.addAdministrators,
    method: 'post',
    data
  })
}

//添加管理员
export function resetPassword(data) {
  return request({
    url: path.resetPassword+"?userId="+data,
    method: 'put'
  })
}