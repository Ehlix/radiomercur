<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStore } from "@/stores/userStore";
import SearchBar from "./SearchBar.vue";
import StationList from "../stationList/StationList.vue";
import { computed, ref, watch } from "vue";
import XProgress from "@/components/ui/progress/Progress.vue";
import XButton from "../ui/button/Button.vue";
import { getLSData } from "@/api/localStorage";

const searchStore = useSearchStations();
const userStore = useUserStore();
const currentTab = ref<string>("name");
const stationList = computed(() => {
  if (currentTab.value === "history") {
    return searchStore.historyList;
  } else {
    return searchStore.stationsList;
  }
});

const ls = getLSData();
const defaultFilters: SearchFilters = {
  highQualityOnly: ls?.searchFilters?.highQualityOnly ?? false,
  reverse: ls?.searchFilters?.reverse ?? true,
};

const selectStationHandler = (station: Station) => {
  userStore.selectStation(station);
  searchStore.addToHistory(station);
};

const currentTabHandler = (payload: string) => {
  currentTab.value = payload;
};

const filtersHandler = (payload: SearchFilters) => {
  searchStore.getStations(payload);
};

const nextPage = () => {
  searchStore.getMoreStations("up");
};

const prevPage = () => {
  searchStore.getMoreStations("down");
};

const firstPage = () => {
  searchStore.getMoreStations("first");
};

watch([stationList], () => {
  if (el.value) {
    el.value.scrollTo(0, 0);
  }
});

const el = ref<HTMLElement | null>(null);

// useInfiniteScroll(
//   el,
//   () => {
//     loadMoreHandler()
//   },
//   {
//     distance: 500,
//     canLoadMore() {
//         return searchStore.canLoadMore;
//     },
//     interval: 1500,
//   },
// );

// onUnmounted(() => {
//   console.log("unmounted");
//   searchStore.searchStoreReset();
// });
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1"
  >
    <!-- Progress bar -->
    <x-progress
      :model-value="searchStore.downloadProgress"
      class="fixed left-0 top-[6.5rem] h-2 w-full p-[0.1rem] sm:top-[5.5rem]"
    />
    <!-- Navigation -->
    <div class="flex w-full max-w-full flex-col gap-2 p-2 pb-0">
      <search-bar
        :default-filters="defaultFilters"
        @current-tab="currentTabHandler"
        @filters="filtersHandler"
      />
    </div>
    <!-- Stations -->
    <div class="grow">
      <station-list
        :showExtendedInfo="currentTab !== 'history'"
        :stations-list="stationList"
        :favorite-stations="userStore.favoriteStations"
        :user-locale="userStore.locale"
        @select-station="selectStationHandler"
        @add-station-to-favorites="userStore.addToFavorite($event, 'default')"
        @remove-station-from-favorites="userStore.removeFromFavorite($event, 'default')"
      />
    </div>
    <!-- Pagination -->
    <div
      v-if="searchStore.stationsList.length && currentTab !== 'history'"
      class="flex h-fit w-full justify-between gap-2 px-2 pb-2 *:h-8 *:w-full"
    >
      <x-button @click="prevPage" :disabled="!searchStore.currentPage">
        {{ $t("buttons.prev") }}
      </x-button>
      <x-button
        @click="firstPage"
        :class="{
          hidden: searchStore.currentPage < 2,
        }"
      >
        {{ $t("buttons.first") }}
      </x-button>
      <x-button @click="nextPage" :disabled="!searchStore.canLoadMore">
        {{ $t("buttons.next") }}
      </x-button>
    </div>
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
@/stores/userStore
