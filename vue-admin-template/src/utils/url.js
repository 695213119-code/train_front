const base_url="http://localhost:9001";
const url={
    //用户登录
    "login":base_url+"/apigateway/user-center/api/user-center/userManagementLogin",
    //获取用户详情
    "getUserInfo":base_url+"/apigateway/user-center/api/user-center/getUserDetails",
    //用户登出
    "userLogOut":base_url+"/apigateway/user-center/api/user-center/userLogOut",
    //用户登录日志
    "queryUserLoginLog":base_url+"/apigateway/user-center/api/user-loginLog/queryUserLoginLog",
    //获取数据字典
    "queryDictionaries":base_url+"/apigateway/core-service/api/data-dictionary/queryDictionaries",
    //添加字典
    "addDictionaries":base_url+"/apigateway/core-service/api/data-dictionary/addDictionaries",
    //修改字典
    "editDictionaries":base_url+"/apigateway/core-service/api/data-dictionary/editDictionaries",
    //获取角色列表
    "queryRoleTabulation":base_url+"/apigateway/authority-service/api/role/queryRoleTabulation",
    //添加角色
    "addRole":base_url+"/apigateway/authority-service/api/role/addRole",
    //角色赋权
    "roleEmpowerment":base_url+"/apigateway/authority-service/api/role/roleEmpowerment",
    //修改角色
    "editRole":base_url+"/apigateway/authority-service/api/role/editRole",
    //删除角色
    "deleteRole":base_url+"/apigateway/authority-service/api/role/deleteRole",
    //获取用户列表
    "queryUserTabulation":base_url+"/apigateway/user-center/api/user-center/queryUserTabulation"
}
export default url