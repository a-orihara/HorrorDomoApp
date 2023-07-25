export type FollowUser = {
  id: number;
  uid: string;
  provider: string;
  email: string;
  name: string;
  allowPasswordChange: boolean;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
  profile: string | null;
  avatarUrl: string | null;
};
