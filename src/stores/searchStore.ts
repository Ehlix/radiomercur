import { ref, shallowRef } from "vue";
import { getAllStations } from "@/lib/api/stations";
import { useBaseUrlsStore } from "./baseUrlsStore";
import type { AxiosProgressEvent } from "axios";
import { watchOnce } from "@vueuse/core";
import { getLSData, setLSData } from "@/lib/api/localStorage";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";

export const useSearchStore = () => {
  const { baseUrl, mainServerIsActive } = useBaseUrlsStore();
  const { setBaseUrl, baseUrlReload } = useBaseUrlsStore();
  const stationsList = shallowRef<Station[]>([]);
  const filters = ref<SearchFilters>({});
  const downloadProgress = ref(0);
  const loading = ref(false);
  const currentPage = ref(0);
  const canLoadMore = ref(false);
  const OFFSET = 35;

  const lsData = getLSData();
  filters.value = lsData?.searchFilters || {};

  const clearSearch = () => {
    stationsList.value = [];
  };

  const searchStoreReset = () => {
    stationsList.value = [];
    currentPage.value = 0;
    canLoadMore.value = true;
    downloadProgress.value = 0;
  };

  const setDownloadProgress = (event: AxiosProgressEvent) => {
    if (event.total) {
      const progress = Math.round((event.loaded * 100) / event.total);
      downloadProgress.value = progress === 100 ? 0 : progress;
    }
  };

  const apiRequest = (filters: SearchFilters) => {
    if (!baseUrl.value || !mainServerIsActive.value || loading.value) {
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
    loading.value = true;
    getAllStations(baseUrl.value, dataParams, setDownloadProgress).then(
      async (res) => {
        if (!res) {
          await setBaseUrl();
          return apiRequest(filters);
        }
        if (res.length < OFFSET) {
          canLoadMore.value = false;
        } else {
          canLoadMore.value = true;
        }
        const filteredRes = res.map((station) => ({
          bitrate: station.bitrate || 0,
          clickcount: station.clickcount || 0,
          codec: station.codec || "",
          country: station.country || "",
          countrycode: station.countrycode || "",
          favicon: station.favicon || "",
          homepage: station.homepage || "",
          language: station.language || "",
          languagecodes: station.languagecodes || "",
          name: removeMetadata(station.name) || "Unknown station",
          state: station.state || "",
          stationuuid: station.stationuuid || "",
          tags: station.tags || "",
          url: station.url || "",
          url_resolved: station.url_resolved || "",
          votes: station.votes || 0,
        }));
        stationsList.value = filteredRes;
        loading.value = false;
      },
    );
  };

  const getStations = (newFilters: SearchFilters) => {
    currentPage.value = 0;
    canLoadMore.value = true;
    filters.value = newFilters;
    setFiltersToLS(newFilters);
    apiRequest(newFilters);
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
    apiRequest(filters.value);
  };

  watchOnce(baseUrl, () => {
    getStations(filters.value);
  });

  const setFiltersToLS = (newFilters: SearchFilters) => {
    setLSData({
      searchFilters: {
        highQualityOnly: newFilters.highQualityOnly ?? false,
        reverse: newFilters.reverse ?? true,
      },
    });
  };

  return {
    baseUrlReload,
    canLoadMore,
    currentPage,
    clearSearch,
    downloadProgress,
    filters,
    getStations,
    getMoreStations,
    loading,
    mainServerIsActive,
    searchStoreReset,
    stationsList,
  };
};
