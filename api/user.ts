import API from "./config";

export const fetchProfile = (id: string) => {
  return new Promise(async (resolve, reject) => {
    const reqBody = {
      query: `
        query profile($userId: ID!){
          profile(userId: $userId), {
            _id
            name
            email
          }
        }
      `,
      variables: {
        userId: id,
      },
    };
    await API(reqBody)
      .then((response: any) => {
        resolve(response.profile);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
