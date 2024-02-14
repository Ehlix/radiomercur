import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { getBaseUrls } from "@/api/getBaseUrls";

export const useBaseUrl = defineStore("baseUrl", () => {
  const baseUrls = ref<BaseURL[]>([]);
  const baseUrl = ref<BaseURL>(undefined);
  const refreshBaseUrlsCount = ref(0);

  const setBaseUrls = async () => {
    try {
      const hosts = await getBaseUrls();
      if (hosts) {
        baseUrls.value = hosts;
        refreshBaseUrlsCount.value++;
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  setBaseUrls();

  watch([baseUrls, baseUrl], () => {
    if (baseUrls.value.length && !baseUrl.value) {
      setBaseUrl();
    }
  });

  const setBaseUrl = async () => {
    if (refreshBaseUrlsCount.value === 2) {
      console.log('Servers is down')
      return
    }
    if (baseUrls.value.length === 0) {
      await setBaseUrls();
    }
    if (baseUrl.value) {
      baseUrls.value.filter((url) => url !== baseUrl.value);
    }
    baseUrl.value =
      baseUrls.value[Math.floor(Math.random() * baseUrls.value.length)];
    return;
  };

  return { baseUrl, setBaseUrl };
});
