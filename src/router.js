import Vue from 'vue'
import Router from 'vue-router'
import Login from './routes/Login'
import Tools from './routes/Tools'
import Add from './routes/Add'
import Info from './routes/Info'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/tools'
    },
    {
      path: '/tools',
      component: Tools
    },
    {
      path: '/tool/:toolId',
      component: Info
    },
    {
      path: '/add',
      component: Add
    }
  ]
})
