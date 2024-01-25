// types/index.ts
// - 管理対象: 全体で共有される型情報
// - 提供する機能: アプリケーション全体で使用される型の定義
// - 利用意図: コード内で型を参照する際の一貫性を確保する

// サインアップ用の型定義
export type SignUpParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  confirmSuccessUrl: string;
};

// サインイン用の型定義
export type SignInParams = {
  email: string;
  password: string;
};

// 2 アップデート用の型定義
export type UserUpdateParams = {
  name: string;
  email: string;
  profile: string | null;
};

export type UserUpdateAvatarParams = {
  avatar: string | null;
};

// ユーザーの型定義
export type User = {
  id: number;
  uid: string;
  provider: string;
  email: string;
  name: string;
  allowPasswordChange: boolean;
  // 1.1
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
  // profile を追加。型は string または null を許容。プロフィールを設定しない場合を考慮。
  profile: string | null;
  // 1.2
  avatarUrl: string | null;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
TypescriptのDate型は、日付と時刻の情報を表すデータ型です。この型は、特定の日付と時刻を示すために使用されます。例
えば、ユーザーオブジェクトのcreatedAtやupdatedAtといった属性に使われています。

================================================================================================
1.2
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
------------------------------------------------------------------------------------------------
- Active StorageはRailsアプリのファイルアップロードを、ファイルの物理的な実体をモデルオブジェクトの属性に直接保
存するのではなく、`active_storage_blobs`と`active_storage_attachments`という2つの別々のテーブルに保存する
ことで管理します。
- active_storage_blobs` テーブルには、ファイル名、MIME タイプ、サイズなどのメタデータと共に実際のファイルが保
存される。
- active_storage_attachments` テーブルはモデルオブジェクトとブロブの結合テーブルとして動作する。これはファイ
ルの情報そのものを格納するのではなく、`active_storage_blobs`テーブルと関連するレコード（例えばUserモデル）へ
の参照を保持します。
------------------------------------------------------------------------------------------------
- モデルオブジェクト（例えば、Userモデル）では、（`avatar`のような）file属性はファイルのデータや
`active_storage_attachments`からのIDを格納しません。その代わりに、通常はActive Storageのメソッドを介して関
連付けられたファイルのブロブへの参照となります。
- アバターなどのファイルを取得するとき、Active StorageはファイルにアクセスするためのURLを提供し、このURLはフロ
ントエンドやアプリケーションの他の場所で必要に応じて保存または使用することができます。
- ファイルが存在しない場合、または添付ファイルが削除された場合、モデルのアバター属性（または `User` 型定義の
`avatarUrl` のようなその表現）は null になり、ファイルが存在しないことを示します。

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
