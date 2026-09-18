import { createRouter, createWebHistory } from 'vue-router'
import CalculatorHome from '../views/CalculatorHome.vue'
import AuthCallback from '../views/AuthCallback.vue'

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
    }
  ]
})

export default router