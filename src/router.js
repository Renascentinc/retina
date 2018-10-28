import Vue from 'vue'
import Router from 'vue-router'
import Login from './routes/login'
import Application from './routes/application'
import Tools from './routes/tools'

// lazy loaded routes
const Configuration = () => import('./routes/configuration')
const History = () => import('./routes/history')
const UserDetail = () => import('./routes/user-detail')
const Users = () => import('./routes/users')
const NewTool = () => import('./routes/new-tool')
const ToolDetail = () => import('./routes/tool-detail')

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Application,
      children: [
        {
          path: '/',
          redirect: '/tools'
        },
        {
          path: 'tools',
          component: Tools,
          name: 'tools'
        },
        {
          path: 'tool/:toolId',
          component: ToolDetail,
          name: 'toolDetail'
        },
        {
          path: 'users',
          component: Users,
          name: 'users'
        },
        {
          path: 'user/:userId',
          component: UserDetail,
          name: 'userDetail'
        },
        {
          path: 'new-tool',
          component: NewTool,
          name: 'newTool'
        },
        {
          path: 'history',
          component: History,
          name: 'history'
        },
        {
          path: 'configuration',
          component: Configuration,
          name: 'configuration'
        }
      ]
    }
  ]
})
