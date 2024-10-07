import { defineAsyncComponent } from "vue";
export const SearchPage = defineAsyncComponent(
  () => import("./ui/SearchPage.vue"),
);
