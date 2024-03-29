import axios, { AxiosError } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAlertContext } from '../contexts/AlertContext';

// サインアップ時のmail認証用のコンポーネント
const MailConfirmation: NextPage = () => {
  const router = useRouter();
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();

  // 2.1 ルーターが準備されないと、後続の処理（API呼び出しやアラートの表示など）を実行しない
  useEffect(() => {
    // 2.2
    if (!router.isReady) {
      return;
    }

    const confirmEmail = async () => {
      // 3.1
      if (router.query['confirmation_token']) {
        const url = process.env.NEXT_PUBLIC_API_URL + '/user/confirmations';
        try {
          // 3.2
          const res = await axios({ method: 'PATCH', url: url, data: router.query });
          // user認証に成功したケース
          if (res.status === 200) {
            setAlertMessage(res.data.message);
            setAlertSeverity('success');
            setAlertOpen(true);
            router.push('/signin');
          // 200以外のエラーではないレスポンスのケース
          } else {
            setAlertSeverity('error');
            setAlertMessage('認証に失敗しました');
            setAlertOpen(true);
          }
        // 3.3
        } catch (err) {
          console.log(`ここに${err}`);
          if (err instanceof AxiosError) {
            // userが見つからないケース
            if (err.response?.status === 404) {
              setAlertSeverity('error');
              setAlertMessage(err.response.data.message);
              setAlertOpen(true);
              router.push('/');
            // userが既に認証済みのケース
            } else if (err.response?.status === 422) {
              setAlertSeverity('error');
              setAlertMessage(err.response.data.message);
              setAlertOpen(true);
              router.push('/');
            // AxiosErrorの上記以外のケース
            } else {
              console.log(`ここだ${JSON.stringify( err.response)}`);
              setAlertMessage('サーバーへの接続に失敗しました');
              setAlertSeverity('error');
              setAlertOpen(true);
              router.push('/');
            }
          // AxiosError以外のケース
          } else {
            setAlertMessage('予期しないエラーが発生しました');
            setAlertSeverity('error');
            setAlertOpen(true);
            router.push('/');
          }
        }
      }
    };
    confirmEmail();
  }, [router, setAlertMessage, setAlertSeverity, setAlertOpen]);

  return <></>;
};

export default MailConfirmation;


