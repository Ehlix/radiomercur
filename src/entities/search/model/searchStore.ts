import { getLSData, setLSData } from "@/shared/api/localStorage";
import { getAllStations } from "@/shared/api/stations";
import { useUserStore } from "@/entities/user";
import { createGlobalState, watchOnce } from "@vueuse/core";
import type { AxiosProgressEvent } from "axios";
import { ref, shallowRef, watch } from "vue";
import { useBaseUrlsStore } from "../../urls/model/baseUrlsStore";

export const useSearchStore = createGlobalState(() => {
  const { baseUrl, mainServerIsActive, setBaseUrl, baseUrlReload } =
    useBaseUrlsStore();
  const userStore = useUserStore();
  const OFFSET = 35;
  const loading = ref(false);
  const currentPage = ref(0);
  const canLoadMore = ref(false);
  const downloadProgress = ref(0);
  const filters = ref<SearchFilters>({});
  const stationsList = shallowRef<Station[]>([]);
  const openedDialog = ref<"favorite" | "info" | false>(false);
  const stationInDialog = ref<Station | null>(null);

  const lsData = getLSData();
  const defaultFilters: SearchFilters = {
    highQualityOnly: lsData?.searchFilters.highQualityOnly,
    reverse: lsData?.searchFilters?.reverse ?? true,
  };
  filters.value = { ...defaultFilters };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    Object.assign(filters.value, newFilters);
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

  const apiRequest = async (filters: SearchFilters) => {
    if (!baseUrl.value || !mainServerIsActive.value) {
      return;
    }
    const dataParams: DataParams = {
      name: filters.name || "",
      tag: filters.tag?.toLowerCase() || "",
      countrycode: filters.countryCode,
      bitrateMin: filters.highQualityOnly ? 128 : 0,
      order: filters.order || "clickcount",
      limit: OFFSET,
      reverse: filters.reverse ?? true,
      hidebroken: true,
      offset: OFFSET * currentPage.value,
    };
    loading.value = true;
    const data = await getAllStations(
      baseUrl.value,
      dataParams,
      setDownloadProgress,
    );
    if (data === "aborted") {
      return;
    }
    if (!data) {
      await setBaseUrl();
      return apiRequest(filters);
    }
    if (data.length < OFFSET) {
      canLoadMore.value = false;
    } else {
      canLoadMore.value = true;
    }
    stationsList.value = data;
    loading.value = false;
  };

  const setFiltersToLS = () => {
    setLSData({
      searchFilters: {
        highQualityOnly: filters.value.highQualityOnly ?? false,
        reverse: filters.value.reverse ?? true,
      },
    });
  };

  const getStations = () => {
    currentPage.value = 0;
    canLoadMore.value = true;
    apiRequest(filters.value);
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
    getStations();
  });

  watch(
    filters,
    () => {
      setFiltersToLS();
      getStations();
    },
    {
      immediate: true,
      deep: true,
    },
  );

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
