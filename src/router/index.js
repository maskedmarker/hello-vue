import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载示例
const HomeView = () => import('./views/HomeView.vue')
const UserView = () => import('./views/UserView.vue')
const NamedViewDemo = () => import('./views/NamedViewDemo.vue')
const ProgrammaticNav = () => import('./views/ProgrammaticNav.vue')
const GuardDemo = () => import('./views/GuardDemo.vue')
const NewsList = () => import('./views/NewsList.vue')
const MessagesList = () => import('./views/MessagesList.vue')
const NotFound = () => import('./views/NotFound.vue')

// 模拟登录状态
const isAuthenticated = () => localStorage.getItem('vue3-demo-logged-in') === 'true'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomePage.vue')
  },
  // 嵌套路由
  {
    path: '/home',
    name: 'home-parent',
    component: HomeView,
    children: [
      {
        path: 'news',
        name: 'news',
        component: NewsList
      },
      {
        path: 'messages',
        name: 'messages',
        component: MessagesList
      }
    ]
  },
  // 动态路由参数
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    // 路由级别守卫
    beforeEnter: (to, from) => {
      console.log(`[beforeEnter] 准备访问用户: ${to.params.id}`)
    }
  },
  // 命名视图
  {
    path: '/named-view',
    name: 'named-view',
    components: {
      default: () => import('./views/NamedViewDemo.vue'),
      header: () => import('./views/named/NamedHeader.vue'),
      main: () => import('./views/named/NamedMain.vue'),
      sidebar: () => import('./views/named/NamedSidebar.vue'),
      footer: () => import('./views/named/NamedFooter.vue')
    }
  },
  // 编程式导航
  {
    path: '/programmatic',
    name: 'programmatic',
    component: ProgrammaticNav
  },
  // 路由守卫演示
  {
    path: '/guard-demo',
    name: 'guard-demo',
    component: GuardDemo,
    beforeEnter: (to, from) => {
      if (!isAuthenticated()) {
        // 模拟未登录时重定向
        return confirm('此页面需要登录。是否跳转到用户1页面（模拟登录）？') 
          ? '/user/1' 
          : false
      }
    }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from) => {
  console.log(`[全局 beforeEach] ${from.path} -> ${to.path}`)
  return true
})

// 全局后置守卫
router.afterEach((to, from) => {
  console.log(`[全局 afterEach] 已导航到: ${to.path}`)
})

export default router
