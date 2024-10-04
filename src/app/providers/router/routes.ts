export const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/search"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/pages/search"),
  },
  {
    path: "/favorite",
    name: "favorite",
    component: () => import("@/pages/favorites"),
  },
  {
    path: "/map",
    name: "world map",
    component: () => import("@/pages/map"),
  },
];
