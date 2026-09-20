import { createRouter, createWebHistory } from 'vue-router'
import CalculatorHome from '../views/CalculatorHome.vue'
import AuthCallback from '../views/AuthCallback.vue'
import AuthError from '../views/AuthError.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: 'Home', 
      component: CalculatorHome 
    },
    { 
      path: '/auth/callback', 
      name: 'AuthCallback', 
      component: AuthCallback 
    },
    { 
      path: '/auth/error', 
      name: 'AuthError', 
      component: AuthError 
    }
  ]
})

export default router