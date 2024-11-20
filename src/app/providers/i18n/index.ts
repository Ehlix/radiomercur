import { createI18n } from "vue-i18n";

import { useUserStore } from "@/entities/user";
import { messages } from "@/shared/lib/locale/locale";

const { locale } = useUserStore();

export const i18n = createI18n({
  locale: locale.value,
  messages,
});
