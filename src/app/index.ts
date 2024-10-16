import { createApp } from "vue";

import { i18n } from "./providers/i18n";
import App from "./App.vue";
import { directives, router } from "./providers";
import "./styles/index.css";

import { inject } from "@vercel/analytics";


const app = createApp(App);

directives.forEach((d) => {
  app.directive(d.name, d.directive);
});

app.use(router);
app.use(i18n);
app.mount("#app");

import.meta.env.PROD && inject();
