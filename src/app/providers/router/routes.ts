import type { RouterOptions } from "vue-router";

import { FavoritesPage } from "@/pages/favorites";
import { MapPage } from "@/pages/map";
import { SearchPage } from "@/pages/search";


export const routes: RouterOptions["routes"] = [
  {
    path: "/",
    name: "home",
    component: SearchPage,
  },
  {
    path: "/search",
    component: SearchPage,
  },
  {
    path: "/favorite",
    name: "favorites",
    component: FavoritesPage,
  },
  {
    path: "/map",
    name: "map",
    component: MapPage,
  },
];
