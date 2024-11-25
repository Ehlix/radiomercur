import { createApp } from "vue";

import App from "./App.vue";
import { directives, i18n, router } from "./providers";
import "./styles/index.css";

import { inject } from "@vercel/analytics";

const app = createApp(App);

directives.forEach(({ name, directive }) => {
  app.directive(name, directive);
});

app.use(router);
app.use(i18n);
app.mount("#app");

import.meta.env.PROD && inject();
