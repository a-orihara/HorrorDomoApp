export type Post = {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostParams = {
  content: string;
};
