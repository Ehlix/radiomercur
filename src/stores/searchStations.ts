import { ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getAllStations } from "@/api/getStations";
import { useBaseUrl } from "./baseUrl";
import type { AxiosProgressEvent } from "axios";
import { watchOnce } from "@vueuse/core";
import { getLSData, setLSData } from "@/api/localStorage";

export const useSearchStations = defineStore("searchStations", () => {
  const { baseUrl, mainServerIsActive } = storeToRefs(useBaseUrl());
  const { setBaseUrl } = useBaseUrl();
  const stationsList = ref<Station[]>([]);
  const historyList = ref<Station[]>([]);
  const filters = ref<SearchFilters>({});
  const downloadProgress = ref(0);
  const currentPage = ref(0);
  const canLoadMore = ref(false);
  const OFFSET = 30;

  const lsData = getLSData();
  historyList.value = lsData?.historyStations || [];
  filters.value = lsData?.searchFilters || {};

  const clearSearch = () => {
    stationsList.value = [];
  };

  const searchStoreReset = () => {
    stationsList.value = [];
    currentPage.value = 0;
    canLoadMore.value = true;
    downloadProgress.value = 0;
    historyList.value = [];
  };

  const setDownloadProgress = (event: AxiosProgressEvent) => {
    if (event.total) {
      downloadProgress.value = Math.round((event.loaded * 100) / event.total);
    }
  };

  const searchStations = (filters: SearchFilters) => {
    if (!baseUrl.value || !mainServerIsActive.value) {
      return;
    }
    const dataParams: DataParams = {
      name: filters.name || "",
      tag: filters.tag?.toLowerCase() || "",
      // country: filters.country || "",
      countrycode: filters.countryCode,
      bitrateMin: filters.highQualityOnly ? 128 : 0,
      order: filters.order || "clickcount",
      limit: OFFSET,
      reverse: filters.reverse ?? true,
      hidebroken: true,
      offset: OFFSET * currentPage.value,
    };
    getAllStations(baseUrl.value, dataParams, setDownloadProgress).then(
      async (res) => {
        if (!res) {
          await setBaseUrl();
          return searchStations(filters);
        }
        if (res.length < OFFSET) {
          canLoadMore.value = false;
        } else {
          canLoadMore.value = true;
        }

        stationsList.value = res;
        // console.log(res);
      },
    );
  };

  const addToHistory = (station: Station) => {
    if (historyList.value.length && historyList.value[0].stationuuid === station.stationuuid) {
      return;
    }
    historyList.value.unshift(station);
  };
  const getStations = (newFilters: SearchFilters) => {
    stationsList.value = [];
    currentPage.value = 0;
    canLoadMore.value = true;
    filters.value = newFilters;
    searchStations(newFilters);
  };

  const getMoreStations = (mode: "up" | "down" | "first") => {
    if (
      !baseUrl.value ||
      !mainServerIsActive.value ||
      !stationsList.value.length
    ) {
      return;
    }
    if (mode === "up") {
      currentPage.value += 1;
    }
    if (mode === "down") {
      if (currentPage.value < 1) {
        return;
      }
      currentPage.value -= 1;
    }
    if (mode === "first") {
      currentPage.value = 0;
    }
    searchStations(filters.value);
  };

  watch(downloadProgress, () => {
    // console.log("progress: ", downloadProgress.value);
    if (downloadProgress.value === 100) {
      downloadProgress.value = 0;
    }
  });

  watchOnce(baseUrl, () => {
    const ls = getLSData();
    getStations(ls?.searchFilters || {});
  });

  watch(
    [historyList],
    () => {
      if (historyList.value.length > 70) {
        historyList.value.splice(49);
      }
      setLSData({ historyStations: historyList.value });
    },
    {
      deep: true,
    },
  );

  watch(
    [filters],
    () => {
      setLSData({
        searchFilters: {
          highQualityOnly: filters.value.highQualityOnly ?? false,
          reverse: filters.value.reverse ?? true,
        },
      });
    },
    {
      deep: true,
    },
  );

  return {
    filters,
    addToHistory,
    canLoadMore,
    currentPage,
    clearSearch,
    downloadProgress,
    getStations,
    getMoreStations,
    historyList,
    searchStoreReset,
    stationsList,
  };
});
