import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getStationInfoById } from "@/api/getStations";
import { useBaseUrl } from "./baseUrl";

export const useUserStations = defineStore("userStations", () => {
  const { baseUrl } = storeToRefs(useBaseUrl());
  const favoriteStations = ref<Station[]>([]);
  const selectedStation = ref<Station>();

  const selectStation = (station: Station) => {
    selectedStation.value = station;
  };

  const selectStationWithUpdate = (station: Station) => {
    if (baseUrl.value && station.changeuuid) {
      getStationInfoById(baseUrl.value, station.changeuuid).then((res) => {
        console.log(res);
        if (res) {
          selectedStation.value = res;
          return;
        }
      });
    }
    selectedStation.value = station;
  };

  return {
    favoriteStations,
    selectedStation,
    selectStation,
    selectStationWithUpdate,
  };
});
