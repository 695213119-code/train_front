import request from '@/utils/request'
import  path from "@/utils/url"


//登录日志列表请求
export function fetchList(data) {
  return request({
    url: path.queryUserLoginLog,
    method: 'post',
    data
  })
}

