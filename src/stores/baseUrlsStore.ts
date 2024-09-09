import { ref } from "vue";
import { getBaseUrls } from "@/lib/api/baseUrls";
import { createGlobalState } from "@vueuse/core";

export const useBaseUrlsStore = createGlobalState(() => {
  const mainServerIsActive = ref(true);
  const allBaseUrls = ref<BaseURL[]>([]);
  const baseUrl = ref<BaseURL>(undefined);

  getBaseUrls().then(async (hosts) => {
    if (!hosts) {
      return (mainServerIsActive.value = false);
    }
    allBaseUrls.value = hosts;
    while (!baseUrl.value && hosts.length) {
      await setBaseUrl();
    }
  });

  const setBaseUrl = async () => {
    if (!mainServerIsActive.value) {
      return;
    }
    if (baseUrl.value) {
      allBaseUrls.value.filter((url) => url !== baseUrl.value);
      if (!allBaseUrls.value.length) {
        baseUrl.value = undefined;
        mainServerIsActive.value = false;
        return;
      }
    }
    baseUrl.value =
      allBaseUrls.value[Math.floor(Math.random() * allBaseUrls.value.length)];
    return;
  };

  const baseUrlReload = () => {
    mainServerIsActive.value = true;
    setBaseUrl();
  };

  return { baseUrl, setBaseUrl, mainServerIsActive, baseUrlReload };
});
