import API from "./config";

type fetchPostsType = {
  isAuth: boolean;
  exclude?: string;
  skip: number;
};

export const fetchAllPosts = async (payload: fetchPostsType) => {
  const { isAuth, exclude, skip } = payload;
  const reqBody = {
    query: `
      query photos($isAuth: Boolean!, $exclude: ID, $skip: Float, $limit: Float) {
        photos(isAuth: $isAuth, exclude: $exclude, skip: $skip, limit: $limit) {
          data {
            _id imageUrl caption 
            user {
              _id name
            }
            likes {
              _id
            }
          }
          total
        }
      }
    `,
    variables: {
      isAuth: isAuth,
      exclude: exclude || null,
      skip: skip,
      limit: 10,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response?.photos;
    })
    .catch((error) => {
      console.log(error.response);
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
