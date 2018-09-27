import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/dashboard/index')
    },
      {
        path: 'detail',
        name:'detail',
        component: () => import('@/views/detail/bbs_detail')
      },
      {
        path: 'publish',
        name:'publish',
        component: () => import('@/views/publish/bbs_publish')
      },
      {
        path: 'bbs_edit',
        name:'bbs_edit',
        component: () => import('@/views/edit/bbs_edit')
      },
      {
        path: 'login',
        name:'login',
        component: () => import('@/views/login/bbs_login')
      },
      {
        path: 'manager',
        name:'manager',
        component: () => import('@/views/manager/manager'),
        children:[{
          path: 'user',
          name:'user',
          component: () => import('@/views/manager/user/user_info')
        },{
          path: 'user_bbs',
          name:'user_bbs',
          component: () => import('@/views/manager/bbs/user_bbs')
        },{
          path: 'user_message',
          name:'user_message',
          component: () => import('@/views/manager/message/user_message')
        }]

      }]
  },

  { path: '*', redirect: '/', hidden: true }
]

export default new Router({
  // mode: 'history', //  后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
