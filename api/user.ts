import API from "./config";

export const fetchProfile = async (id: string) => {
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
  return await API(reqBody)
    .then((response: any) => {
      return response.profile;
    })
    .catch((error) => {
      return error;
    });
};
