import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { signOut } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { AxiosError } from 'axios';

// サインアウト処理。処理後は、トップページに遷移する。
export const useSignOut = () => {
  const { setIsSignedIn, setCurrentUser } = useAuthContext();
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (res.status === 200) {
        console.log(`signOutのres.data:${JSON.stringify(res.data)}`);
        // 1.1 サインアウト時には各Cookieを削除
        Cookies.remove('access-token');
        Cookies.remove('client');
        Cookies.remove('uid');
        // ここで、isSignedInをfalseにしないと、ログアウト後にヘッダーのボタンが変わらない。
        setIsSignedIn(false);
        // ユーザーを未定義にする
        setCurrentUser(undefined);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        // サインアウトしたら、トップページに遷移
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        // axiosがエラーをスローしない、200以外のステータスコードを汎用的に扱う
        setAlertSeverity('error');
        setAlertMessage('サインインに失敗しました');
        setAlertOpen(true);
      }
    } catch (err: any) {
      // デフォルトメッセージを設定し、これをAxiosに関連しない、その他のエラーの際に表示
      let errorMessage = '予期しないエラーが発生しました';
      // Axiosエラーかチェック
      if (err instanceof AxiosError) {
        // resと省略するとresposeオブジェクトが拾えずにエラーになる
        if (err.response) {
          errorMessage = err.response.data.errors
          ? err.response.data.errors.join(', ')
          : '不明なエラーが発生しました';
        }else {
        // Axiosのレスポンスがない、JavaScript他のエラーの場合のメッセージ
        setAlertMessage('サーバーへの接続に失敗しました');
        }
      }
      setAlertSeverity('error');
      setAlertMessage(errorMessage);
      setAlertOpen(true);
    }
  };
  // ------------------------------------------------------------------------------------------------
  return handleSignOut;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
. devise_token_authのsessions_controllerのdestroyの正しく作動させる為、フロントでクッキーにトークンをセッ
トしてリクエスト。sessions_controller.rbのdestroyはDB側でそのサインインユーザーに紐づいたトークンを削除するだ
けなので、クッキーに保存じたトークンはフロント側で改めて削除する。
------------------------------------------------------------------------------------------------
**レスポンスヘッダとリクエストヘッダの違い**
- サーバから送り返されるレスポンスヘッダとクライアントから送られるリクエストヘッダを区別することは重要です。
DeviseTokenAuth::SessionsController` の `destroy` アクションでは、レスポンスヘッダに 'access-token'、
'client'、'uid' を含める明示的なコードはありません。レスポンスオブジェクトに表示されているこれらのヘッダは、 ク
ライアントが送信したリクエストヘッダの一部である可能性が高い
------------------------------------------------------------------------------------------------
**クライアント側のヘッダー管理**：
- frontend/front/src/api/auth.ts`にあるコードは、サインアウト操作を実行するために、サーバーへのリクエストにこ
れらのヘッダーを含めます。これは、サーバーがどのユーザーセッションを終了するかを識別するために必要です：。
------------------------------------------------------------------------------------------------
**サーバーの処理と応答**：
- サーバー側では、これらのヘッダーを使用して、終了するユーザー・セッションを識別し、検証する。サインアウトに成功し
た後、サーバーはこれらのトークンをレスポンスで送り返す必要はない。SessionsController` の
`render_destroy_success` メソッドは成功メッセージを返すだけです：
------------------------------------------------------------------------------------------------
. **サインアウト後のクライアント側の処理**：
- サインアウトが成功すると、それに応じて状態を処理するのはクライアント側のコードの責任です。これには、保存されてい
るトークンやセッション情報をクリアすることも含まれます。useSignOut`フックでは、すでにこれらのトークンをクッキーか
ら削除しています

*/
