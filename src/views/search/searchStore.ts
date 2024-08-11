import { getLSData, setLSData } from "@/lib/api/localStorage";
import { getAllStations } from "@/lib/api/stations";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { useUserStore } from "@/stores/userStore";
import { createGlobalState, watchOnce } from "@vueuse/core";
import type { AxiosProgressEvent } from "axios";
import { ref, shallowRef, watch } from "vue";
import { useBaseUrlsStore } from "../../stores/baseUrlsStore";

export const useSearchStore = createGlobalState(() => {
  const { baseUrl, mainServerIsActive, setBaseUrl, baseUrlReload } =
    useBaseUrlsStore();
  const userStore = useUserStore();
  const OFFSET = 35;
  const loading = ref(false);
  const currentPage = ref(0);
  const canLoadMore = ref(false);
  const downloadProgress = ref(0);
  const filters = shallowRef<SearchFilters>({});
  const stationsList = shallowRef<Station[]>([]);
  const openedDialog = ref<"favorite" | "info" | false>(false);
  const stationInDialog = ref<Station | null>(null);

  const lsData = getLSData();
  const defaultFilters: SearchFilters = {
    highQualityOnly: lsData?.searchFilters?.highQualityOnly ?? false,
    reverse: lsData?.searchFilters?.reverse ?? true,
  };
  filters.value = { ...defaultFilters };

  watch(filters, () => {
    getStations(filters.value);
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const selectStation = (station: Station) => {
    userStore.selectStation(station);
  };

  const openDialog = (station: Station, mode: "favorite" | "info") => {
    stationInDialog.value = station;
    openedDialog.value = mode;
  };

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
          name: station.name ? removeMetadata(station.name) : "Unknown station",
          state: station.state || "",
          stationuuid: station.stationuuid || "",
          tags: station.tags || "",
          url: station.url || "",
          url_resolved: station.url_resolved || "",
          votes: station.votes || 0,
          geo_lat: station.geo_lat || undefined,
          geo_long: station.geo_long || undefined,
        }));
        stationsList.value = filteredRes;
        loading.value = false;
      },
    );
  };

  const setFiltersToLS = (newFilters: SearchFilters) => {
    setLSData({
      searchFilters: {
        highQualityOnly: newFilters.highQualityOnly ?? false,
        reverse: newFilters.reverse ?? true,
      },
    });
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

  watch([downloadProgress, loading], () => {
    if (!loading.value) {
      downloadProgress.value = 0;
    }
    if (downloadProgress.value >= 95) {
      downloadProgress.value = 0;
    }
  });
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
    defaultFilters,
    selectStation,
    openDialog,
    openedDialog,
    stationInDialog,
    updateFilters,
  };
});
