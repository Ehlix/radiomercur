import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/search/SearchView.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/search/SearchView.vue"),
  },
  {
    path: "/favorite",
    name: "favorite",
    component: () => import("@/views/favorite/FavoriteView.vue"),
  },
  {
    path: "/map",
    name: "world map",
    component: () => import("@/views/map/MapView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
