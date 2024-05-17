const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const getLSData = (): LocalStorageData | null => {
  const lcString = getLocalStorage("localStorageData");
  if (lcString) {
    try {
      const ls = JSON.parse(lcString);

      const res: LocalStorageData = {
        favoritesStations: ls.favoritesStations,
        historyStations: ls.historyStations,
        searchFilters: {
          highQualityOnly:
            ls.searchFilters?.highQualityOnly === undefined
              ? true
              : !!ls.searchFilters?.highQualityOnly,
          reverse:
            ls.searchFilters?.reverse === undefined
              ? true
              : !!ls.searchFilters?.reverse,
        },
        userSettings: {
          borders: ls.userSettings?.borders === "square" ? "square" : "rounded",
          colorTheme: ls.userSettings?.colorTheme ?? "default",
          language:
            ls.userSettings?.language === "en" ||
            ls.userSettings?.language === "ru"
              ? ls.userSettings?.language
              : undefined,
          playerVisualMode: ls.userSettings?.playerVisualMode ?? "1",
        },
      };
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return null;
};

const setLocalStorage = (key: string, value: LocalStorageData) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setLSData = (LSNewData: LocalStorageData) => {
  const LSPrevData = getLSData();
  if (LSPrevData) {
    setLocalStorage("localStorageData", {
      ...LSPrevData,
      ...LSNewData,
      userSettings: {
        ...LSPrevData.userSettings,
        ...LSNewData.userSettings,
      },
    });
  } else {
    setLocalStorage("localStorageData", LSNewData);
  }
};

export const clearLSData = () => {
  localStorage.removeItem("localStorageData");
};
