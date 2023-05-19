import API from "./config";

export const likePost = async (postId: string) => {
  const reqBody = {
    query: `
      mutation like($itemId: ID!, $type: String!) {
        like(likeInput: {itemId: $itemId, type: $type}), {
          _id
          user {
            _id
          }
        }
      }
    `,
    variables: {
      itemId: postId,
      type: "photo",
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

export const dislikePost = async (likeId: string) => {
  const reqBody = {
    query: `
      mutation dislike($itemId: ID!, $type: String!) {
        dislike(likeInput: {itemId: $itemId, type: $type}), {
          _id
        }
      }
    `,
    variables: {
      itemId: likeId,
      type: "photo",
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

export const likeComment = async (commentId: string) => {
  const reqBody = {
    query: `
      mutation like($itemId: ID!, $type: String!) {
        like(likeInput: {itemId: $itemId, type: $type}), {
          _id
          user {
            _id
          }
        }
      }
    `,
    variables: {
      itemId: commentId,
      type: "comment",
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

export const dislikeComment = async (likeId: string) => {
  const reqBody = {
    query: `
      mutation dislike($itemId: ID!, $type: String!) {
        dislike(likeInput: {itemId: $itemId, type: $type}), {
          _id
        }
      }
    `,
    variables: {
      itemId: likeId,
      type: "comment",
    },
  };
  return API(reqBody)
    .then((response: any) => {
      return response;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};
