import axios from "axios";

const ALL_BASE_HTTP = "http://all.api.radio-browser.info/json";
const BASE_HTTPS = "https://de1.api.radio-browser.info/json";


export const getBaseUrls = async (): Promise<BaseURL[] | undefined> => {
  try {
    const result = await axios({
      method: "GET",
      baseURL: ALL_BASE_HTTP,
      url: "/servers",
    });

    const servers = result.data;
    return servers.map((server: { name?: string }) => {
      if (server.name) {
        return `https://${server.name}/json`;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getBaseUrls = (): Promise<BaseURL[] | undefined> => {
//   axios({
//     method: "GET",
//     baseURL: ALL_BASE_HTTP,
//     url: "/servers",
//   })
//     .then((result) => {
//       const servers = result.data;
//       return Promise.resolve(
//         servers.map((server: { name?: string }) => {
//           if (server.name) {
//             return `https://${server.name}/json`;
//           }
//         }),
//       );
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
//   return Promise.resolve([]);
// };
