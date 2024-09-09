const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const validateLsData = (json: string): LocalStorageData | null => {
  try {
    const ls = JSON.parse(json);

    const res: LocalStorageData = {
      favoritesStations: ls.favoritesStations || [],
      historyStations: ls.historyStations || [],
      searchFilters: {
        highQualityOnly:
          ls.searchFilters?.highQualityOnly === false ? false : true,
        reverse: ls.searchFilters?.reverse === false ? false : true,
      },
      userSettings: {
        borders: ls.userSettings?.borders === "square" ? "square" : "rounded",
        colorTheme: ls.userSettings?.colorTheme ?? "default",
        language:
          ls.userSettings?.language === "en" ||
          ls.userSettings?.language === "ru"
            ? ls.userSettings?.language
            : undefined,
        playerVisualMode: ls.userSettings?.playerVisualMode === "2" ? "2" : "1",
        volume:
          ls.userSettings?.volume <= 100 || ls.userSettings.volume >= 0
            ? ls.userSettings.volume
            : 100,
      },
    };
    return res;
  } catch (error) {
    return null;
  }
};

export const getLSData = (): LocalStorageData | null => {
  const lcString = getLocalStorage("localStorageData");
  if (lcString) {
    return validateLsData(lcString);
  }
  return null;
};

const setLocalStorage = (key: string, value: NewLsData) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setLSData = (LSNewData: NewLsData) => {
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
