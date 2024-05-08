import "./assets/main.css";

import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/lib/locale/locale";
import App from "./App.vue";
import { inject } from "@vercel/analytics";

const app = createApp(App);

import { useUserStore } from "@/stores/userStore";
const { locale } = useUserStore();

const i18n = createI18n({
  locale: locale.value,
  messages,
});

app.use(i18n);
app.mount("#app");

inject();
