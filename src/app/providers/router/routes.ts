import type { RouterOptions } from "vue-router";

export const routes: RouterOptions["routes"] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/search"),
  },
  {
    path: "/search",
    component: () => import("@/pages/search"),
  },
  {
    path: "/favorite",
    name: "favorites",
    component: () => import("@/pages/favorites"),
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/pages/map"),
  },
];
