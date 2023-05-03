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

// 2 アップデート
export type UserUpdateParams = {
  name: string;
  email: string;
  avatar?: File | null;
};

// ユーザー
export type User = {
  id: number;
  uid: string;
  provider: string;
  email: string;
  name: string;
  allowPasswordChange: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 1
  // avatarUrl: string | null;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
avatarUrl: string | null;
型を string | null としています。これは、avatar_url が文字列（URL）であるか、アバターが添付されていない場合に
は null であることを示しています。
このようにして、User 型に avatar_url を追加することで、フロントエンドで取得したユーザー情報にアバターの URL を
含めることができます。

------------------------------------------------------------------------------------------------
Active Storageを使用してファイルをアップロードする場合、ファイルは直接Userオブジェクトのavatar属性に保存される
のではなく、ファイルの情報がActive Storageのactive_storage_attachmentsテーブルに保存され、Userオブジェクト
のavatar属性には、active_storage_attachmentsテーブルのidが保存されます。そのため、avatar属性は、
{ url: string }だけでなく、nullも許容する必要があります。

Active Storageは、ファイルの実体を直接モデルオブジェクトの属性に保存するのではなく、ファイルの情報を
Active Storageのテーブル（active_storage_attachmentsテーブル）に保存します。このテーブルには、ファイルの情
報（ファイル名、MIMEタイプ、ファイルサイズなど）とファイル自体が保存されます。
そのため、モデルオブジェクトの属性（ここではavatar属性）に保存されるのは、active_storage_attachmentsテーブル
のIDであり、実際のファイル情報は、Active Storageを使って取得する必要があります。そのため、avatar属性は、URLの
形式でファイルを取得できる場合は{ url: string }として保存されますが、ファイルが存在しない場合やアタッチメントが
削除された場合は、属性はnullとなります。したがって、avatar属性は{ url: string }だけでなく、nullも許容する必
要があるということです。

================================================================================================
2
avatar?
プロフィール画像などのアップロードは任意であるためです。アップロードしない場合はnullやundefinedなどの値を入れるこ
とができます。

------------------------------------------------------------------------------------------------
UserUpdateParams の avatar フィールドはファイルをアップロードする際に使用するため、ファイルを扱うための File
型にします。
UserUpdateParamsは、ユーザーが自分の情報を更新するために使用されるフォームからの入力を表します。avatarフィール
ドは、アップロードされたファイルを表し、File型である必要があります。一方、User型は、サーバーからのレスポンスやクラ
イアント側で保持されるユーザー情報を表します。avatarフィールドは、アップロードされたファイルが保存された場所のURL
を表します。このような設計は、ユーザーがプロフィール画像などのファイルをアップロードできるようにするため、一般的によ
く使われます。

Active Storageを使ってファイルをアップロードする場合、ファイルは直接Userオブジェクトのavatar属性に保存されるの
ではなく、ファイルの情報がActive Storageのactive_storage_attachmentsテーブルに保存され、Userオブジェクトの
avatar属性には、active_storage_attachmentsテーブルのidが保存されます。そのため、
avatar属性は、{ url: string }だけでなく、nullも許容する必要があります。また、UserUpdateParamsのavatar属性
は、実際のファイルをアップロードするため、File型である必要があります。

具体的に言うと、例えばUserオブジェクトのavatar属性には、{ url: "/rails/active_storage/blobs/eyJf..."}の
ような文字列が保存されます。この文字列は、実際のファイルの情報が保存されているactive_storage_attachmentsテー
ブルのidを参照しています。つまり、ファイル自体はavatar属性には直接保存されておらず、その情報を参照するためにidが
保存されているのです。
このように、Active Storageを使ったファイルのアップロードでは、ファイルそのものではなく、その情報を参照するための
idが保存されるため、Userオブジェクトのavatar属性は、{ url: string }だけでなく、nullも許容する必要があります。
一方、ファイルをアップロードする際には、実際のファイルを扱う必要があるため、UserUpdateParamsのavatar属性は
File型である必要があります。このような設計がよく使われるのは、Active Storageを使ったファイルのアップロードが一
般的なためです。
*/
