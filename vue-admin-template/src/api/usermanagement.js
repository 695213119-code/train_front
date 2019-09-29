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