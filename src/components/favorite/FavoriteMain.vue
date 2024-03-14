<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStore } from "@/stores/userStore";
import FavoriteNav from "./FavoriteNav.vue";
import StationList from "../stationList/StationList.vue";
import { computed, ref, watch } from "vue";

const searchStore = useSearchStations();
const userStore = useUserStore();

const currentFolderID = ref<string>("default");

const selectFolder = (folderID: string) => {
  currentFolderID.value = folderID;
};

const selectStationHandler = (station: Station) => {
  userStore.selectStation(station);
  searchStore.addToHistory(station);
};

const newFolderHandler = (name: string) => {
  userStore.createFavoriteStationsFolder(name);
  const searchFolderId = Object.values(userStore.favoriteStations).findIndex(
    (folder) => folder.name === name,
  );
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
</script>

<template>
  <div
    ref="el"
    class="relative flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded bg-mc-1 py-2"
  >
    <div>
      <favorite-nav
        :current-folder="currentFolderID"
        :favorite-stations="userStore.favoriteStations"
        @change-current-folder="selectFolder($event)"
        @create-new-folder="newFolderHandler($event)"
        @delete-folder-by-id="deleteFolderHandler($event)"
        @rename-folder="renameFolder($event)"
      />
    </div>
    <div>
      <station-list
        :current-folder-id="currentFolderID"
        :show-extended-info="true"
        :favorite-stations="userStore.favoriteStations"
        :stations-list="userStore.favoriteStations[currentFolderID].stations"
        @select-station="selectStationHandler"
        @add-station-to-favorites="userStore.addToFavorite($event)"
        @remove-station-from-favorites="userStore.removeFromFavorite($event)"
        @replace-stations="replaceHandler($event)"
        @position-up="userStore.stationPositionUp($event)"
        @position-down="userStore.stationPositionDown($event)"
      />
    </div>
  </div>
</template>
@/stores/userStore
