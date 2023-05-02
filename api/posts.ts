import API from "./config";

export const fetchAllPosts = async (isAuth: boolean, skip: number) => {
  const reqBody = {
    query: `
      query photos($isAuth: Boolean!, $skip: Float, $limit: Float) {
        photos(isAuth: $isAuth, skip: $skip, limit: $limit) {
          data {
            _id
            imageUrl
          }
          total
        }
      }
    `,
    variables: {
      isAuth: isAuth,
      skip: skip,
      limit: 10,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response?.photos;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const fetchPhoto = async (photoId: string) => {
  const reqBody = {
    query: `
      query photo($photoId: ID!) {
        photo(photoId: $photoId), {
          _id
          imageUrl
          caption
          user {
            _id
            name
          }
          likes {
            _id
            user {
              _id
            }
          }
        }
      }
    `,
    variables: {
      photoId: photoId,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response.photo;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
