type DataParams = {
  name?: string;
  nameExact?: boolean;
  country?: string;
  countrycode?: string;
  language?: string;
  languageExact?: boolean;
  has_geo_info?: boolean;
  bitrateMin?: number;
  bitrateMax?: number;
  tag?: string;
  tagExact?: boolean;
  tagList?: string[];
  order?: ParamsOrder;
  reverse?: boolean;
  hidebroken?: boolean;
  limit?: number;
  offset?: number;
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
