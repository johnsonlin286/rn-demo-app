import API from "./config";

type fetchPostsType = {
  exclude?: string;
  skip: number;
};

export const fetchAllPosts = async (payload: fetchPostsType) => {
  const { exclude, skip } = payload;
  const reqBody = {
    query: `
      query photos($exclude: ID, $skip: Float, $limit: Float) {
        photos(exclude: $exclude, skip: $skip, limit: $limit) {
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
      return {
        error: error.response,
      };
    });
};

export const fetchPhoto = async (photoId: string) => {
  const reqBody = {
    query: `
      query photo($photoId: ID!) {
        photo(photoId: $photoId), {
          _id imageUrl caption
          user {
            _id name
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
      return {
        error: error.response,
      };
    });
};

export const fetchUserPhotos = async (userId: string, skip: number) => {
  const reqBody = {
    query: `
      query userPhotos($userId: ID!, $skip: Float, $limit: Float) {
        userPhotos(userId: $userId, skip: $skip, limit: $limit) {
          data {
            _id imageUrl caption
            user {
              _id name
            }
            likes {
              _id
              user {
                _id
              }
            }
          }
          total
        }
      }
    `,
    variables: {
      userId: userId,
      skip: skip || 0,
      limit: 5,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response.userPhotos;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

export const insertPost = async (imageUrl: string, caption: string) => {
  const reqBody = {
    query: `
      mutation post($imageUrl: String!, $caption: String!) {
        post(postInput: {imageUrl: $imageUrl, caption: $caption}), {
          _id
        }
      }
    `,
    variables: {
      imageUrl: imageUrl,
      caption: caption,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response?.post;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

export const deletePost = async (photoId: string) => {
  const reqBody = {
    query: `
      mutation deletePost($photoId: ID!){
        deletePost(photoId: $photoId), {
          _id
        }
      }
    `,
    variables: {
      photoId: photoId,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response.deletePost;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

export const editPost = async (photoId: string, caption: string) => {
  const reqBody = {
    query: `
      mutation updatePost($postId: ID!, $caption: String!) {
        updatePost(updatePostInput: {photoId: $postId, caption: $caption}), {
          _id
        }
      }
    `,
    variables: {
      postId: photoId,
      caption: caption,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};
