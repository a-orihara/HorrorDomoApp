export type Post = {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostParams = {
  title: string;
  content: string;
};
