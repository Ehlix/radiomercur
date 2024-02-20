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
