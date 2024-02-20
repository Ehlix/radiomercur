import { ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useDebounce } from "@vueuse/core";
import { getAllStations } from "@/api/getStations";
import { useBaseUrl } from "./baseUrl";
import type { AxiosProgressEvent } from "axios";


export const useSearchStations = defineStore("searchStations", () => {
  const { baseUrl, mainServerIsActive } = storeToRefs(useBaseUrl());
  const { setBaseUrl } = useBaseUrl();
  const stationsList = ref<Station[]>([]);
  const searchInput = ref<string>();
  const debSearch = useDebounce(searchInput, 500);
  const downloadProgress = ref(0);

  const clearSearch = () => {
    stationsList.value = [];
    searchInput.value = "";
  };



  const setDownloadProgress = (event: AxiosProgressEvent) => {
    if (event.total) {
      downloadProgress.value = Math.round((event.loaded * 100) / event.total);
    }
  };

  const searchStations = (name: string) => {
    if (!baseUrl.value || !mainServerIsActive.value) {
      return;
    }
    const dataParams: DataParams = {
      name: name,
      order: "clickcount",
      limit: 50,
      reverse: true,
      hidebroken: true,
      offset: 0,
    };
    getAllStations(baseUrl.value, dataParams, setDownloadProgress).then(
      async (res) => {
        if (!res) {
          await setBaseUrl();
          return searchStations(name);
        }
        stationsList.value = res;
        console.log(res);
      },
    );
  };

  watch(debSearch, () => {
    if (!debSearch.value) {
      return;
    }
    searchStations(debSearch.value);
  });

  watch(downloadProgress, () => {
    console.log("progress: ", downloadProgress.value);
    if (downloadProgress.value === 100) {
      downloadProgress.value = 0;
    }
  });

  return {
    searchInput,
    stationsList,
    searchStations,
    downloadProgress,
    clearSearch
  };
});