/*
@          @@          @@          @@          @@          @@          @@          @@          @
2.1
このコードの`return <></>;`は、コンポーネントがレンダリングする際に何も表示しないことを意味している。このような
コードの使用意図は、主に下記の2点に集約される。
------------------------------------------------------------------------------------------------
. **バックグラウンドでの処理を重視：** このコードは、メール認証用のコンポーネントとして設計されている。ここで重要
なのは、ユーザーインターフェイス(UI)を表示することではなく、URLのクエリーパラメータ（こういうの：http://example
.com/posts?category=technology&date=20240210`）を使ってバックエンドとの間で認証処理を行うことである。つま
り、ユーザーに何かを見せるよりも、バックグラウンドでのデータ処理や状態の更新が主な目的となる。
------------------------------------------------------------------------------------------------
. **リダイレクト処理：** このコンポーネントでは、認証が成功したか、もしくは不正なアクセスが行われたかに応じて、ユ
ーザーを別のページ（例えばサインインページやホームページ）へリダイレクトしている。このため、コンポーネント自体がユー
ザーに対して何かを表示する必要はなく、単にリダイレクト処理を行うための「通過点」として機能している。
------------------------------------------------------------------------------------------------
簡単に言えば、このコンポーネントは主にバックエンドとの通信やリダイレクト処理を行うためのものであり、その間ユーザー
に対しては何も表示しないことを意図している。

================================================================================================
2.2
`if (!router.isReady)` は、ルーターの準備が完了していない場合に何もしないようにするための条件文です。
------------------------------------------------------------------------------------------------
`if (!router.isReady)` の意味と使用意図：
- `router` は Next.js の `useRouter` フックを使用して取得されています。これは、ルーターオブジェクトを表す。
------------------------------------------------------------------------------------------------
- `router.isReady` は、ルーターオブジェクトのプロパティで、ルーターが初期化され、準備が完了したかどうかを示すブ
ール値です。つまり、`true` の場合、ルーターが準備完了していることを意味し、`false` の場合、まだ初期化やデータの
読み込みが行われていないことを示します。
------------------------------------------------------------------------------------------------
- `if (!router.isReady)` は、ルーターがまだ初期化されておらず、データの読み込みが行われていない場合に条件を満
たすことを意味します。ルーターが初期化されていない状態とは、ページのURLやパス、クエリーパラメータなどの情報がまだ完
全に読み込まれていないことを指す。
------------------------------------------------------------------------------------------------
- 使用意図：このコードの目的は、ページコンポーネントが初期化される際に、ルーターが完全に初期化されるまで待機するこ
とです。`router.isReady` が `true` でない場合、まだルーターが完全に準備されていないため、後続の処理（API呼び出
しやアラートの表示など）を実行しないようにしています。これにより、ページが正しく初期化され、必要なデータが読み込まれ
てから処理が実行されることを保証します。

================================================================================================
3.1
`router.query`
`query` は、ルーターオブジェクトから取得されるクエリーパラメータ（query parameter）を指します。
- `router.query` は、ルーターオブジェクトから現在のURLのクエリーパラメータを取得するためのプロパティです。バッ
クエンドのrailsのdeviseのconfirmのmail認証で、`confirmation_token=#{@token}`を送っている。
- クエリーパラメータは、URLに付与されたキーと値のペアで、通常は `?` の後にキーと値が続く形式で表現されます。
- `router.query['confirmation_token']` は、現在のURLのクエリーパラメータから `confirmation_token` とい
うキーに関連付けられた値を取得します。
- このコードの目的は、`confirmation_token` クエリーパラメータが存在するかどうかを確認することです。
------------------------------------------------------------------------------------------------
router.query['confirmation_token']
queryはオブジェクト。ブラケット記法（`object['property']`）とドット記法（`object.property`）の両方が有効。
クエリパラメータにアクセスする際にブラケット記法を使用するのは一般的なパターンであり、これらのパラメータは動的な性質
を持つことが多いからです。router.query`のキーはURLのクエリー文字列によって決まります。

================================================================================================
3.2
- `method: 'PATCH'`：HTTPリクエストの種類を指定する。`PATCH`は一部のデータを更新するために使用される。この場
合、ユーザーの認証状態を更新するために使われている。
- `url: url`：リクエストを送る先のURLを指定する。
- `data: router.query`：リクエストと一緒に送るデータを指定する。ここでは`router.query`（URLのクエリーパラメ
ータ）をデータとして使用している。このデータには`confirmation_token`が含まれる。
------------------------------------------------------------------------------------------------
. **`'PATCH'`を使う理由：**
- `'PATCH'`メソッドは、リソースの一部分だけを更新する際に使用されるHTTPメソッドである。
- バックエンド側の`confirmations_controller.rb`にある`update`メソッドは、ユーザーの`confirmed_at`を更新し
ている。これはユーザーの一部の情報（ここでは認証状態）のみを更新するため、`PATCH`が適切である。
- `PATCH`は全体を更新する`PUT`と異なり、変更したい部分のみを送信するため、より効率的である。特に、大きなデータ構
造の一部を変更する場合に有用である。

================================================================================================
3.3
. **`e: AxiosError`の解説：**
- `AxiosError`は、Axiosライブラリによって提供されるエラーオブジェクトの型である。これは、Axiosを使用してHTTPリ
クエストを行う際に発生したエラー情報を包含している。
- `e: AxiosError`の記述は、`catch`ブロック内で発生したエラーを変数`e`として扱うことを意味する。この`e`は
`AxiosError`型のオブジェクトであり、エラーに関する詳細情報（エラーメッセージ、HTTPステータスコード、発生したリク
エストとレスポンスの詳細など）にアクセスできる。
- `e.message`などを使用して、エラーの詳細を取得しログ出力やUI上でのエラー表示などに使用することができる。
------------------------------------------------------------------------------------------------
. **`<{ error: string }>`の解説：**
- `AxiosError<{ error: string }>`の`<{ error: string }>`は、TypeScriptのジェネリクスを使用している。こ
れは、エラーオブジェクトが持つレスポンスデータの型を指定している。
- ここでは、エラーレスポンスが`{ error: string }`という形式のオブジェクトであることを示している。つまり、エラー
レスポンスの本体が文字列型の`error`フィールドを持つことを期待している。
- この型指定を行うことで、TypeScriptは`e.response.data.error`のようにアクセスした際に、`data`が`
{ error: string }`型であると認識し、適切な型チェックを行うことができる。
- バックエンドのコードを見ると、エラーレスポンスとしてJSONオブジェクトが返されており、`{ message: "..." }`の形
式をとっている。フロントエンドの型定義はこれと一致していないため、実際のレスポンスに合わせて型定義を更新する必要があ
るかもしれない。
*/