<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStore } from "@/stores/userStore";
import FavoriteNav from "./FavoriteNav.vue";
import StationList from "../stationList/StationList.vue";
import { computed, nextTick, ref } from "vue";
import XButton from "../ui/button/Button.vue";
import XIcon from "../ui/icon/Icon.vue";
import ChangePage from "./ChangePage.vue";
import { ChevronsRight } from "lucide-vue-next";

const searchStore = useSearchStations();
const userStore = useUserStore();

const STATIONS_PER_PAGE = 30;
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

const selectFolder = (folderID: string) => {
  currentFolderID.value = folderID;
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
  folderID,
}: {
  stationOne: Station;
  stationTwo: Station;
  folderID: string;
}) => {
  userStore.replaceFavoriteStations({ stationOne, stationTwo }, folderID);
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

const updateStation = ({
  station,
  folderID,
}: {
  station: Station;
  folderID: string;
}) => {
  userStore.updateStationInFavoriteAndSelect(station, folderID, true);
};
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1 py-2"
  >
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
        :current-folder-id="currentFolderID"
        :show-extended-info="true"
        :favorite-stations="userStore.favoriteStations"
        :stations-list="stationsList"
        @select-station="selectStationHandler"
        @add-station-to-favorites="userStore.addToFavorite($event)"
        @remove-station-from-favorites="userStore.removeFromFavorite($event)"
        @replace-stations="replaceHandler($event)"
        @position-up="userStore.stationPositionUp($event)"
        @position-down="userStore.stationPositionDown($event)"
        @update-fav-data="updateStation($event)"
      />
    </div>
    <!-- Pagination -->
    <div
      v-if="userStore.favoriteStations[currentFolderID].stations.length"
      class="flex h-fit w-full justify-between gap-2 px-2 *:h-8"
    >
      <x-button
        @click="prevPage('min')"
        :disabled="currentPage === 1"
        class="w-10 min-w-8 p-0 xs:min-w-5"
      >
        <x-icon
          :icon="ChevronsRight"
          :size="20"
          :stroke-width="1.5"
          class="rotate-180 text-tc-4"
        />
      </x-button>
      <x-button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="w-full xs:min-w-8"
      >
        {{ $t("buttons.prev") }}
      </x-button>
      <change-page
        :disabled="totalStationCount <= STATIONS_PER_PAGE"
        :currentPage="currentPage"
        @change-page="changePageHandler($event)"
      />
      <x-button
        @click="nextPage"
        :disabled="totalStationCount < currentPage * STATIONS_PER_PAGE"
        class="w-full xs:min-w-8"
      >
        {{ $t("buttons.next") }}
      </x-button>
      <x-button
        @click="() => nextPage('max')"
        :disabled="totalStationCount < currentPage * STATIONS_PER_PAGE"
        class="w-10 min-w-8 p-0 xs:min-w-5"
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
