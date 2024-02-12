import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'hello',
      component: () => import('../views/Hello.vue')
    },
    {
      path: '/genres',
      name: 'genres',
      component: () => import('../views/Genres.vue')
    },
    {
      path: '/my-stations',
      name: 'my-stations',
      component: () => import('../views/MyStations.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue')
    }
  ]
})

export default router
