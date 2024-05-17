<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import FavoriteNav from "./FavoriteNav.vue";
import { computed, defineAsyncComponent, nextTick, ref } from "vue";
import XButton from "@/components/ui/button/XButton.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import ChangePage from "./ChangePage.vue";
import { ChevronsRight } from "lucide-vue-next";
import { watch } from "vue";
const AddToFavorite = defineAsyncComponent(
  () => import("../AddToFavorite.vue"),
);
const ExtendedInfo = defineAsyncComponent(() => import("../ExtendedInfo.vue"));
const FavoriteList = defineAsyncComponent(() => import("./FavoriteList.vue"));

const userStore = useUserStore();

const STATIONS_PER_PAGE = 2;
const el = ref<HTMLElement | null>(null);
const currentFolderID = ref<string>("default");
const currentPage = ref<number>(1);
const totalStationCount = computed(() => {
  return userStore.favoriteStations.value[currentFolderID.value].stations
    .length;
});
const totalPageCount = computed(() => {
  return Math.ceil(totalStationCount.value / STATIONS_PER_PAGE);
});
const stationsList = computed(() => {
  const stations =
    userStore.favoriteStations.value[currentFolderID.value].stations;
  if (!stations.length) {
    return stations;
  }
  return stations.slice(
    (currentPage.value - 1) * STATIONS_PER_PAGE,
    currentPage.value * STATIONS_PER_PAGE,
  );
});
const dialogOpen = ref<"favorite" | "info" | false>(false);
const stationToDialog = ref<Station | null>(null);

const selectStationHandler = (station: Station) => {
  userStore.updateStationInFavoriteAndSelect(station, currentFolderID.value);
};

const newFolderHandler = (name: string) => {
  const id = userStore.createFavoriteStationsFolder(name);
  currentFolderID.value = id;
  currentPage.value = 1;
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
  stationToDialog.value = station;
  dialogOpen.value = mode;
};

watch(currentFolderID, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1 py-2"
  >
    <!-- Add To Favorite -->
    <add-to-favorite
      v-if="dialogOpen === 'favorite' && stationToDialog"
      :open="dialogOpen === 'favorite'"
      :station="stationToDialog"
      @close="(stationToDialog = null), (dialogOpen = false)"
    />
    <!-- Extended info dialog -->
    <ExtendedInfo
      v-if="dialogOpen === 'info' && stationToDialog"
      :open="dialogOpen === 'info'"
      :station="stationToDialog"
      :locale="userStore.locale.value"
      @close="(stationToDialog = null), (dialogOpen = false)"
    />
    <div>
      <favorite-nav
        v-model="currentFolderID"
        :favorite-stations="userStore.favoriteStations.value"
        @create-new-folder="newFolderHandler($event)"
        @delete-folder-by-id="deleteFolderHandler($event)"
        @rename-folder="renameFolder($event)"
      />
    </div>
    <div class="grow">
      <favorite-list
        :stations-list="stationsList"
        @select-station="selectStationHandler"
        @open-add-to-favorite="openDialogHandler($event, 'favorite')"
        @open-extended-info="openDialogHandler($event, 'info')"
        @replace-stations="replaceHandler($event)"
        @position-up="positionHandler($event, 'up')"
        @position-down="positionHandler($event, 'down')"
        @update-fav-data="updateStation($event)"
      />
      <div
        v-if="
          !userStore.favoriteStations.value[currentFolderID].stations.length
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
