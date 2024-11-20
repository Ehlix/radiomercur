<script setup lang="ts">
import { ref } from "vue";
import { ChevronsRight } from "lucide-vue-next";

import { useUserStore } from "@/entities/user";
import { XButton, XIcon } from "@/shared/ui";
import { ExtendedInfo } from "@/widgets/extendedInfo";
import {
  AddToFavorite,
  ChangePage,
  FavoriteList,
  FavoriteNav,
  useFavoriteStore,
} from "@/widgets/favorites";

const userStore = useUserStore();
const {
  currentFolderId,
  currentPage,
  nextPage,
  prevPage,
  totalStationCount,
  STATIONS_PER_PAGE,
  openedDialog,
  stationToDialog,
} = useFavoriteStore();
const el = ref<HTMLElement | null>(null);

const scrollUp = () => {
  el.value?.scrollTo({ top: 0 });
};
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1 py-2"
  >
    <!-- Add To Favorite -->
    <add-to-favorite
      v-if="openedDialog === 'favorite' && stationToDialog"
      :open="openedDialog === 'favorite'"
      :station="stationToDialog"
      @close="(stationToDialog = null), (openedDialog = false)"
    />
    <!-- Extended info dialog -->
    <ExtendedInfo
      v-if="openedDialog === 'info' && stationToDialog"
      :open="openedDialog === 'info'"
      :station="stationToDialog"
      @close="(stationToDialog = null), (openedDialog = false)"
    />
    <div>
      <favorite-nav />
    </div>
    <div class="grow">
      <favorite-list />
      <div
        v-if="
          !userStore.favoriteStations.value[currentFolderId].stations.length
        "
        class="flex h-full w-full items-center justify-center px-2 py-4 text-center text-2xl font-semibold text-bgc-1"
      >
        {{ $t("favoriteBar.empty") }}
      </div>
    </div>
    <!-- Pagination -->
    <div class="flex h-fit w-full justify-between gap-2 px-2 *:h-8">
      <x-button
        :disabled="currentPage === 1"
        class="w-10 min-w-8 p-0 xs:min-w-5"
        @click="prevPage('min'), scrollUp()"
      >
        <x-icon
          :icon="ChevronsRight"
          :size="20"
          :stroke-width="1.5"
          class="rotate-180 text-tc-4"
        />
      </x-button>
      <x-button
        :disabled="currentPage === 1"
        class="w-full xs:min-w-8"
        @click="prevPage(), scrollUp()"
      >
        {{ $t("buttons.prev") }}
      </x-button>
      <change-page />
      <x-button
        :disabled="totalStationCount < currentPage * STATIONS_PER_PAGE"
        class="w-full xs:min-w-8"
        @click="nextPage(), scrollUp()"
      >
        {{ $t("buttons.next") }}
      </x-button>
      <x-button
        :disabled="totalStationCount < currentPage * STATIONS_PER_PAGE"
        class="w-10 min-w-8 p-0 xs:min-w-5"
        @click="nextPage('max'), scrollUp"
      >
        <x-icon
          :icon="ChevronsRight"
          :size="20"
          :stroke-width="1.5"
          class="text-tc-4"
        />
      </x-button>
    </div>
  </div>
</template>
