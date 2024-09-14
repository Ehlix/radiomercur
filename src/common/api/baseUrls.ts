import axios from "axios";

// const BASE_HTTP = "http://all.api.radio-browser.info/json";
const BASE_HTTPS_1 = "https://de1.api.radio-browser.info/json";
const BASE_HTTPS_2 = "https://at1.api.radio-browser.info/json";

const baseUrls = [BASE_HTTPS_1, BASE_HTTPS_2];

export const getBaseUrls = async (): Promise<BaseURL[] | null> => {
  const racers = baseUrls.map((url) =>
    axios({
      method: "GET",
      baseURL: url,
      url: "/servers",
    }),
  );
  try {
    const result = await Promise.any(racers);
    const servers = result.data;
    return await Promise.resolve(
      servers.map((server: { name?: string }) => {
        if (server.name) {
          return `https://${server.name}/json`;
        }
      }),
    );
  } catch (error) {
    return null;
  }
};
