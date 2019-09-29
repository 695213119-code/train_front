import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  //仪表盘
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },


  {
    path: '/user',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'user',
    meta: {
      title: '用户',
      icon: 'user'
    },
    children: [

      //用户管理
      {
        path: 'usermanagement',
        name: 'UserManagement',
        component: () => import('@/views/usermanagement/index'),
        meta: { title: '用户管理', icon: 'usermanagement ' }
      },

      //实名认证
      {
        path: 'authentication',
        name: 'Authentication',
        component: () => import('@/views/authentication/index'),
        meta: { title: '实名认证', icon: 'authentication' }
      },
    ]
  },

  //设置
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '系统设置', icon: 'example' },
    children: [

      //登录日志
      {
        path: 'loginlog',
        name: 'Loginlog',
        component: () => import('@/views/loginlog/index'),
        meta: { title: '登录日志', icon: 'loginlog' }
      },

      //数据字典
       {
         path: 'datadictionary',
         name: 'DataDictionary',
         component: () => import('@/views/datadictionary/index'),
         meta: { title: '数据字典', icon: 'datadictionary' }
      },

      //角色权限
       {
         path: 'roleauthority',
         name: 'RoleAuthority',
         component: () => import('@/views/roleauthority/index'),
         meta: { title: '角色权限', icon: 'roleauthority' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
