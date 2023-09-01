import axios, { AxiosInstance } from 'axios'; // eslint-disable-line import/named
import applyCaseMiddleware from 'axios-case-converter';

// 1
const options = {
  ignoreHeaders: true,
};

// 2
const client: AxiosInstance = applyCaseMiddleware(
  axios.create({
    // 3 下記の書き方で開発、本番の別々のurlを設定できる
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    timeout: 5000,
  }),
  options
);

// TMDB用のインスタンスを追加
const tmdbClient: AxiosInstance = applyCaseMiddleware(
  axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 5000,
  }),
  options
);

export { client, tmdbClient };

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
applyCaseMiddleware:
axiosで受け取ったレスポンスの値をスネークケース→キャメルケースに変換
または送信するリクエストの値をキャメルケース→スネークケースに変換してくれるライブラリ
------------------------------------------------------------------------------------------------
applyCaseMiddlewareに渡すオプションを設定。
ignoreHeaders: trueは、HTTPヘッダーをキャメルケースに変換するのを無視するオプションである。
ヘッダーに関してはケバブケースのままで良いので適用を無視するオプションを追加。

================================================================================================
2
client.post('/auth/sign_in', params);になる。
使わないとこう、
axios.post('http://localhost:3000/api/v1/auth/sign_in', params, {
    timeout: 5000,
  });
------------------------------------------------------------------------------------------------
applyCaseMiddlewareでaxios-case-converterを適用している。
applyCaseMiddlewareは、HTTPリクエストのパラメータをキャメルケースからスネークケースに変換するライブラリです。
逆の変換も可。

const params = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
};

response.dataは次のようになる：
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
    }
------------------------------------------------------------------------------------------------
axiosのインスタンスを作成することで、通信時に共通して適用する設定を定義したり、複数のサーバーとの通信を行う場合に
区別するための名前を付けたりすることができます。

.axios.create
axiosインスタンスを作成

.baseURL
HTTPリクエストのURLのベースとなるURLを設定することができる。

.timeout
Axiosで設定できるリクエストのタイムアウト時間を指定するオプションです。ここで指定されたミリ秒数が経過すると、リク
エストはキャンセルされます。

================================================================================================
3
Next.jsは、環境変数を.env.localや、.env.development.local、.env.production.local等のファイルから、
process.envに読み込むことが可能です。
------------------------------------------------------------------------------------------------
.env.localからprocess.envに読み込む` について:
- `process.env`はNode.jsで提供されるグローバルオブジェクトで、環境変数を管理します。
- `.env.local` ファイル内の変数はNext.jsが起動する際に`process.env`に格納されます。
- この`process.env`を通してサーバーサイドのコードで環境変数にアクセス可能。
- `NEXT_PUBLIC_`を接頭辞とする環境変数は、クライアントサイドでも使えます。
- 通常、環境変数はサーバーサイドでしかアクセスできません。
- `NEXT_PUBLIC_`をつけることで、この制限を解除しフロントエンドでも使えるようになる。
------------------------------------------------------------------------------------------------
- `process.env`オブジェクト: `process.env`は、Node.jsの`process`オブジェクトのプロパティであり、アプリケー
ションの実行時環境におけるすべての環境変数へのアクセスを提供します。
- 環境変数へのアクセス: `process.env`オブジェクトは、キーと値のペアで構成され、キーを指定して対応する値にアクセ
スできます。例えば、`process.env.MY_VARIABLE`のようにして環境変数`MY_VARIABLE`の値にアクセスできます。
- 環境変数の設定: Node.jsアプリケーションを実行する際に、コマンドラインや設定ファイルから環境変数を設定することが
できます。これにより、アプリケーションの動作を異なる環境に合わせて調整することができます。
- 環境ごとの設定: 開発環境、テスト環境、本番環境など、異なる環境でアプリケーションを実行する際に、`process.env`
を使用して環境ごとの設定を適用することが一般的です。
- デフォルト値の設定: `process.env`から環境変数の値を取得する際、該当する環境変数が設定されていない場合にデフォ
ルト値を提供することも可能です。これにより、アプリケーションが正しく動作するための設定を確保できます。
- 環境変数は、セキュリティ情報や設定値など、アプリケーションの動作に影響を与える重要な情報を外部から設定する手段と
して利用されます。`process.env`を使用することで、アプリケーションの動作を簡単にカスタマイズできるため、柔軟な設定
管理が可能です。
------------------------------------------------------------------------------------------------
- `process.env`はNode.jsで提供されるグローバルオブジェクトで、環境変数を管理します。
- `.env.local` ファイル内の変数はNext.jsが起動する際に`process.env`に格納されます。
- この`process.env`を通してサーバーサイドのコードで環境変数にアクセス可能。
------------------------------------------------------------------------------------------------
- APIのエンドポイントなどのURLはフロントエンドからアクセス可能な場合が多いです。このような情報を環境変数として設定
したい場合、`NEXT_PUBLIC_`接頭辞を使用します。
- 例: `.env.local`に`NEXT_PUBLIC_API_URL=https://api.example.com`と書くと、この環境変数はブラウザ側の、
JavaScriptからも`process.env.NEXT_PUBLIC_API_URL`としてアクセスできます。
- `axios`でAPIを呼び出す際にこの環境変数を使うことで、APIのエンドポイントを柔軟に管理できます。
*/
