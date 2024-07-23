import { ref, shallowRef, watch } from "vue";
import { getAllStations } from "@/lib/api/stations";
import { useBaseUrlsStore } from "./baseUrlsStore";
import type { AxiosProgressEvent } from "axios";
import { createGlobalState, watchOnce } from "@vueuse/core";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";

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

  const apiRequest = () => {
    if (!baseUrl.value || !mainServerIsActive.value || loading.value) {
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
    getAllStations(baseUrl.value, dataParams, setDownloadProgress).then(
      async (res) => {
        if (!res) {
          await setBaseUrl();
          return apiRequest();
        }
        const filteredRes = res.map((station) => {
          // let lat: number | undefined = station.geo_lat;
          // let long = station.geo_long;
          // if (!lat || !long) {
          //   const code = station.countrycode;
          //   if (!code) {
          //     lat = undefined;
          //     long = undefined;
          //   } else {
          //     const coords = findCoords(code);
          //     lat = coords?.lat;
          //     long = coords?.long;
          //   }
          // }
          return {
            bitrate: station.bitrate || 0,
            clickcount: station.clickcount || 0,
            codec: station.codec || "",
            country: station.country || "",
            countrycode: station.countrycode || "",
            favicon: station.favicon || "",
            homepage: station.homepage || "",
            language: station.language || "",
            languagecodes: station.languagecodes || "",
            name: station.name
              ? removeMetadata(station.name)
              : "Unknown station",
            state: station.state || "",
            stationuuid: station.stationuuid || "",
            tags: station.tags || "",
            url: station.url || "",
            url_resolved: station.url_resolved || "",
            votes: station.votes || 0,
            geo_lat: station.geo_lat,
            geo_long: station.geo_long,
          };
        });
        stationsList.value = filteredRes;
        loading.value = false;
      },
    );
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

// const findCoords = (countryCode: string) => {
//   const country = countries_coords.find((c) => c.alpha2 === countryCode);
//   if (country) {
//     return {
//       lat: country.latitude,
//       long: country.longitude,
//     };
//   }
// };
