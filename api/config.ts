import axios from "axios";
import axiosRetry from "axios-retry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

axiosRetry(axios, { retries: 3 });

export default function API(reqbody: any) {
  return new Promise(async (resolve, reject) => {
    const savedStorage = await AsyncStorage.getItem("user");
    let storage;
    if (savedStorage) {
      storage = JSON.parse(savedStorage);
    }
    await axios
      .post(API_URL, reqbody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: storage ? `Bearer ${storage.token}` : null,
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
