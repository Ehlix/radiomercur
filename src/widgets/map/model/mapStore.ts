import { ref, shallowRef, watch } from "vue";
import type { AxiosProgressEvent } from "axios";
import { createGlobalState, watchOnce } from "@vueuse/core";

import { useBaseUrlsStore } from "@/entities/urls";
import { getAllStations } from "@/shared/api/stations";


export const useMapStore = createGlobalState(() => {
  const { baseUrl, mainServerIsActive, setBaseUrl } = useBaseUrlsStore();
  const selectedStation = shallowRef<Station>();
  const stationsList = shallowRef<Station[]>([]);
  const downloadProgress = ref(0);
  const loading = ref(false);

  const setDownloadProgress = (event: AxiosProgressEvent) => {
    if (event.total) {
      const progress = Math.round((event.loaded * 100) / event.total);
      downloadProgress.value = progress === 100 ? 0 : progress;
    }
  };

  const apiRequest = async () => {
    if (!baseUrl.value || !mainServerIsActive.value) {
      return;
    }
    const dataParams: DataParams = {
      bitrateMin: 128,
      order: "clickcount",
      limit: 5000,
      hidebroken: true,
      offset: 0,
      has_geo_info: true,
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
      return apiRequest();
    }
    stationsList.value = data;
    loading.value = false;
  };

  const getStations = () => {
    apiRequest();
  };

  watchOnce(baseUrl, () => {
    getStations();
  });

  const selectStation = (station: Station) => {
    selectedStation.value = station;
  };

  watch([downloadProgress, loading], () => {
    if (!loading.value) {
      downloadProgress.value = 0;
    }
    if (downloadProgress.value >= 95) {
      downloadProgress.value = 0;
    }
  });
  return {
    selectedStation,
    selectStation,
    stationsList,
    getStations,
    downloadProgress,
    loading,
  };
});
