import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: '个人中心',
        component: () => import('@/views/profile/index'),
        meta: { title: '个人主页' }
      }
    ]
  },
  {
    path: '/codemirror',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Codemirror',
        component: () => import('@/views/codemirror/index'),
        meta: { title: '智能合约', icon: 'tab' }
      }
    ]
  },
  {
    path: '/trade',
    component: Layout,
    redirect: '/trade/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/trade/index'),
        name: 'trade',
        meta: { title: '交易信息', noCache: true }
      }
    ]
  },
  {
    path: '/address',
    component: Layout,
    redirect: '/address/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/address/index'),
        name: 'address',
        meta: { title: '地址信息', noCache: true }
      }
    ]
  },
  {
    path: '/block',
    component: Layout,
    redirect: '/block/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/block/index'),
        name: 'block',
        meta: { title: '区块信息', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/visual',
    component: Layout,
    redirect: '/visual/table',
    name: 'Visual',
    meta: { title: '可视化大盘', icon: 'el-icon-s-help', roles: ['regulator'] },
    children: [
      {
        path: 'graph',
        name: 'Graph',
        component: () => import('@/views/graph/index'),
        meta: { title: '指标图谱', icon: 'tree-table' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '交易记录', icon: 'table' }
      },
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/node/index'),
        meta: { title: '节点可视化', icon: 'tree' }
      }
      // {
      //   path: 'tree',
      //   name: 'Tree',
      //   component: () => import('@/views/tree/index'),
      //   meta: { title: 'Tree', icon: 'tree' }
      // }
    ]
  },
  {
    path: '/browse',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Browse',
        component: () => import('@/views/browse/index'),
        meta: { title: '浏览', icon: 'component', roles: ['consumer', 'provider'] }
      }
    ]
  },
  {
    path: '/cart',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Cart',
        component: () => import('@/views/cart/index'),
        meta: { title: '购物车', icon: 'shopping', roles: ['consumer'] }
      }
    ]
  },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: '层级目录',
  //     icon: 'nested',
  //     roles: ['regulator']
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'Menu2' }
  //     }
  //   ]
  // },

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
