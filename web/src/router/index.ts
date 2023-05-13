import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/RoomsView.vue'
import RoomView from '../views/RoomView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        display: '主页'
      }
    },
    {
      path: '/rooms',
      name: 'RoomsView',
      component: RoomsView,
      props: true,
      meta: {
        display: '房间'
      }
    },
    {
      path: '/room/:roomId',
      name: 'RoomView',
      component: RoomView,
      props: true
    },
    {
      path: '/admin',
      name: 'AdminView',
      component: AdminView,
      props: true
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue'),
      meta: {
        display: '关于'
      }
    }
  ]
})

export default router
