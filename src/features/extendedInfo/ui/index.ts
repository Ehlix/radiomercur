import { defineAsyncComponent } from "vue";
const ExtendedInfo = defineAsyncComponent(() => import("./ExtendedInfo.vue"));

export { ExtendedInfo };
