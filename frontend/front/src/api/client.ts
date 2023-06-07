import axios, { AxiosInstance } from 'axios'; // eslint-disable-line import/named
import applyCaseMiddleware from 'axios-case-converter';

// applyCaseMiddleware:
// axiosで受け取ったレスポンスの値をスネークケース→キャメルケースに変換
// または送信するリクエストの値をキャメルケース→スネークケースに変換してくれるライブラリ

// 1
const options = {
  ignoreHeaders: true,
};

// 2
const client: AxiosInstance = applyCaseMiddleware(
  axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 5000,
  }),
  options
);

export default client;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
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
*/
