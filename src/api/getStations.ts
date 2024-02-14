import { useBaseUrl } from "@/stores/baseUrl";
import axios from "axios";

const store = useBaseUrl();

const handleError = async () => {
  await store.setBaseUrl();
  return;
};

export const getStations = async (url: string, dataParams: DataParams) : Promise<Station[]> => {
  if (!store.baseUrl) {
    await store.setBaseUrl();
  }
  const controller = new AbortController();

  try {
    const result = await axios({
      method: "POST",
      baseURL: store.baseUrl,
      url: url,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: dataParams,
      signal: controller?.signal,
    });
    return result.data;
  } catch (error) {
    console.log(error)
      await handleError();
      return await getStations(url, dataParams);
  }
};

export const getCurrentStation = async (url: string) => {
  if (!store.baseUrl) {
    await store.setBaseUrl();
  }

  try {
    const result = await axios({
      method: "GET",
      baseURL: store.baseUrl,
      url: url,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};
