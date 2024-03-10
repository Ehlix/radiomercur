<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStore } from "@/stores/userStore";
import StationList from "../stationList/StationList.vue";

const searchStore = useSearchStations();
const userStore = useUserStore();

const selectStationHandler = (station: Station) => {
  userStore.selectStation(station);
  searchStore.addToHistory(station);
};
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1 py-2"
  >
    <div>
      <station-list
        :can-drag="true"
        :show-extended-info="true"
        :favorite-stations="'remove'"
        :stations-list="userStore.favoriteStations"
        @select-station="selectStationHandler"
        @add-station-to-favorites="userStore.addToFavorite($event)"
        @remove-station-from-favorites="userStore.removeFromFavorite($event)"
        @replace-stations="userStore.replaceFavoriteStations($event)"
        @position-up="userStore.stationPositionUp($event)"
        @position-down="userStore.stationPositionDown($event)"
      />
    </div>
  </div>
</template>
@/stores/userStore
