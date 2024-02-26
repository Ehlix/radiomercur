<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import SearchBar from "./SearchBar.vue";
import StationList from "../stationList/StationList.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();

const x = (timeScale: number) => {
  const a = 300 * timeScale;
  const b = timeScale ? 600 * timeScale : 300;
  return `animate-[fadeIn_${a}ms_ease-out_${b}ms_forwards]`;
};
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll rounded rounded-r-none bg-mc-2"
  >
    <!-- Navigation -->
    <div class="flex flex-col gap-2 p-2">
      <search-bar />
    </div>
    <!-- Stations -->
    <station-list
      :stations-list="searchStore.stationsList"
      @select-station="userStationsStore.selectStation($event)"
    />
  </div>
</template>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
} */
</style>
