// types/index.ts
// - 管理対象: 全体で共有される型情報
// - 提供する機能: アプリケーション全体で使用される型の定義
// - 利用意図: コード内で型を参照する際の一貫性を確保する

// ユーザー情報の型定義
export type User = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
