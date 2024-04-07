type GenresList = { name: string };
type BaseURL = string | undefined;

type Station = {
  bitrate?: number;
  changeuuid?: string;
  clickcount?: number;
  clicktimestamp?: string;
  clicktrend?: number;
  codec?: string;
  country?: string;
  countrycode?: string;
  favicon?: string;
  geo_lat?: number;
  geo_long?: number;
  hls?: number;
  homepage?: string;
  has_extended_info?: boolean;
  language?: string;
  languagecodes?: string;
  lastcheckoktime?: string;
  lastcheckoktime_iso8601?: string;
  lastchecktime?: string;
  lastchecktime_iso8601?: string;
  lastlocalchecktime?: string;
  lastlocalchecktime_iso8601?: string;
  name?: string;
  state?: string;
  stationuuid?: string;
  tags?: string;
  url?: string;
  url_resolved?: string;
  votes?: number;
};

type ParamsOrder =
  | "name"
  | "url"
  | "homepage"
  | "favicon"
  | "tags"
  | "country"
  | "state"
  | "language"
  | "votes"
  | "codec"
  | "bitrate"
  | "lastcheckok"
  | "lastchecktime"
  | "clicktimestamp"
  | "clickcount"
  | "clicktrend"
  | "changetimestamp"
  | "random";

type NonNegativeInteger<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
    ? never
    : T;

type DataParams = {
  name: string;
  nameExact?: boolean;
  country?: string;
  countrycode?: string;
  language?: string;
  languageExact?: boolean;
  bitrateMin?: number;
  bitrateMax?: number;
  tag?: string;
  tagExact?: boolean;
  tagList?: string[];
  order?: ParamsOrder;
  reverse?: boolean;
  hidebroken?: boolean;
  limit: number;
  offset: number;
};

type SearchFilters = {
  name?: string;
  countryCode?: CountryCodes;
  country?: string;
  highQualityOnly?: boolean;
  tag?: string;
  language?: string;
  reverse?: boolean;
  order?: ParamsOrder;
};

type Theme =
  | "default"
  | "defaultLight"
  | "defaultDark"
  | "darkContrast"
  | "pastelLight"
  | "pastelDark"
  | "vavilon"
  | "apollo"
  | "greyScale";

type ThemeClasses = Partial<Record<Theme, string>>;

type ThemeObj = {
  name: string;
  value: Theme;
};

type Locale = "en" | "ru";

type UserSettings = {
  borders?: "rounded" | "square";
  colorTheme?: Theme;
  language?: Locale;
  playerVisualMode?: "1" | "2";
};

type FavObj = {
  name: string;
  stations: Station[];
};

type FavoriteStations = Record<string, FavObj> & Record<"default", FavObj>;

type LocalStorageData = {
  favoritesStations?: FavoriteStations;
  historyStations?: Station[];
  searchFilters?: SearchFilters;
  userSettings?: UserSettings;
};

type StationAndId = {
  station: Station;
  folderID: string;
};

type CountryCodes =
  | "AF"
  | "AX"
  | "AL"
  | "DZ"
  | "AS"
  | "AD"
  | "AO"
  | "AI"
  | "AQ"
  | "AG"
  | "AR"
  | "AM"
  | "AW"
  | "AU"
  | "AT"
  | "AZ"
  | "BS"
  | "BH"
  | "BD"
  | "BB"
  | "BY"
  | "BE"
  | "BZ"
  | "BJ"
  | "BM"
  | "BT"
  | "BO"
  | "BA"
  | "BW"
  | "BV"
  | "BR"
  | "IO"
  | "BN"
  | "BG"
  | "BF"
  | "BI"
  | "KH"
  | "CM"
  | "CA"
  | "CV"
  | "KY"
  | "CF"
  | "TD"
  | "CL"
  | "CN"
  | "CX"
  | "CC"
  | "CO"
  | "KM"
  | "CG"
  | "CD"
  | "CK"
  | "CR"
  | "HR"
  | "CU"
  | "CY"
  | "CZ"
  | "DK"
  | "DJ"
  | "DM"
  | "DO"
  | "EC"
  | "EG"
  | "SV"
  | "GQ"
  | "ER"
  | "EE"
  | "ET"
  | "FK"
  | "FO"
  | "FJ"
  | "FI"
  | "FR"
  | "GF"
  | "PF"
  | "TF"
  | "GA"
  | "GM"
  | "GE"
  | "DE"
  | "GH"
  | "GI"
  | "GR"
  | "GL"
  | "GD"
  | "GP"
  | "GU"
  | "GT"
  | "GG"
  | "GN"
  | "GW"
  | "GY"
  | "HT"
  | "HM"
  | "VA"
  | "HN"
  | "HK"
  | "HU"
  | "IS"
  | "IN"
  | "ID"
  | "IR"
  | "IQ"
  | "IE"
  | "IM"
  | "IL"
  | "IT"
  | "JM"
  | "JP"
  | "JE"
  | "JO"
  | "KZ"
  | "KE"
  | "KI"
  | "KR"
  | "KW"
  | "KG"
  | "LV"
  | "LB"
  | "LS"
  | "LR"
  | "LY"
  | "LI"
  | "LT"
  | "LU"
  | "MO"
  | "MK"
  | "MG"
  | "MW"
  | "MY"
  | "MV"
  | "ML"
  | "MT"
  | "MH"
  | "MQ"
  | "MR"
  | "MU"
  | "YT"
  | "MX"
  | "FM"
  | "MD"
  | "MC"
  | "MN"
  | "ME"
  | "MS"
  | "MA"
  | "MZ"
  | "MM"
  | "NA"
  | "NR"
  | "NP"
  | "NL"
  | "AN"
  | "NC"
  | "NZ"
  | "NI"
  | "NE"
  | "NG"
  | "NU"
  | "NF"
  | "MP"
  | "NO"
  | "OM"
  | "PK"
  | "PW"
  | "PS"
  | "PA"
  | "PG"
  | "PY"
  | "PE"
  | "PH"
  | "PN"
  | "PL"
  | "PT"
  | "PR"
  | "QA"
  | "RE"
  | "RO"
  | "RU"
  | "RW"
  | "BL"
  | "SH"
  | "KN"
  | "LC"
  | "MF"
  | "PM"
  | "VC"
  | "WS"
  | "SM"
  | "ST"
  | "SA"
  | "SN"
  | "RS"
  | "SC"
  | "SL"
  | "SG"
  | "SK"
  | "SI"
  | "SB"
  | "SO"
  | "ZA"
  | "ES"
  | "LK"
  | "SD"
  | "SR"
  | "SJ"
  | "SZ"
  | "SE"
  | "CH"
  | "SY"
  | "TW"
  | "TJ"
  | "TZ"
  | "TH"
  | "TL"
  | "TG"
  | "TK"
  | "TO"
  | "TT"
  | "TN"
  | "TR"
  | "TM"
  | "TC"
  | "TV"
  | "UG"
  | "UA"
  | "AE"
  | "GB"
  | "US"
  | "UM"
  | "UY"
  | "UZ"
  | "VU"
  | "VE"
  | "VN"
  | "VG"
  | "WF"
  | "EH"
  | "YE"
  | "ZM"
  | "ZW";
