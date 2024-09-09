import { messages } from "@/lib/locale/locale";
import { useUserStore } from "@/stores/userStore";
import { inject } from "@vercel/analytics";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import { tooltip } from "./directives/tooltip";

export const app = createApp(App);
app.use(router);

app.directive("tooltip", tooltip);

const { locale } = useUserStore();

const i18n = createI18n({
  locale: locale.value,
  messages,
});

app.use(i18n);
app.mount("#app");

import.meta.env.PROD && inject();
