import { createGlobalState } from "@vueuse/core";
import { useUserStore } from "@/entities/user";
import { computed, nextTick, ref } from "vue";

export const useFavoriteStore = createGlobalState(() => {
  const userStore = useUserStore();
  const STATIONS_PER_PAGE = 35;
  const currentPage = ref<number>(1);
  const openedDialog = ref<"favorite" | "info" | false>(false);
  const currentFolderId = ref<string>("default");
  const stationToDialog = ref<Station | null>(null);
  const totalStationCount = computed(() => {
    return userStore.favoriteStations.value[currentFolderId.value].stations
      .length;
  });
  const totalPageCount = computed(() => {
    return Math.ceil(totalStationCount.value / STATIONS_PER_PAGE);
  });
  const stationsList = computed(() => {
    const stations =
      userStore.favoriteStations.value[currentFolderId.value].stations;
    if (!stations.length) {
      return stations;
    }
    return stations.slice(
      (currentPage.value - 1) * STATIONS_PER_PAGE,
      currentPage.value * STATIONS_PER_PAGE,
    );
  });

  const selectStationHandler = (station: Station) => {
    userStore.updateStationInFavoriteAndSelect(station, currentFolderId.value);
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === currentFolderId.value) {
      currentFolderId.value = "default";
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
      currentFolderId.value,
    );
  };

  const renameFolder = (event: { folderId: string; name: string }) => {
    userStore.renameFolder(event);
  };

  const prevPage = (min?: "min") => {
    if (currentPage.value > 1) {
      if (min === "min") {
        currentPage.value = 1;
      } else {
        currentPage.value--;
      }
    }
  };

  const nextPage = (max?: "max") => {
    if (totalStationCount.value > currentPage.value * STATIONS_PER_PAGE) {
      if (max === "max") {
        currentPage.value = totalPageCount.value;
      } else {
        currentPage.value++;
      }
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
  };

  const updateStation = (station: Station) => {
    userStore.updateStationInFavoriteAndSelect(
      station,
      currentFolderId.value,
      true,
    );
  };

  const positionHandler = (station: Station, mode: "up" | "down") => {
    const value = { station, folderId: currentFolderId.value };
    if (mode === "up") {
      return userStore.stationPositionUp(value);
    }
    if (mode === "down") {
      return userStore.stationPositionDown(value);
    }
  };

  const createNewFolder = (name: string) => {
    const id = userStore.createFavoriteStationsFolder(name);
    currentPage.value = 1;
    currentFolderId.value = id;
  };

  const openDialogHandler = (station: Station, mode: "favorite" | "info") => {
    stationToDialog.value = station;
    openedDialog.value = mode;
  };

  return {
    openedDialog,
    stationToDialog,
    openDialogHandler,
    positionHandler,
    updateStation,
    changePageHandler,
    createNewFolder,
    currentFolderId,
    renameFolder,
    nextPage,
    stationsList,
    selectStationHandler,
    currentPage,
    STATIONS_PER_PAGE,
    totalStationCount,
    totalPageCount,
    deleteFolder,
    replaceHandler,
    prevPage,
  };
});
