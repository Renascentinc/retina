import Vue from 'vue'
import Router from 'vue-router'
import Login from './routes/login'
import Tools from './routes/tools'
import ToolDetail from './routes/tool-detail'
import Add from './routes/add'
import Users from './routes/users'
import UserDetail from './routes/user-detail'
import Reports from './routes/reports'
import Configuration from './routes/configuration'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
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
      component: ToolDetail
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/user/:userId',
      component: UserDetail
    },
    {
      path: '/add',
      component: Add
    },
    {
      path: '/reports',
      component: Reports
    },
    {
      path: '/configuration',
      component: Configuration
    }
  ]
})
