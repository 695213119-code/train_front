const base_url="http://localhost:9001";
const url={
    //用户登录
    "login":base_url+"/apigateway/user-center/api/user-center/userManagementLogin",
    //获取用户详情
    "getUserInfo":base_url+"/apigateway/user-center/api/user-center/getUserDetails",
    //用户登出
    "userLogOut":base_url+"/apigateway/user-center/api/user-center/userLogOut",
    //用户登录日志
    "queryUserLoginLog":base_url+"/apigateway/user-center/api/user-loginLog/queryUserLoginLog"


}
export default url