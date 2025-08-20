// src/router/index.ts (或 index.js)
import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// 使用 defineAsyncComponent 進行動態導入
const LoginView = defineAsyncComponent(() => import('../views/LoginView.vue'))
const SignUpView = defineAsyncComponent(() => import('../views/SignUpView.vue'))
const TodoListView = defineAsyncComponent(() => import('../views/TodoListView.vue'))

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登入' }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { title: '註冊' }
  },
  {
    path: '/todos',
    name: 'TodoList',
    component: TodoListView,
    // meta: { title: '待辦事項', requiresAuth: true }
    meta: { title: '待辦事項' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory('/hexVue20252/'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 全局前置守衛
router.beforeEach((to, from, next) => {
  // 設置頁面標題
  if (to.meta.title) {
    document.title = `${to.meta.title} | 待辦事項`
  }
  
  // 檢查是否需要登入
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
