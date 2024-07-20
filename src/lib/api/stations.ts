import axios, { type AxiosProgressEvent } from "axios";

const getStations = async (
  baseUrl: string,
  url: string,
  dataParams: DataParams,
  downloadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
): Promise<StationResponse[] | null> => {
  const controller = new AbortController();

  try {
    const result = await axios({
      method: "POST",
      baseURL: baseUrl,
      url: url,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: dataParams,
      signal: controller?.signal,
      onDownloadProgress: downloadProgressFn,
    });
    return result.data;
  } catch (error) {
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

const getRequest = async (
  baseUrl: string,
  url: string,
  uploadProgressFn?: (progressEvent: AxiosProgressEvent) => void,
): Promise<Station[] | null> => {
  try {
    const result = await axios({
      method: "GET",
      baseURL: baseUrl,
      url: url,
      onUploadProgress: uploadProgressFn,
    });

    return result.data;
  } catch (error) {
    console.log(error);
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
