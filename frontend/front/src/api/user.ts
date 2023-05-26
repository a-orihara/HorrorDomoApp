import Cookies from 'js-cookie';
import client from './client';

// 1 ユーザー一覧を取得する（ページネーション）
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
  });
};

// 指定したIDのユーザー情報を取得する:#GET /api/v1/users/1->users_controller.rbのshowアクション.
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
*/
