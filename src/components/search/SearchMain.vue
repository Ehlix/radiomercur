<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStore } from "@/stores/userStore";
import SearchBar from "./SearchBar.vue";
import StationList from "../stationList/StationList.vue";
import { ref, watch } from "vue";
import XProgress from "@/components/ui/progress/XProgress.vue";
import XButton from "../ui/button/XButton.vue";
import { getLSData } from "@/api/localStorage";

const searchStore = useSearchStations();
const userStore = useUserStore();
const currentTab = ref<string>("name");

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

const el = ref<HTMLElement | null>(null);

watch([() => searchStore.stationsList], () => {
  if (el.value) {
    el.value.scrollTo(0, 0);
  }
});
</script>

<template>
  <div
    v-if="searchStore.mainServerIsActive"
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
        :show-extended-info="true"
        :stations-list="searchStore.stationsList"
        :favorite-stations="userStore.favoriteStations"
        :user-locale="userStore.locale"
        @select-station="selectStationHandler"
        @add-station-to-favorites="userStore.addToFavorite($event)"
        @remove-station-from-favorites="userStore.removeFromFavorite($event)"
      />
    </div>
    <!-- Pagination -->
    <div
      v-if="searchStore.stationsList.length"
      class="flex h-fit w-full justify-between gap-2 px-2 pb-2 *:h-8 *:w-full"
    >
      <x-button :disabled="!searchStore.currentPage" @click="prevPage">
        {{ $t("buttons.prev") }}
      </x-button>
      <x-button
        :class="{
          hidden: searchStore.currentPage < 2,
        }"
        @click="firstPage"
      >
        {{ $t("buttons.first") }}
      </x-button>
      <x-button :disabled="!searchStore.canLoadMore" @click="nextPage">
        {{ $t("buttons.next") }}
      </x-button>
    </div>
  </div>
  <div
    v-else
    class="flex h-full w-full flex-col items-center justify-center gap-2 bg-mc-1"
  >
    <p class="text-center text-2xl text-tc-1">
      {{ $t("serverNoConnection.title") }}
    </p>
    <p class="mb-2 text-center text-xl text-tc-1">
      {{ $t("serverNoConnection.description") }}
    </p>
    <x-button @click="searchStore.baseUrlReload">
      {{ $t("buttons.reload") }}
    </x-button>
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
