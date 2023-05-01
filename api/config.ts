import axios from "axios";
import axiosRetry from "axios-retry";
import { API_URL } from "@env";

axiosRetry(axios, { retries: 3 });

export default function API(reqbody: any, token?: string) {
  return new Promise(async (resolve, reject) => {
    await axios
      .post(API_URL, reqbody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        // console.log("axios: ", response.data);
        return resolve(response.data.data);
        // return response.data;
      })
      .catch((error) => {
        return reject(error);
        // return error;
      });
  });
}
