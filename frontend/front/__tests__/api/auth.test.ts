import Cookies from 'js-cookie';
import { getAuthenticatedUser, signIn, signOut, signUp } from '../../src/api/auth';
import { client } from '../../src/api/client';
import { SignInParams, SignUpParams } from '../../src/types/user';

// 1
jest.mock('../../src/api/client');
// 2
jest.mock('js-cookie');

describe('Auth API Tests', () => {
  // 7 各テストで共通の変数を定義
  let mockResponse: { data: object };
  // 3 すべてのテストの前にモックをリセット
  beforeEach(() => {
    // 9
    mockResponse = { data: {} };
    // 4 '../../src/api/client'内の各clientメソッドに対して
    (client.get as jest.Mock).mockReset().mockResolvedValue(mockResponse);
    // 10
    (client.post as jest.Mock).mockReset().mockResolvedValue(mockResponse);
    (client.delete as jest.Mock).mockReset().mockResolvedValue(mockResponse);
    // 5 6 すべてのテストに共通のモッキング:元々の使い方:Cookies.get('_access_token')
    (Cookies.get as jest.Mock).mockReset().mockImplementation((key: string) => `mock_${key}`);
  });

  describe('signUp関数のテスト', () => {
    // 8
    let params: SignUpParams;
    beforeEach(() => {
      // 11
      params = { name: 'test', email: 'test@example.com', password: 'password', passwordConfirmation: 'password', confirmSuccessUrl: "http://localhost:3001/signin" };
    });

    // 12.1
    it('client.postが正しいパスで呼ばれる', async () => {
      await signUp(params);
      // 12.2 signUp(params)に対してのテスト
      expect(client.post).toHaveBeenCalledWith('/auth', params);
    });

    // 13.1
    it('signUpの戻り値がclient.postのモックから返された値と一致しているか確認', async () => {
      const result = await signUp(params);
      // 13.2
      expect(result).toEqual(mockResponse);
    });
  });

  describe('signIn関数のテスト', () => {
    let params: SignInParams;

    beforeEach(() => {
      params = { email: 'test@example.com', password: 'password' };
    });

    it('client.postが正しいパスとパラメータで呼ばれる', async () => {
      await signIn(params);
      expect(client.post).toHaveBeenCalledWith('/auth/sign_in', params);
    });

    it('signInの戻り値がclient.postのモックから返された値と一致しているか確認', async () => {
      const result = await signIn(params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('signOut関数のテスト', () => {

    it('client.deleteが正しいパスとヘッダーで呼ばれる', async () => {
      await signOut();
      // 15
      expect(client.delete).toHaveBeenCalledWith('/auth/sign_out', {
        headers: {
          // `mock_${key}` は、Cookies.get が呼ばれたときに返す値を示しています。
          'access-token': 'mock__access_token',
          'client': 'mock__client',
          'uid': 'mock__uid',
        },
      });
    });

    it('signOutの戻り値がclient.deleteのモックから返された値と一致しているか確認', async () => {
      const result = await signOut();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAuthenticatedUser関数のテスト', () => {

    it('認証情報が存在する場合、client.getが正しいパスとヘッダーで呼ばれる', async () => {
      await getAuthenticatedUser();
      expect(client.get).toHaveBeenCalledWith('/authenticated_users', {
        headers: {
          'access-token': 'mock__access_token',
          'client': 'mock__client',
          'uid': 'mock__uid',
        },
      });
    });

    it('getAuthenticatedUserの戻り値がclient.getのモックから返された値と一致しているか確認', async () => {
      const result = await getAuthenticatedUser();
      expect(result).toEqual(mockResponse);
    });

    it('認証情報が存在しない場合、client.getは呼ばれない', async () => {
      // undefinedを返すので、(key: string)の引数はいらない
      (Cookies.get as jest.Mock).mockImplementation(() => undefined);
      await getAuthenticatedUser();
      expect(client.get).not.toHaveBeenCalled();
    });
  });
});

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- `jest.mock`は、指定されたモジュールのモックを作成します。
- モックが作成されたら、そのモジュール内の関数はJestによって置き換えられ、テストで自由に操作できます。
#### jest.mock('../../src/api/client');
- `../../src/api/client`モジュールをモック化します。
- その後、このモジュール内の関数（ここでは`client.get`, `client.post`など）はモック関数になります。
- モジュールからエクスポートされているもののみモック化

================================================================================================
2
#### jest.mock('js-cookie');
- `js-cookie`モジュールをモック化します。
- その後、このモジュール内の関数（ここでは`Cookies.get`）もモック関数になります。
- モジュールからエクスポートされているもののみモック化


================================================================================================
3
#### beforeEachでのモックリセット
- `mockReset()`で各テストケース前にモックをリセットしています。
- `mockImplementation()`で特定の戻り値を設定しています。

================================================================================================
4
. `(client.get as jest.Mock).mockReset();`
- `client.get` 関数のモックをリセットし、以前にモックで定義した挙動や呼び出し履歴をクリアにする。
- 次のテストケースで、新しい挙動を設定する前に既存のモック状態をリセットする目的。

================================================================================================
5
. `(Cookies.get as jest.Mock).mockReset();`
- テストケース間で影響を与えないように、`Cookies.get` 関数のモックをリセットし、以前の挙動や呼び出し履歴をクリア。

================================================================================================
6
- アプリケーションのコンテキストでは、/src/api/auth.tsの実際の関数`signOut` と `getAuthenticatedUser` の
両方の関数が `Cookies.get` を利用して、認証トークンとクッキーに格納されたその他の情報を取得します。
`Cookies.get` が予測可能な値（この場合は `mock_${key}`）を返すようにモックすることで、実際の関数`signOut` と
`getAuthenticatedUser` をテストの中で使用する際、テストが予測可能に実行され、制御された条件下でこれらの関数の動
作を検証できるようになります。`signOut` と `getAuthenticatedUser` が正しく動作するためには `Cookies.get` 
を使用するので、このモッキングは確かに有効です。
------------------------------------------------------------------------------------------------
. `(Cookies.get as jest.Mock).mockImplementation((key: string) => \`mock_${key}\`);`
- mockImplementationは、Jestのモッキング機能の一部で、モック関数の実装をカスタマイズするために使用される。これ
を利用することで、テスト中に特定の関数が呼び出された場合の振る舞いを模擬的に定義できる。関数が返す値や、受け取る引数
に基づいた処理を模擬的に設定することが可能になる。
------------------------------------------------------------------------------------------------
. **(Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);の詳細解説**
- このコード行は、`Cookies.get`メソッドをモック化し、その挙動をカスタマイズしている。
- `(Cookies.get as jest.Mock)`は、`Cookies.get`関数がJestのモック関数として扱われるように型アサーションを使
用している。
- `.mockImplementation((key: string) => \`mock_${key}\`)`は、`Cookies.get`が呼び出された時に、引数とし
て渡された`key`を使って`mock_${key}`という文字列を返すように実装を上書きしている。
- この挙動により、テスト中に`Cookies.get`が呼ばれた際には、実際のCookieの値を参照する代わりに、予測可能で一貫性
のある値を返すことができる。これは、外部の状態に依存しないテストを実現するために重要。
- 例えば、`Cookies.get('_access_token')`が呼ばれた場合、`mock__access_token`という文字列が返される。これに
より、認証トークンの具体的な値に依存することなく、テストを実行することが可能になる。

================================================================================================
7
. let mockResponse: { data: object };
- `mockResponse`はモックデータを格納するための変数です。
- `{ data: object }`の形で型を指定しているので、`data`キーを持ち、その値がオブジェクトであることを示しています。
- Jestのモック機能を使ってAPIの戻り値を模倣（モック）する際に使用されます。

================================================================================================
8
. let params: SignUpParams;
- `params`変数は、APIに送信するデータ（パラメータ）を格納するための変数です。
- `SignUpParams`型を使用しているため、この変数は`SignUpParams`で定義された型に従ったデータを持つ必要がある。
- この型指定により、TypeScriptが型の不整合をコンパイル時に検出できます。

================================================================================================
9
. mockResponse = { data: {} };
- こちらも`mockResponse`の初期化の一部ですが、`data`キーに空のオブジェクト`{}`を設定しています。
- これはJestのモック機能で、APIからの戻り値が`data`というキーを持つオブジェクトである場合に、その戻り値を模倣（
モック）するために使用されます。
- 実際のテストで、この`mockResponse`は`.mockResolvedValue(mockResponse)`で`client.post`や`client.get`
などのAxiosメソッドに適用されます。

================================================================================================
10
. `(client.post as jest.Mock).mockResolvedValue(mockResponse);`
- 意図: `client.post`メソッドが呼ばれたときに`mockResponse`を返すようにモック設定する。
- 解説: Jestのモック機能を用いて`client.post`メソッドが呼び出された際に返す値(`mockResponse`)を設定。これに
よって実際のAPIを叩かずにテストが行える。

================================================================================================
11
. `params = { name: 'test', email: 'test@example.com', password: 'password', passwordConfirmation: 'password' };`
- 意図: サインアップに必要なテストデータをオブジェクトとしてまとめる。
- 解説: `params`変数にテストで使用するダミーのユーザー情報を格納。これを`signUp`関数に渡して動作をテスト。

================================================================================================
12.1
. **テストの `it` ブロック内での操作の順番について:**.
await signUp(params);
expect(client.post).toHaveBeenCalledWith('/auth', params);
------------------------------------------------------------------------------------------------
Jest  (あるいはほとんどのテストフレームワーク) の `it` ブロックの構造は、次のようなパターンに従っています：
- テスト対象の関数を実行する:** ここで、テスト対象の関数を引数とともに呼び出します。
- 期待される結果を保証する:** 実行後、期待される動作や結果を保証します。
-  この順序により、テストは、最初にテスト対象のシナリオを設定し実行し、次にシナリオが期待通りに実行されたことを検証
します

================================================================================================
12.2
. **`toHaveBeenCalledWith`の解説**
- `toHaveBeenCalledWith` は Jestにおけるマッチャーの一つで、特定の関数が期待される引数で呼び出されたかどうかを
検証するために使用。このマッチャーを使用することで、テスト中にモック関数（この場合は `client.post`）が特定のパラ
メータで正確に一度呼び出されたことを確認できます。正確に `'/auth'` というエンドポイントと、`params` というオブ
ジェクトで呼び出されたことを検証します。
------------------------------------------------------------------------------------------------
. `expect(client.post).toHaveBeenCalledWith('/auth', params);`
- 意図: `signUp`関数内で`client.post`が期待通りの引数で呼び出されたかを確認。
- 解説: Jestのマッチャーを使用して`client.post`が`'/auth'`というパスと`params`という引数で呼び出されたか確認。
これにより、関数が正確にAPIエンドポイントにデータを送っているかをテスト。

================================================================================================
13.1
このテストは、`signUp` 関数が `client.post` メソッドを呼び出した際に、モックから返されたレスポンス（`mockResponse`）
が実際の関数の戻り値として受け取れるかを検証します。これにより、2つの主な目的が達成されます：
- **API呼び出しの結果のハンドリングが正しいことを検証する：** このテストでは、`signUp` 関数が内部で使用する
`client.post` メソッドが期待どおりのレスポンスを返し、それを関数の戻り値として適切に扱えることを確認します。これ
により、APIからのレスポンスがアプリケーションによって正しく処理されることを保証します。
- **関数の副作用が期待通りに発生することを検証する：** 特に非同期処理（例えばAPIコール）を伴う関数では、その関数が
想定通りの副作用（この場合はHTTPリクエストの送信）を引き起こし、期待される結果を返すことが非常に重要です。このテスト
は、そのような副作用が正確に発生し、適切なレスポンスデータが得られることを確認するために行われます。
- このテストの意図は、関数の信頼性と、外部システムとのインテグレーションポイントの正確性が保証されます。

================================================================================================
13.2
- `mockResponse`の使用理由:
- 単体テストでは、外部の依存関係（この場合はAPIサーバー）に依存しないようにするのが一般的です。
- `mockResponse`を使うことで、APIからの戻り値を模倣（モック）して、テストがその値に依存する動作を確認できます。
- `mockResponse`は、`client.post`または`client.get`などが正常に呼び出された場合に返すであろう値を模倣します。
- これにより、`signUp`や`signIn`等の関数が想定通りに動作しているか、実際にAPIを呼び出すことなく確認できます。
- `client.post`が呼び出されたら`mockResponse`を返すように設定しています。
- `signUp`の戻り値と`mockResponse`が一致するか確認しています。
- 空オブジェクトがAPIからの期待される正常なレスポンスであり、その後のコードの挙動に影響を与えない場合は、空オブジェ
クトでも問題ありません。
- 詳細なレスポンスを模倣する場合、APIから返ってくるであろう具体的なデータをmockResponseに設定することで、よりリア
ルなテストケースを作成できます。

================================================================================================
14
.`Cookies.get` モックとヘッダーの関連性
- `(Cookies.get as jest.Mock).mockImplementation((key: string) => \`mock_${key}\`);` のコードは、
`Cookies.get` が呼ばれたときに `"mock_"` をキーに追加した文字列を返します。
- 例えば, `Cookies.get('_access_token')` は通常 `_access_token` に格納されている実際のトークンを返します
が、このモックによって `mock__access_token` が返されます。
- このモックの値は `signOut` 関数内で `client.delete` の `headers` にセットされています。
- `Cookies.get` をモックして、`client.delete` が正しいヘッダーで呼ばれたかを確認しています。
.なぜこれが必要か
- クッキー（`Cookies.get` から取得）から正しい認証情報（`access-token`, `client`, `uid`）を取得して、それ
をヘッダーにセットする流れを模倣（モック）しています。
- 実際の動作をエミュレートすることで、`signOut` 関数が正確に動作するかテストしています。

================================================================================================
15
`expect(client.delete).toHaveBeenCalledWith`は`await signOut();`が内部で`client.delete`を呼び出す際
の引数をチェックしています。`await signOut();`自体の戻り値ではありません。
- Jestの`.toHaveBeenCalledWith`はモック関数が特定の引数で呼び出されたかどうかを確認するためのメソッドです。
- テストコード中で`await signOut();`が呼ばれると、内部で`client.delete`が呼ばれます。この`client.delete`の
引数が`expect(client.delete).toHaveBeenCalledWith`で確認されます。
このように、テストは`await signOut();`が`client.delete`をどのように呼び出すか（どの引数で呼び出すか）を確認し
ています。
*/
