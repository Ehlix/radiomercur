<script setup lang="ts">
import { useSearchStore } from "@/stores/searchStore";
import { useUserStore } from "@/stores/userStore";
import SearchBar from "./components/SearchBar.vue";
import { ref, watch } from "vue";
import XProgress from "@/components/ui/progress/XProgress.vue";
import XButton from "@/components/ui/button/XButton.vue";
import { getLSData } from "@/lib/api/localStorage";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { Disc3, Frown } from "lucide-vue-next";
import { defineAsyncComponent } from "vue";
const AddToFavorite = defineAsyncComponent(
  () => import("@/components/home/AddToFavorite.vue"),
);
const ExtendedInfo = defineAsyncComponent(
  () => import("@/components/home/ExtendedInfo.vue"),
);
const SearchList = defineAsyncComponent(
  () => import("./components/SearchLIst.vue"),
);

const searchStore = useSearchStore();
const userStore = useUserStore();
const currentTab = ref<string>("name");
const dialogOpen = ref<"favorite" | "info" | false>(false);
const toDialogStation = ref<Station | null>(null);

const ls = getLSData();
const defaultFilters: SearchFilters = {
  highQualityOnly: ls?.searchFilters?.highQualityOnly ?? false,
  reverse: ls?.searchFilters?.reverse ?? true,
};

const selectStationHandler = (station: Station) => {
  userStore.selectStation(station);
};

const currentTabHandler = (payload: string) => {
  currentTab.value = payload;
};

const filtersHandler = (payload: SearchFilters) => {
  searchStore.getStations(payload);
};

const openDialogHandler = (station: Station, mode: "favorite" | "info") => {
  toDialogStation.value = station;
  dialogOpen.value = mode;
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
    v-if="searchStore.mainServerIsActive.value"
    ref="el"
    class="home relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1"
  >
    <!-- Add To Favorite -->
    <add-to-favorite
      v-if="dialogOpen === 'favorite' && toDialogStation"
      :open="dialogOpen === 'favorite'"
      :station="toDialogStation"
      @close="(toDialogStation = null), (dialogOpen = false)"
    />
    <!-- Extended info dialog -->
    <ExtendedInfo
      v-if="dialogOpen === 'info' && toDialogStation"
      :open="dialogOpen === 'info'"
      :station="toDialogStation"
      :locale="userStore.locale.value"
      @close="(toDialogStation = null), (dialogOpen = false)"
    />
    <!-- Progress bar -->
    <x-progress
      :model-value="searchStore.downloadProgress.value"
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
      <div
        v-if="searchStore.loading.value"
        class="z-40 flex h-full w-full animate-fade-in items-center justify-center rounded"
      >
        <x-icon
          :icon="Disc3"
          :size="72"
          :stroke-width="1.2"
          class="animate-spin text-bgc-1"
        />
      </div>
      <search-list
        v-if="
          !searchStore.loading.value && searchStore.stationsList.value.length
        "
        :stations-list="searchStore.stationsList.value"
        @select-station="selectStationHandler"
        @open-add-to-favorite="openDialogHandler($event, 'favorite')"
        @open-extended-info="openDialogHandler($event, 'info')"
      />
      <div
        v-if="
          !searchStore.loading.value && !searchStore.stationsList.value.length
        "
        class="flex w-full animate-fade-in items-center justify-center px-2 py-4 text-center text-2xl font-normal text-bgc-1"
      >
        <x-icon
          :icon="Frown"
          :size="28"
          :stroke-width="2"
          class="mr-1 inline text-bgc-1"
        />
        {{ $t("searchBar.noResults") }}
      </div>
    </div>
    <!-- Pagination -->
    <div
      v-if="true"
      class="flex h-fit w-full justify-between gap-2 px-2 pb-2 *:h-8 *:w-full"
    >
      <x-button
        :disabled="!searchStore.currentPage.value || searchStore.loading.value"
        @click="searchStore.getMoreStations('down')"
      >
        {{ $t("buttons.prev") }}
      </x-button>
      <x-button
        :disabled="searchStore.loading.value"
        :class="{
          hidden: searchStore.currentPage.value < 2,
        }"
        @click="searchStore.getMoreStations('first')"
      >
        {{ $t("buttons.first") }}
      </x-button>
      <x-button
        :disabled="!searchStore.canLoadMore.value || searchStore.loading.value"
        @click="searchStore.getMoreStations('up')"
      >
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
