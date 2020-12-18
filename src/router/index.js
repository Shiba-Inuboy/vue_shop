import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/roles/Roles.vue'
import Categories from '../components/categories/Categories.vue'
import Goods from '../components/goods/Goods.vue'
import Orders from '../components/orders/Orders.vue'
import Params from '../components/params/Params.vue'
import Reports from '../components/reports/Reports.vue'
import Rights from '../components/rights/Rights.vue'
import Add from '../components/goods/Add.vue'
import Edit from '../components/goods/Edit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      }
      ,
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods',
        component: Goods,
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/reports',
        component: Reports
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/goods/edit/:id',
        name:'GoodsEdit',
        component: Edit
      }
    ]

  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from, next);
  // to表示将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数表示放行
  // next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
