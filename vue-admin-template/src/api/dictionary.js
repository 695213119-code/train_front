import request from '@/utils/request'
import  path from "@/utils/url"

//数据字典列表请求
export function queryDictionaries(data) {
    return request({
      url: path.queryDictionaries,
      method: 'get',
      params: data
    })
  }
//添加字典
  export function createArticle(data) {
    return request({
      url: path.addDictionaries,
      method: 'post',
      data
    })
  }
//修改字典
  export function updateArticle(data) {
    return request({
      url: path.editDictionaries,
      method: 'put',
      data
    })
  }