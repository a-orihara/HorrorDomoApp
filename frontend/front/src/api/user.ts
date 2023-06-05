import Cookies from 'js-cookie';
import client from './client';

// 1 ユーザー一覧を取得する（ページネーション）:GET /api/v1/users/1->users_controller#indwex
export const userIndex = (page: number, itemsPerPage: number) => {
  return client.get('/users', {
    params: {
      page: page + 1, // APIは1から始まるページ番号を期待しているため、+1を行います
      per_page: itemsPerPage,
    },
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
    // res:指定したページの指定した表示件数分のユーザーと総ユーザー数
  });
};

// 指定したIDのユーザー情報を取得する:GET /api/v1/users/1->users_controller#show
export const getUserById = (userId: string) => {
  // console.log('getUserByIdが呼ばれた');
  return client.get(`/users/${userId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 2 ユーザー情報を更新
export const updateUser = (formData: any) => {
  return client.put('/auth', formData, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// ユーザーを削除する
export const userDelete = (userId: number) => {
  return client.delete(`/admin/users/${userId}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// export const signIn = (params: SignInParams) => {
//   return client.post('/auth/sign_in', params);
// };
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
この関数は、ページ番号とページ当たりの項目数を指定して、APIからユーザーリストを取得します。関数は、APIへのアクセス
時に、Railsで認証されたユーザー情報を含むヘッダーを送信するように構成されています。
paramsのヘッダー情報を追加している。
pageとper_pageの2つのパラメーターが指定されています。これらのパラメーターは、kaminariを使用してページングを実装
するために、Railsで使用されます。pageは、現在のページ番号を示し、per_pageは各ページに表示する項目の数を示します。
================================================================================================
2
updateAvatar に headers: { 'content-type': 'multipart/form-data' } を追加するかどうか。
通常、FormData オブジェクトを使用してファイルを送信する場合、content-type ヘッダーに multipart/form-data を
設定することが推奨されています。
ただし、Axiosは、自動的に content-type ヘッダーを multipart/form-data に設定します。したがって、明示的に追加
する必要はありません。
*/
