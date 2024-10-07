type GenresList = { name: string };
type BaseURL = string | undefined;

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type NonNegativeInteger<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
    ? never
    : T;

type Theme =
  | "default"
  | "defaultLight"
  | "defaultDark"
  | "darkContrast"
  | "pastelLight"
  | "pastelDark";

type ThemeClasses = Partial<Record<Theme, string>>;

type ThemeObj = {
  name: string;
  value: Theme;
};

type Locale = "en" | "ru";

type UserSettings = {
  borders: "rounded" | "square";
  colorTheme: Theme;
  language: Locale;
  playerVisualMode: "1" | "2";
  volume: number;
};

type FavObj = {
  name: string;
  stations: Station[];
};

type FavoriteStations = Record<string, FavObj> & Record<"default", FavObj>;

type LocalStorageData = {
  favoritesStations: FavoriteStations;
  historyStations: Station[];
  searchFilters: SearchFilters;
  userSettings: UserSettings;
};

type NewLsData = RecursivePartial<LocalStorageData>;

type StationAndId = {
  station: Station;
  folderId: string;
};
