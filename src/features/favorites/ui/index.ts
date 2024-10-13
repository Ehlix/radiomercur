import { defineAsyncComponent } from "vue";

import AddFolder from "./AddFolder.vue";
import ChangePage from "./ChangePage.vue";
import FavoriteList from "./FavoriteList.vue";
import FavoriteNav from "./FavoriteNav.vue";
import RenameFolder from "./RenameFolder.vue";


const AddToFavorite = defineAsyncComponent(() => import("./AddToFavorite.vue"));

export {
  AddFolder,
  AddToFavorite,
  ChangePage,
  FavoriteList,
  FavoriteNav,
  RenameFolder,
};
