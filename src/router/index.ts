import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'hello',
      component: () => import('../views/HelloPage.vue')
    },
    {
      path: '/genres',
      name: 'genres',
      component: () => import('../views/GenresPage.vue')
    },
    {
      path: '/my-stations',
      name: 'my-stations',
      component: () => import('../views/MyStationsPage.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchPage.vue')
    }
  ]
})

export default router
