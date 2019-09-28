import request from '@/utils/request'
import  path from "@/utils/url"

//角色赋权
export function roleUthorization(data) {
  return request({
    url: path.roleEmpowerment,
    method: 'post',
    data
  })
}

//列表查询
export function getRoleList(data) {
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

//修改角色
export function updateRole(data) {
  return request({
    url: path.editRole,
    method: 'put',
    data
  })
}

//删除角色
export function deleteRole(id) {
  return request({
    url: path.deleteRole+"?roleId="+id,
    method: 'delete'
  })
}
