import axios, { AxiosError, type AxiosProgressEvent } from "axios";
import { removeMetadata } from "@/shared/lib/utils/removeMetaDataFromName";

let stationsController: AbortController | undefined;

const getStations = async (
  baseUrl: string,
  url: string,
  dataParams: DataParams,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
): Promise<Station[] | null | "aborted"> => {
  stationsController?.abort();
  stationsController = new AbortController();
  try {
    const result = await axios({
      method: "POST",
      baseURL: baseUrl,
      url: url,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      signal: stationsController?.signal,
      data: dataParams,
      onDownloadProgress: downloadProgressFn,
    });
    const data = result.data as StationResponse[];
    const filteredRes = data.map((station) => ({
      bitrate: station.bitrate || 0,
      clickcount: station.clickcount || 0,
      codec: station.codec || "",
      country: station.country || "",
      countrycode: station.countrycode || "",
      favicon: station.favicon || "",
      homepage: station.homepage || "",
      language: station.language || "",
      languagecodes: station.languagecodes || "",
      name: station.name ? removeMetadata(station.name) : "Unknown station",
      state: station.state || "",
      stationuuid: station.stationuuid || "",
      tags: station.tags || "",
      url: station.url || "",
      url_resolved: station.url_resolved || "",
      votes: station.votes || 0,
      geo_lat: station.geo_lat || undefined,
      geo_long: station.geo_long || undefined,
    }));
    return filteredRes;
  } catch (e) {
    const error = e as AxiosError;
    if (error.code === "ERR_CANCELED") {
      return "aborted";
    }
    return null;
  }
};

export const getAllStations = (
  baseUrl: string,
  dataParams: DataParams,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return getStations(
    baseUrl,
    "/stations/search",
    dataParams,
    downloadProgressFn,
  );
};

export const getAllStationsMostVoted = (
  baseUrl: string,
  dataParams: DataParams,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return getStations(
    baseUrl,
    "/stations/topvote",
    dataParams,
    downloadProgressFn,
  );
};

let stationController: AbortController | undefined;

const getRequest = async (
  baseUrl: string,
  url: string,
  uploadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
): Promise<Station[] | null> => {
  stationController?.abort();
  stationController = new AbortController();
  try {
    const result = await axios({
      method: "GET",
      baseURL: baseUrl,
      url: url,
      signal: stationController.signal,
      onUploadProgress: uploadProgressFn,
    });

    return result.data;
  } catch (error) {
    return null;
  }
};

export const getStationInfoById = (
  baseUrl: string,
  stationId: string,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return getRequest(
    baseUrl,
    `stations/byuuid?uuids=${stationId}`,
    downloadProgressFn,
  );
};

export const sendStationClick = (
  baseUrl: string,
  stationId: string,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return getRequest(baseUrl, `/url/${stationId}`, downloadProgressFn);
};

export const voteForStation = (
  baseUrl: string,
  stationId: string,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return getRequest(baseUrl, `/vote/${stationId}`, downloadProgressFn);
};
