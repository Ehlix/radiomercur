import { ref, shallowRef, watch } from "vue";
import { getStationInfoById } from "@/lib/api/stations";
import { useBaseUrlsStore } from "./baseUrlsStore";
import { getLSData, setLSData } from "@/lib/api/localStorage";
import { generateId } from "@/lib/utils/generateId";
import { createGlobalState } from "@vueuse/core";

export const useUserStore = createGlobalState(() => {
  const { baseUrl } = useBaseUrlsStore();
  const favoriteStations = ref<FavoriteStations>({
    default: { name: "default", stations: [] },
  });
  const selectedStation = ref<Station>();
  const historyList = shallowRef<Station[]>([]);
  const locale = ref<"en" | "ru">("en");
  const borders = ref<"rounded" | "square">("rounded");
  const playerVisualMode = ref<"1" | "2">("1");
  const volume = ref([100]);

  const lsData = getLSData();

  volume.value = [lsData?.userSettings?.volume || 100];
  historyList.value = lsData?.historyStations || [];

  const favoriteStationFromLS = lsData?.favoritesStations;
  favoriteStationFromLS &&
    (favoriteStations.value = {
      ...favoriteStationFromLS,
      default: {
        name: "default",
        stations: favoriteStationFromLS?.default?.stations || [],
      },
    });

  const localeFromLS = lsData?.userSettings?.language;
  const localeFromNav =
    window.navigator.language === "ru-RU" || window.navigator.language === "ru"
      ? "ru"
      : "en";
  locale.value = localeFromLS
    ? localeFromLS === "ru"
      ? "ru"
      : "en"
    : localeFromNav;

  const borderFromLS =
    lsData?.userSettings?.borders === "square" ? "square" : "rounded";
  borders.value = borderFromLS;
  document.body.classList.add(
    borderFromLS === "square" ? "not-rounded" : "rounded",
  );

  const playerVisualModeFromLS = lsData?.userSettings?.playerVisualMode;
  playerVisualMode.value = playerVisualModeFromLS === "2" ? "2" : "1";

  const addToHistory = (station: Station) => {
    if (
      historyList.value.length &&
      historyList.value[0]?.name === station.name
    ) {
      return;
    }
    const newHistory = [station, ...historyList.value];
    if (newHistory.length > 70) {
      newHistory.splice(49);
    }
    historyList.value = newHistory;
    setLSData({ historyStations: newHistory });
  };

  const selectStation = (station: Station) => {
    selectedStation.value = { ...station };
    addToHistory(station);
  };

  const changeLocale = (newLocale: "en" | "ru") => {
    locale.value = newLocale;
    setLSData({ userSettings: { language: newLocale } });
  };

  const changePlayerVisualMode = (newMode: "1" | "2") => {
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
    if (index === favoriteStations.value[folderId].stations.length - 1) {
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

  const updateVolumeLsData = () => {
    setLSData({ userSettings: { volume: volume.value[0] } });
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
    volume,
    updateStationInFavoriteAndSelect,
    updateVolumeLsData,
  };
});
