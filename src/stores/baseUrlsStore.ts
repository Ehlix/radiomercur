import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { getBaseUrls } from "@/lib/api/getBaseUrls";

export const useBaseUrlsStore = defineStore("baseUrl", () => {
  const mainServerIsActive = ref(true);
  const allBaseUrls = ref<BaseURL[]>([]);
  const baseUrl = ref<BaseURL>(undefined);

  getBaseUrls().then((hosts) => {
    if (!hosts) {
      return (mainServerIsActive.value = false);
    }
    allBaseUrls.value = hosts;
  });

  watch([allBaseUrls, baseUrl], () => {
    if (allBaseUrls.value.length && !baseUrl.value) {
      setBaseUrl();
    }
  });

  watch(mainServerIsActive, () => {
    !mainServerIsActive.value && console.log("Main server offline");
  });

  const setBaseUrl = async () => {
    if (!mainServerIsActive.value) {
      console.log("Servers is down");
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
