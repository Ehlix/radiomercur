import { defineAsyncComponent } from "vue";
export const FavoritesPage = defineAsyncComponent(
  () => import("./ui/FavoritesPage.vue"),
);
