import request from '@/utils/request'
import  path from "@/utils/url"

//路由
export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

//列表查询
export function getRoles(data) {
  return request({
    url: path.queryRoleTabulation,
    method: 'get',
    params: data
  })
}

//添加角色
export function addRole(data) {
  return request({
    url: path.addRole,
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
