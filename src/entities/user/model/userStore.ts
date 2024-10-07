import { ref, shallowRef, watch } from "vue";
import { getStationInfoById } from "@/shared/api/stations";
import { useBaseUrlsStore } from "@/entities/urls";
import { getLSData, setLSData } from "@/shared/api/localStorage";
import { generateId } from "@/shared/lib/utils/generateId";
import { createGlobalState } from "@vueuse/core";

export const useUserStore = createGlobalState(() => {
  const { baseUrl } = useBaseUrlsStore();
  const favoriteStations = ref<FavoriteStations>({
    default: { name: "default", stations: [] },
  });
  const selectedStation = ref<Station>();
  const historyList = shallowRef<Station[]>([]);
  const locale = ref<UserSettings["language"]>("en");
  const borders = ref<UserSettings["borders"]>("rounded");
  const playerVisualMode = ref<Required<UserSettings["playerVisualMode"]>>("1");

  const lsData = getLSData();

  if (lsData) {
    historyList.value = lsData.historyStations;
    const favoriteStationFromLS = lsData.favoritesStations;
    favoriteStations.value = {
      ...favoriteStationFromLS,
      default: {
        name: "default",
        stations: favoriteStationFromLS?.default?.stations || [],
      },
    };

    const localeFromLS = lsData.userSettings.language;
    const localeFromNav =
      window.navigator.language === "ru-RU" ||
      window.navigator.language === "ru"
        ? "ru"
        : "en";
    locale.value = localeFromLS || localeFromNav;

    const borderFromLS = lsData.userSettings.borders;
    borders.value = borderFromLS;
    document.body.classList.add(borderFromLS);

    playerVisualMode.value = lsData.userSettings.playerVisualMode;
  }

  const addToHistory = (station: Station) => {
    if (
      historyList.value.length &&
      historyList.value[0]?.name === station.name
    ) {
      return;
    }
    const newHistoryList = [station, ...historyList.value];
    if (newHistoryList.length > 70) {
      newHistoryList.splice(49);
    }
    historyList.value = newHistoryList;
    setLSData({ historyStations: newHistoryList });
  };

  const selectStation = (station: Station) => {
    selectedStation.value = { ...station };
    addToHistory(station);
  };

  const changeLocale = (newLocale: UserSettings["language"]) => {
    locale.value = newLocale;
    setLSData({ userSettings: { language: newLocale } });
  };

  const changePlayerVisualMode = (
    newMode: UserSettings["playerVisualMode"],
  ) => {
    playerVisualMode.value = newMode;
    setLSData({ userSettings: { playerVisualMode: newMode } });
  };

  const updateStationInFavoriteAndSelect = (
    station: Station,
    folderId: string,
    notSelect?: boolean,
  ) => {
    if (baseUrl.value && station.stationuuid) {
      getStationInfoById(baseUrl.value, station.stationuuid).then((res) => {
        if (res && res.length > 0) {
          favoriteStations.value[folderId].stations = favoriteStations.value[
            folderId
          ].stations.map((s) => {
            if (s.stationuuid === station.stationuuid) {
              s = res[0];
            }
            return s;
          });
          !notSelect && selectStation(res[0]);
          return;
        }
      });
    }
    !notSelect && selectStation(station);
  };

  const addToFavorite = ({ station, folderId }: StationAndId) => {
    if (favoriteStations.value[folderId]) {
      favoriteStations.value[folderId].stations.unshift(station);
    } else {
      favoriteStations.value["default"].stations.unshift(station);
    }
  };

  const removeFromFavorite = ({ station, folderId }: StationAndId) => {
    if (favoriteStations.value[folderId]) {
      favoriteStations.value[folderId].stations = [
        ...favoriteStations.value[folderId].stations.filter(
          (s) => s.stationuuid !== station.stationuuid,
        ),
      ];
    }
  };

  const renameFolder = ({
    folderId,
    name,
  }: {
    folderId: string;
    name: string;
  }) => {
    if (favoriteStations.value[folderId]) {
      favoriteStations.value[folderId].name = name;
    }
  };

  const changeBorders = (mode: typeof borders.value) => {
    borders.value = mode;
    setLSData({ userSettings: { borders: mode } });
    if (mode === "square") {
      document.body.classList.add("not-rounded");
    } else {
      document.body.classList.remove("not-rounded");
    }
  };

  const replaceFavoriteStations = (
    stations: {
      stationOne: Station;
      stationTwo: Station;
    },
    folderId: string,
  ) => {
    if (stations.stationOne.stationuuid === stations.stationTwo.stationuuid) {
      return;
    }
    const indexOne = favoriteStations.value[folderId].stations.findIndex(
      (s) => s.stationuuid === stations.stationOne.stationuuid,
    );
    const indexTwo = favoriteStations.value[folderId].stations.findIndex(
      (s) => s.stationuuid === stations.stationTwo.stationuuid,
    );

    const filteredFolder = favoriteStations.value[folderId].stations.filter(
      (s) =>
        s.stationuuid !== stations.stationOne.stationuuid &&
        s.stationuuid !== stations.stationTwo.stationuuid,
    );
    const pair =
      indexOne > indexTwo
        ? [stations.stationOne, stations.stationTwo]
        : [stations.stationTwo, stations.stationOne];
    const newStations = [
      ...filteredFolder.slice(0, indexTwo > indexOne ? indexTwo - 1 : indexTwo),
      ...pair,
      ...filteredFolder.slice(indexTwo > indexOne ? indexTwo - 1 : indexTwo),
    ];
    favoriteStations.value[folderId].stations = newStations;
  };

  const stationPositionUp = ({ station, folderId }: StationAndId) => {
    const index = favoriteStations.value[folderId].stations.findIndex(
      (s) => s.stationuuid === station.stationuuid,
    );
    if (index === 0) {
      return;
    }
    const stationTwo = favoriteStations.value[folderId].stations[index - 1];
    favoriteStations.value[folderId].stations[index - 1] = station;
    favoriteStations.value[folderId].stations[index] = stationTwo;
  };

  const stationPositionDown = ({ station, folderId }: StationAndId) => {
    const index = favoriteStations.value[folderId].stations.findIndex(
      (s) => s.stationuuid === station.stationuuid,
    );
    const isBottom =
      index === favoriteStations.value[folderId].stations.length - 1;
    if (isBottom) {
      return;
    }
    const stationTwo = favoriteStations.value[folderId].stations[index + 1];
    favoriteStations.value[folderId].stations[index + 1] = station;
    favoriteStations.value[folderId].stations[index] = stationTwo;
  };

  const createFavoriteStationsFolder = (name: string) => {
    const id = generateId();
    favoriteStations.value[id] = {
      name,
      stations: [],
    };
    return id;
  };

  const deleteFavoriteStationsFolder = (folderId: string) => {
    if (folderId === "default" || !favoriteStations.value[folderId]) {
      return;
    }
    delete favoriteStations.value[folderId];
  };

  watch(
    [favoriteStations],
    () => {
      setLSData({ favoritesStations: favoriteStations.value });
    },
    {
      deep: true,
      immediate: true,
    },
  );

  return {
    addToFavorite,
    borders,
    locale,
    changeLocale,
    changeBorders,
    changePlayerVisualMode,
    createFavoriteStationsFolder,
    deleteFavoriteStationsFolder,
    favoriteStations,
    historyList,
    playerVisualMode,
    renameFolder,
    removeFromFavorite,
    replaceFavoriteStations,
    stationPositionUp,
    stationPositionDown,
    selectStation,
    selectedStation,
    updateStationInFavoriteAndSelect,
  };
});
