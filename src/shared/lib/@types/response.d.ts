type StationResponse = {
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

type Station = {
  bitrate: number;
  clickcount: number;
  codec: string;
  country: string;
  countrycode: string;
  favicon: string;
  homepage: string;
  language: string;
  languagecodes: string;
  name: string;
  state: string;
  stationuuid: string;
  tags: string;
  url: string;
  url_resolved: string;
  votes: number;
  geo_lat?: number;
  geo_long?: number;
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
