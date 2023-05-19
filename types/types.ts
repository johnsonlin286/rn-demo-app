export type UserType = {
  _id: string;
  name: string;
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

export type PhotoType = {
  _id: string;
  imageUrl?: string;
  caption?: string;
  user?: UserType;
  likes?: LikesType[];
  comments?: CommentType[];
  created_at?: string;
};
