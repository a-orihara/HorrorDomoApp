// types/index.ts
// - 管理対象: 全体で共有される型情報
// - 提供する機能: アプリケーション全体で使用される型の定義
// - 利用意図: コード内で型を参照する際の一貫性を確保する

// ユーザー情報の型定義
export type SignUpParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

// サインイン
export type SignInParams = {
  email: string;
  password: string;
};

// アップデート
export type UserUpdateParams = {
  name: string;
  email: string;
  // password: string;
  // passwordConfirmation: string;
};

// ユーザー
export type User = {
  id: number;
  uid: string;
  provider: string;
  email: string;
  name: string;
  // nickname?: string;
  image?: string;
  allowPasswordChange: boolean;
  created_at: Date;
  updated_at: Date;
};
