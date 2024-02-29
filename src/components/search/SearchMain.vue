<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import SearchBar from "./SearchBar.vue";
import StationList from "../stationList/StationList.vue";
import { computed, ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import XProgress from "@/components/ui/progress/Progress.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();
const currentTab = ref<string>("name");
const stationList = computed(() => {
  if (currentTab.value === "history") {
    return searchStore.historyList;
  } else {
    return searchStore.stationsList;
  }
});
// const x = (timeScale: number) => {
//   const a = 300 * timeScale;
//   const b = timeScale ? 600 * timeScale : 300;
//   return `animate-[fadeIn_${a}ms_ease-out_${b}ms_forwards]`;
// };

const selectStationHandler = (station: Station) => {
  userStationsStore.selectStation(station);
  searchStore.addToHistory(station);
};

const currentTabHandler = (payload: string) => {
  currentTab.value = payload;
};

const filtersHandler = (payload: SearchFilters) => {
  searchStore.setFilters(payload);
};

const loadMoreHandler = () => {
    searchStore.getMoreStations();
}

const el = ref<HTMLElement | null>(null);

useInfiniteScroll(
  el,
  () => {
    loadMoreHandler()
  },
  {
    distance: 1000,
    canLoadMore() {
        return searchStore.canLoadMore;
    },
    interval: 1500,
  },
);
</script>

<template>
  <div
  ref="el"
    class="relative flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll rounded bg-mc-2"
  >
  <x-progress
        :model-value="searchStore.downloadProgress"
        class="fixed top-[6.5rem] sm:top-[5.5rem] left-0 w-full h-2 p-[0.1rem]"
      />
    <!-- Navigation -->
    <div class="w-full max-w-full flex flex-col gap-2 p-2 pb-0">
      <search-bar
        @current-tab="currentTabHandler"
        @filters="filtersHandler"
      />
    </div>
    <!-- Stations -->
    <station-list
      :stations-list="stationList"
      :favorite-stations="userStationsStore.favoriteStations"
      @select-station="selectStationHandler"
      @addStationToFavorites="userStationsStore.addToFavorite($event)"
      @removeStationFromFavorites="userStationsStore.removeFromFavorite($event)"
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
