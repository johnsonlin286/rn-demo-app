import API from "./config";

export const fetchComments = async (photoId: string) => {
  const reqBody = {
    query: `
      query comments($photoId: ID!, $skip: Float, $limit: Float) {
        comments(photoId: $photoId, skip: $skip, limit: $limit), {
          data {
            _id message
            user {
              _id name
            }
            reply {
              _id message
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
      photoId: photoId,
      skip: 0,
      limit: 4,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response.comments;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

export const postComment = async (photoId: string, message: string) => {
  const reqBody = {
    query: `
      mutation postComment($threadId: ID!, $message: String!) {
        postComment(commentInput: {threadId: $threadId, message: $message}), {
          _id message
          user {
            _id name
          }
          reply {
            _id
          }
          likes {
            _id
          }
        }
      }
    `,
    variables: {
      threadId: photoId,
      message: message,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response.postComment;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

export const postReplyThread = async (commentId: string, message: string) => {
  const reqBody = {
    query: `
      mutation postReply($threadId: ID!, $message: String!) {
        postReply(commentInput: {threadId: $threadId, message: $message}), {
          _id
          message
          user {
            _id
            name
          }
          likes {
            _id
          }
        }
      }
    `,
    variables: {
      threadId: commentId,
      message: message,
    },
  };
  return await API(reqBody)
    .then((response: any) => {
      return response.postReply;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};
