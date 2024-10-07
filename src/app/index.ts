import { inject } from "@vercel/analytics";
import { createApp } from "vue";
import App from "./App.vue";
import { directives, router } from "./providers";
import { i18n } from "./providers/i18n";
import "./styles/index.css";

const app = createApp(App);

directives.forEach((d) => {
  app.directive(d.name, d.directive);
});

app.use(router);
app.use(i18n);
app.mount("#app");

import.meta.env.PROD && inject();
