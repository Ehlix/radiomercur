import { messages } from "@/common/locale/locale";
import { useUserStore } from "@/stores/userStore";
import { inject } from "@vercel/analytics";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { router, directives } from "./providers";
import App from "./App.vue";
import "./styles/index.css";

export const app = createApp(App);

app.use(router);

directives.forEach((d) => {
  app.directive(d.name, d.directive);
});

const { locale } = useUserStore();

const i18n = createI18n({
  locale: locale.value,
  messages,
});

app.use(i18n);
app.mount("#app");

import.meta.env.PROD && inject();
