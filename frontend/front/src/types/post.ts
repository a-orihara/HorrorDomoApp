export type Post = {
  id: number;
  title: string;
  content: string;
  userId: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
};

export type CreatePostParams = {
  title: string;
  content: string;
};
