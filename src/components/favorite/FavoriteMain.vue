<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import StationList from "../stationList/StationList.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();


const selectStationHandler = (station: Station) => {
  userStationsStore.selectStation(station);
  searchStore.addToHistory(station);
};
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-2 py-2"
  >
    <div>
      <station-list
        :favorite-stations="'remove'"
        :stations-list="userStationsStore.favoriteStations"
        @select-station="selectStationHandler"
        @addStationToFavorites="userStationsStore.addToFavorite($event)"
        @removeStationFromFavorites="
          userStationsStore.removeFromFavorite($event)
        "
      />
    </div>
  </div>
</template>
