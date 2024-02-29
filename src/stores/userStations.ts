import { ref, watch } from "vue";
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
    if (baseUrl.value && station.stationuuid) {
      getStationInfoById(baseUrl.value, station.stationuuid).then((res) => {
        console.log(res);
        if (res) {
          selectedStation.value = res;
          return;
        }
      });
    }
    selectedStation.value = station;
  };

  const addToFavorite = (station: Station) => {
    favoriteStations.value.unshift(station);
  }

  const removeFromFavorite = (station: Station) => {
    favoriteStations.value = [...favoriteStations.value].filter((s) => s.stationuuid !== station.stationuuid);
  }

  return {
    addToFavorite,
    removeFromFavorite,
    favoriteStations,
    selectStation,
    selectedStation,
    selectStationWithUpdate,
  };
});
