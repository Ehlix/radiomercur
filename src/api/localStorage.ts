const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const getLSData = (): LocalStorageData | null => {
  const lcString = getLocalStorage("localStorageData");
  if (lcString) {
    const lc = JSON.parse(lcString);
    return lc;
  }
  return null;
};

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setLSData = (LSData: LocalStorageData) => {
  const ls = getLSData();
  if (ls) {
    setLocalStorage("localStorageData", {
      ...ls,
      ...LSData,
    });
  }
};
