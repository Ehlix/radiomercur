<script setup lang="ts">
import XButton from "@/shared/ui/button/XButton.vue";
import XIcon from "@/shared/ui/icon/XIcon.vue";
import XProgress from "@/shared/ui/progress/XProgress.vue";
import { useSearchStore } from "@/stores/searchStore";
import { Disc3, Frown } from "lucide-vue-next";
import { ref, watch } from "vue";
import SearchBar from "./components/SearchBar.vue";
import { useRouter } from "vue-router";
import AddToFavorite from "@/components/modals/AddToFavorite.vue";
import ExtendedInfo from "@/components/modals/ExtendedInfo.vue";
import SearchList from "./components/SearchList.vue";

const el = ref<HTMLElement | null>(null);

const {
  loading,
  getStations,
  canLoadMore,
  currentPage,
  getMoreStations,
  mainServerIsActive,
  stationsList,
  openedDialog,
  stationInDialog,
  downloadProgress,
} = useSearchStore();

const router = useRouter();

const reloadHandler = () => [router.go(0)];

watch(stationsList, () => {
  if (el.value) {
    el.value.scrollTo({ top: 0 });
  }
});
</script>

<template>
  <div
    v-if="mainServerIsActive"
    ref="el"
    class="home relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1"
  >
    <!-- Add To Favorite dialog -->
    <add-to-favorite
      v-if="openedDialog === 'favorite' && stationInDialog"
      :open="openedDialog === 'favorite'"
      :station="stationInDialog"
      @close="(stationInDialog = null), (openedDialog = false)"
    />
    <!-- Extended info dialog -->
    <ExtendedInfo
      v-if="openedDialog === 'info' && stationInDialog"
      :open="openedDialog === 'info'"
      :station="stationInDialog"
      @close="(stationInDialog = null), (openedDialog = false)"
    />
    <!-- Progress bar -->
    <x-progress
      :model-value="downloadProgress"
      class="fixed left-0 top-[6.5rem] h-2 w-full p-[0.1rem] sm:top-[5.5rem]"
    />
    <!-- Navigation -->
    <div class="flex w-full max-w-full flex-col gap-2 p-2 pb-0">
      <search-bar />
    </div>
    <!-- Stations -->
    <div class="grow">
      <div
        v-if="loading"
        class="z-40 flex h-full w-full animate-fade-in items-center justify-center rounded"
      >
        <x-icon
          :icon="Disc3"
          :size="72"
          :stroke-width="1.2"
          class="animate-spin text-bgc-1"
        />
      </div>
      <search-list v-if="!loading && stationsList.length" />
      <div
        v-if="!loading && !stationsList.length"
        class="flex w-full animate-fade-in flex-col items-center justify-center gap-2 px-2 py-4 text-center text-2xl font-normal text-bgc-1"
      >
        <div>
          <x-icon
            :icon="Frown"
            :size="28"
            :stroke-width="2"
            class="mr-1 inline text-bgc-1"
          />
          {{ $t("searchBar.noResults") }}
        </div>
        <x-button @click="getStations()">
          {{ $t("buttons.reload") }}
        </x-button>
      </div>
    </div>
    <!-- Pagination -->
    <div
      v-if="true"
      class="flex h-fit w-full justify-between gap-2 px-2 pb-2 *:h-8 *:w-full"
    >
      <x-button
        :disabled="!currentPage || loading"
        @click="getMoreStations('down')"
      >
        {{ $t("buttons.prev") }}
      </x-button>
      <x-button
        :disabled="loading"
        :class="{
          hidden: currentPage < 2,
        }"
        @click="getMoreStations('first')"
      >
        {{ $t("buttons.first") }}
      </x-button>
      <x-button
        :disabled="!canLoadMore || loading"
        @click="getMoreStations('up')"
      >
        {{ $t("buttons.next") }}
      </x-button>
    </div>
  </div>
  <!-- Search Trouble -->
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
    <x-button @click="reloadHandler">
      {{ $t("buttons.reload") }}
    </x-button>
  </div>
</template>
