import { ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";

import { getAllStations } from "@/api/getStations";
import { useBaseUrl } from "./baseUrl";
import type { AxiosProgressEvent } from "axios";
import { watchOnce } from "@vueuse/core";

export const useSearchStations = defineStore("searchStations", () => {
  const { baseUrl, mainServerIsActive } = storeToRefs(useBaseUrl());
  const { setBaseUrl } = useBaseUrl();
  const stationsList = ref<Station[]>([]);
  const historyList = ref<Station[]>([]);
  const filters = ref<SearchFilters>({});
  const downloadProgress = ref(0);
  const currentOffset = ref(0);
  const canLoadMore = ref(false);

  const clearSearch = () => {
    stationsList.value = [];
    filters.value = {};
  };

  const setDownloadProgress = (event: AxiosProgressEvent) => {
    if (event.total) {
      downloadProgress.value = Math.round((event.loaded * 100) / event.total);
    }
  };

  const searchStations = (filters: SearchFilters, mode?: 'push') => {
    if (!baseUrl.value || !mainServerIsActive.value) {
      return;
    }
    const dataParams: DataParams = {
      name: filters.name || "",
      tag: filters.tag?.toLowerCase() || "",
      country: filters.country || "",
      bitrateMin: filters.highQualityOnly ? 128 : 0,
      order: "clickcount",
      limit: 30,
      reverse: true,
      hidebroken: true,
      offset: currentOffset.value,
      // countrycode: '',
    };
    getAllStations(baseUrl.value, dataParams, setDownloadProgress).then(
      async (res) => {
        if (!res) {
          await setBaseUrl();
          return searchStations(filters);
        }
        if (res.length < 30) {
          canLoadMore.value = false;
        }

        if (mode === 'push') {
          stationsList.value.push(...res);
          return;
        }
        stationsList.value = res;
        // console.log(res);
      },
    );
  };

  const setFilters = (newFilters: SearchFilters) => {
    filters.value = newFilters;
  }

  const addToHistory = (station: Station) => {
    historyList.value.unshift(station);
  }

  const getMoreStations = () => {
    if (
      !baseUrl.value ||
      !mainServerIsActive.value ||
      !canLoadMore.value ||
      !stationsList.value.length
    ) {
      return;
    }
    currentOffset.value += 30;
    searchStations(filters.value, 'push');
  };

  watchOnce(baseUrl, () => {
    searchStations(filters.value);
  });

  watch(downloadProgress, () => {
    // console.log("progress: ", downloadProgress.value);
    if (downloadProgress.value === 100) {
      downloadProgress.value = 0;
    }
  });

  watch(
    filters,
    () => {
      stationsList.value = [];
      currentOffset.value = 0;
      canLoadMore.value = true;
      searchStations(filters.value);
    },
    {
      deep: true,
    },
  );

  return {
    setFilters,
    stationsList,
    historyList,
    addToHistory,
    getMoreStations,
    downloadProgress,
    canLoadMore,
    clearSearch,
  };
});
