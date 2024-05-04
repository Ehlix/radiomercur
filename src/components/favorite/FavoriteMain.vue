<script setup lang="ts">
import { useSearchStore } from "@/stores/searchStore";
import { useUserStore } from "@/stores/userStore";
import FavoriteNav from "./FavoriteNav.vue";
import { computed, defineAsyncComponent, nextTick, ref } from "vue";
import XButton from "../ui/button/XButton.vue";
import XIcon from "../ui/icon/XIcon.vue";
import ChangePage from "./ChangePage.vue";
import { ChevronsRight } from "lucide-vue-next";
const AddToFavorite = defineAsyncComponent(
  () => import("../stationList/AddToFavorite.vue"),
);
const ExtendedInfo = defineAsyncComponent(
  () => import("../stationList/ExtendedInfo.vue"),
);
const StationList = defineAsyncComponent(
  () => import("../stationList/StationList.vue"),
);
// const StationCard = defineAsyncComponent(
//   () => import("../stationList/StationCard.vue"),
// );

const searchStore = useSearchStore();
const userStore = useUserStore();

const STATIONS_PER_PAGE = 60;
const el = ref<HTMLElement | null>(null);
const currentFolderID = ref<string>("default");
const currentPage = ref<number>(1);
const totalStationCount = computed(() => {
  return userStore.favoriteStations[currentFolderID.value].stations.length;
});
const totalPageCount = computed(() => {
  return Math.ceil(totalStationCount.value / STATIONS_PER_PAGE);
});
const stationsList = computed(() => {
  return userStore.favoriteStations[currentFolderID.value].stations.slice(
    (currentPage.value - 1) * STATIONS_PER_PAGE,
    currentPage.value * STATIONS_PER_PAGE,
  );
});
const dialogOpen = ref<"favorite" | "info" | false>(false);
const toDialogStation = ref<Station | null>(null);

const selectFolder = (folderID: string) => {
  currentFolderID.value = folderID;
  currentPage.value = 1;
};

const selectStationHandler = (station: Station) => {
  userStore.updateStationInFavoriteAndSelect(station, currentFolderID.value);
  searchStore.addToHistory(station);
};

const newFolderHandler = (name: string) => {
  userStore.createFavoriteStationsFolder(name);
  const searchFolderId = Object.values(
    userStore.favoriteStations,
  ).findLastIndex((folder) => folder.name === name);
  const id = Object.keys(userStore.favoriteStations)[searchFolderId];
  selectFolder(id);
};

const deleteFolderHandler = (folderId: string) => {
  if (folderId === currentFolderID.value) {
    currentFolderID.value = "default";
  }
  userStore.deleteFavoriteStationsFolder(folderId);
};

const replaceHandler = ({
  stationOne,
  stationTwo,
}: {
  stationOne: Station;
  stationTwo: Station;
}) => {
  userStore.replaceFavoriteStations(
    { stationOne, stationTwo },
    currentFolderID.value,
  );
};

const renameFolder = (event: { folderID: string; name: string }) => {
  userStore.renameFolder(event);
};

const prevPage = (min?: "min") => {
  if (currentPage.value > 1) {
    if (min === "min") {
      currentPage.value = 1;
    } else {
      currentPage.value--;
    }
    el.value?.scrollTo(0, 0);
  }
};

const nextPage = (max?: "max") => {
  if (totalStationCount.value > currentPage.value * STATIONS_PER_PAGE) {
    if (max === "max") {
      currentPage.value = totalPageCount.value;
    } else {
      currentPage.value++;
    }
    el.value?.scrollTo(0, 0);
  }
};

const changePageHandler = (event: number) => {
  if (event > totalPageCount.value) {
    currentPage.value = 1;
    nextTick(() => {
      currentPage.value = totalPageCount.value;
    });
  } else if (!event || event < 1) {
    currentPage.value = totalPageCount.value;
    nextTick(() => {
      currentPage.value = 1;
    });
  } else {
    currentPage.value = event;
  }
  // el.value?.scrollTo(0, 0);
};

const updateStation = (station: Station) => {
  userStore.updateStationInFavoriteAndSelect(
    station,
    currentFolderID.value,
    true,
  );
};

const positionHandler = (station: Station, mode: "up" | "down") => {
  const value = { station, folderID: currentFolderID.value };
  if (mode === "up") {
    return userStore.stationPositionUp(value);
  }
  if (mode === "down") {
    return userStore.stationPositionDown(value);
  }
};
const openDialogHandler = (station: Station, mode: "favorite" | "info") => {
  toDialogStation.value = station;
  dialogOpen.value = mode;
};
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1 py-2"
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
      @close="(toDialogStation = null), (dialogOpen = false)"
    />
    <div>
      <favorite-nav
        :current-folder-id="currentFolderID"
        :favorite-stations="userStore.favoriteStations"
        @change-current-folder="selectFolder($event)"
        @create-new-folder="newFolderHandler($event)"
        @delete-folder-by-id="deleteFolderHandler($event)"
        @rename-folder="renameFolder($event)"
      />
    </div>
    <div class="grow">
      <station-list
        :show-update-button="true"
        :stations-list="stationsList"
        :user-locale="userStore.locale"
        @select-station="selectStationHandler"
        @open-add-to-favorite="openDialogHandler($event, 'favorite')"
        @open-extended-info="openDialogHandler($event, 'info')"
        @replace-stations="replaceHandler($event)"
        @position-up="positionHandler($event, 'up')"
        @position-down="positionHandler($event, 'down')"
        @update-fav-data="updateStation($event)"
      />
    </div>
    <!-- Pagination -->
    <div
      v-if="userStore.favoriteStations[currentFolderID].stations.length"
      class="flex h-fit w-full justify-between gap-2 px-2 *:h-8"
    >
      <x-button
        :disabled="currentPage === 1"
        class="w-10 min-w-8 p-0 xs:min-w-5"
        @click="prevPage('min')"
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
        @click="prevPage"
      >
        {{ $t("buttons.prev") }}
      </x-button>
      <change-page
        :disabled="totalStationCount <= STATIONS_PER_PAGE"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        @change-page="changePageHandler($event)"
      />
      <x-button
        :disabled="totalStationCount < currentPage * STATIONS_PER_PAGE"
        class="w-full xs:min-w-8"
        @click="nextPage"
      >
        {{ $t("buttons.next") }}
      </x-button>
      <x-button
        :disabled="totalStationCount < currentPage * STATIONS_PER_PAGE"
        class="w-10 min-w-8 p-0 xs:min-w-5"
        @click="() => nextPage('max')"
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
