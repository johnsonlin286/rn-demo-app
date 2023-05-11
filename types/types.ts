export type UserType = {
  _id: string;
  name?: string;
  email?: string;
};

export type LikesType = {
  _id: string;
  user: UserType;
};

export type ReplyType = CommentType;

export type CommentType = {
  _id: string;
  message: string;
  user: UserType;
  likes: LikesType[];
  reply?: ReplyType[];
};
