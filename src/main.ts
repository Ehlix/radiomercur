import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { messages } from "@/lib/locale/locale";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());

import { useUserStations } from "@/stores/userStations";
const userStore = useUserStations();

const i18n = createI18n({
  locale: userStore.locale,
  messages,
});

app.use(i18n);
app.use(router);

app.mount("#app");
