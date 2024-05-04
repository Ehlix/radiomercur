import { ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getStationInfoById } from "@/lib/api/getStations";
import { useBaseUrlsStore } from "./baseUrlsStore";
import { getLSData, setLSData } from "@/lib/api/localStorage";
import { generateId } from "@/lib/utils/generateId";

export const useUserStore = defineStore("userStations", () => {
  const { baseUrl } = storeToRefs(useBaseUrlsStore());
  const favoriteStations = ref<FavoriteStations>({
    default: { name: "default", stations: [] },
  });
  const selectedStation = ref<Station>();
  const locale = ref<"en" | "ru">("en");
  const borders = ref<"rounded" | "square">("rounded");
  const playerVisualMode = ref<"1" | "2">("1");

  const lsData = getLSData();

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

  const borderFromLS = lsData?.userSettings?.borders;
  borders.value = borderFromLS === "square" ? "square" : "rounded";

  const playerVisualModeFromLS = lsData?.userSettings?.playerVisualMode;
  playerVisualMode.value = playerVisualModeFromLS === "2" ? "2" : "1";

  const selectStation = (station: Station) => {
    selectedStation.value = { ...station };
  };

  const changeLocale = (newLocale: "en" | "ru") => {
    locale.value = newLocale;
  };

  const changePlayerVisualMode = (newMode: "1" | "2") => {
    playerVisualMode.value = newMode;
  };

  const updateStationInFavoriteAndSelect = (
    station: Station,
    folderID: string,
    notSelect?: boolean,
  ) => {
    if (baseUrl.value && station.stationuuid) {
      getStationInfoById(baseUrl.value, station.stationuuid).then((res) => {
        if (res && res.length > 0) {
          favoriteStations.value[folderID].stations = favoriteStations.value[
            folderID
          ].stations.map((s) => {
            if (s.stationuuid === station.stationuuid) {
              s = res[0];
            }
            return s;
          });
          !notSelect && (selectedStation.value = res[0]);
          return;
        }
      });
    }
    !notSelect && (selectedStation.value = station);
  };

  const addToFavorite = ({ station, folderID }: StationAndId) => {
    if (favoriteStations.value[folderID]) {
      favoriteStations.value[folderID].stations.unshift(station);
    } else {
      favoriteStations.value["default"].stations.unshift(station);
    }
  };

  const removeFromFavorite = ({ station, folderID }: StationAndId) => {
    if (favoriteStations.value[folderID]) {
      favoriteStations.value[folderID].stations = [
        ...favoriteStations.value[folderID].stations.filter(
          (s) => s.stationuuid !== station.stationuuid,
        ),
      ];
    }
  };

  const renameFolder = ({
    folderID,
    name,
  }: {
    folderID: string;
    name: string;
  }) => {
    if (favoriteStations.value[folderID]) {
      favoriteStations.value[folderID].name = name;
    }
  };

  const changeBorders = (mode: typeof borders.value) => {
    borders.value = mode;
  };

  const replaceFavoriteStations = (
    stations: {
      stationOne: Station;
      stationTwo: Station;
    },
    folderID: string,
  ) => {
    if (stations.stationOne.stationuuid === stations.stationTwo.stationuuid) {
      return;
    }
    const indexOne = favoriteStations.value[folderID].stations.findIndex(
      (s) => s.stationuuid === stations.stationOne.stationuuid,
    );
    const indexTwo = favoriteStations.value[folderID].stations.findIndex(
      (s) => s.stationuuid === stations.stationTwo.stationuuid,
    );
    const filteredFolder = favoriteStations.value[folderID].stations.filter(
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
    favoriteStations.value[folderID].stations = newStations;
  };

  const stationPositionUp = ({ station, folderID }: StationAndId) => {
    const index = favoriteStations.value[folderID].stations.findIndex(
      (s) => s.stationuuid === station.stationuuid,
    );
    if (index === 0) {
      return;
    }
    const stationTwo = favoriteStations.value[folderID].stations[index - 1];
    favoriteStations.value[folderID].stations[index - 1] = station;
    favoriteStations.value[folderID].stations[index] = stationTwo;
  };

  const stationPositionDown = ({ station, folderID }: StationAndId) => {
    const index = favoriteStations.value[folderID].stations.findIndex(
      (s) => s.stationuuid === station.stationuuid,
    );
    if (index === favoriteStations.value[folderID].stations.length - 1) {
      return;
    }
    const stationTwo = favoriteStations.value[folderID].stations[index + 1];
    favoriteStations.value[folderID].stations[index + 1] = station;
    favoriteStations.value[folderID].stations[index] = stationTwo;
  };

  const createFavoriteStationsFolder = (name: string) => {
    const id = generateId();
    favoriteStations.value[id] = {
      name,
      stations: [],
    };
  };

  const deleteFavoriteStationsFolder = (folderID: string) => {
    if (folderID === "default" || !favoriteStations.value[folderID]) {
      return;
    }
    delete favoriteStations.value[folderID];
  };

  watch([playerVisualMode], () => {
    setLSData({ userSettings: { playerVisualMode: playerVisualMode.value } });
  });

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

  watch(
    [locale],
    () => {
      setLSData({ userSettings: { language: locale.value } });
    },
    {
      immediate: true,
    },
  );

  watch(
    [borders],
    () => {
      setLSData({ userSettings: { borders: borders.value } });
      if (borders.value === "square") {
        document.body.classList.add("not-rounded");
      } else {
        document.body.classList.remove("not-rounded");
      }
    },
    {
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
