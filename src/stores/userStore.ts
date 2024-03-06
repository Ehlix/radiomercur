import { ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { getStationInfoById } from "@/api/getStations";
import { useBaseUrl } from "./baseUrl";
import { getLSData, setLSData } from "@/api/localStorage";

export const useUserStore = defineStore("userStations", () => {
  const { baseUrl } = storeToRefs(useBaseUrl());
  const favoriteStations = ref<Station[]>([]);
  const selectedStation = ref<Station>();
  const locale = ref<"en" | "ru">("en");
  const borders = ref<"rounded" | "square">("rounded");

  favoriteStations.value = getLSData()?.favoritesStations || [];
  const localeFromLS = getLSData()?.userSettings?.language;
  const localeFromNav =
    window.navigator.language === "ru-RU" || "ru" ? "ru" : "en";

  locale.value = localeFromLS
    ? localeFromLS === "ru"
      ? "ru"
      : "en"
    : localeFromNav;

  const borderFromLS = getLSData()?.userSettings?.borders;
  borders.value = borderFromLS === "square" ? "square" : "rounded";

  const selectStation = (station: Station) => {
    selectedStation.value = { ...station };
  };

  const changeLocale = (newLocale: "en" | "ru") => {
    locale.value = newLocale;
  };

  const selectStationWithUpdate = (station: Station) => {
    if (baseUrl.value && station.stationuuid) {
      getStationInfoById(baseUrl.value, station.stationuuid).then((res) => {
        console.log(res);
        if (res) {
          selectedStation.value = res;
          return;
        }
      });
    }
    selectedStation.value = station;
  };

  const addToFavorite = (station: Station) => {
    favoriteStations.value.unshift(station);
  };

  const removeFromFavorite = (station: Station) => {
    favoriteStations.value = [...favoriteStations.value].filter(
      (s) => s.stationuuid !== station.stationuuid,
    );
  };

  const changeBorders = (mode: typeof borders.value) => {
    borders.value = mode;
  };

  watch(
    [favoriteStations],
    () => {
      setLSData({ favoritesStations: favoriteStations.value });
    },
    {
      deep: true,
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
    removeFromFavorite,
    favoriteStations,
    selectStation,
    selectedStation,
    selectStationWithUpdate,
  };
});
