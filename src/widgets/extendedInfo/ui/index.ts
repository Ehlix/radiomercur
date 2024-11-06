import { defineAsyncComponent } from "vue";


const ExtendedInfo = defineAsyncComponent(() => import("./ExtendedInfo.vue"));
const ExtendedInfoWithTrigger = defineAsyncComponent(
  () => import("./ExtendedInfoWithTrigger.vue"),
);

export { ExtendedInfo, ExtendedInfoWithTrigger };
