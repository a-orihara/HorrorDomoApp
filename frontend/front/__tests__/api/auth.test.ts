import Cookies from 'js-cookie';
import { getAuthenticatedUser, signIn, signOut, signUp } from '../../src/api/auth';
import { client } from '../../src/api/client';
import { SignInParams, SignUpParams } from '../../src/types/user';

// 1
jest.mock('../../src/api/client');
// 2
jest.mock('js-cookie');

// 3 すべてのテストの前にモックをリセット
beforeEach(() => {
  // 4 '../../src/api/client'内の各clientメソッドに対して
  (client.get as jest.Mock).mockReset();
  (client.post as jest.Mock).mockReset();
  (client.delete as jest.Mock).mockReset();
  // 5
  (Cookies.get as jest.Mock).mockReset();
  // 6 すべてのテストに共通のモッキング:元々の使い方:Cookies.get('_access_token')
  (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
});

describe('signUp関数のテスト', () => {
  // 7 各テストで共通の変数を定義
  let mockResponse: { data: object };
  // 8
  let params: SignUpParams;

  beforeEach(() => {
    // 9 mockResponseに空オブジェクトをセット
    mockResponse = { data: {} };
    // 10 client.putの戻り値に空オブジェクトをセット
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    // 11
    params = { name: 'test', email: 'test@example.com', password: 'password', passwordConfirmation: 'password' };
  });

  it('client.postが正しいパスで呼ばれる', async () => {
    await signUp(params);
    // 12
    expect(client.post).toHaveBeenCalledWith('/auth', params);
  });

  it('signUpの戻り値がclient.postのモックから返された値と一致しているか確認', async () => {
    const result = await signUp(params);
    // 13
    expect(result).toEqual(mockResponse);
  });
});

describe('signIn関数のテスト', () => {
  // 各テストで共通の変数を定義
  let mockResponse: { data: object };
  let params: SignInParams;

  beforeEach(() => {
    mockResponse = { data: {} };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
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
  // 各テストで共通の変数を定義
  let mockResponse: { data: object };

  beforeEach(() => {
    mockResponse = { data: {} };
    (client.delete as jest.Mock).mockResolvedValue(mockResponse);
    // 14
    (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
  });

  it('client.deleteが正しいパスとヘッダーで呼ばれる', async () => {
    await signOut();
    // 15
    expect(client.delete).toHaveBeenCalledWith('/auth/sign_out', {
      headers: {
        // `mock_${key}` は、Cookies.get が呼ばれたときに返す値を示しています。
        'access-token': 'mock__access_token',
        client: 'mock__client',
        uid: 'mock__uid',
      },
    });
  });

  it('signOutの戻り値がclient.deleteのモックから返された値と一致しているか確認', async () => {
    const result = await signOut();
    expect(result).toEqual(mockResponse);
  });
});

describe('getAuthenticatedUser関数のテスト', () => {
  let mockResponse: { data: object };

  beforeEach(() => {
    mockResponse = { data: {} };
    (client.get as jest.Mock).mockResolvedValue(mockResponse);
    (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
  });

  it('認証情報が存在する場合、client.getが正しいパスとヘッダーで呼ばれる', async () => {
    await getAuthenticatedUser();
    expect(client.get).toHaveBeenCalledWith('/authenticated_users', {
      headers: {
        'access-token': 'mock__access_token',
        client: 'mock__client',
        uid: 'mock__uid',
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

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- `jest.mock`は、指定されたモジュールのモックを作成します。
- モックが作成されたら、そのモジュール内の関数はJestによって置き換えられ、テストで自由に操作できます。
#### jest.mock('../../src/api/client');
- `../../src/api/client`モジュールをモック化します。
- その後、このモジュール内の関数（ここでは`client.get`, `client.post`など）はモック関数になります。

================================================================================================
2
#### jest.mock('js-cookie');
- `js-cookie`モジュールをモック化します。
- その後、このモジュール内の関数（ここでは`Cookies.get`）もモック関数になります。

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
. `(Cookies.get as jest.Mock).mockImplementation((key: string) => \`mock_${key}\`);`
- `Cookies.get` 関数のモック挙動を新しく設定します。
- このモックが呼び出されたら、引数 `key` を使って `mock_${key}` 文字列を返す。
- これにより、実際に Cookie を読みに行かず、テストが制御できる状態にする。

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
12
. `expect(client.post).toHaveBeenCalledWith('/auth', params);`
- 意図: `signUp`関数内で`client.post`が期待通りの引数で呼び出されたかを確認。
- 解説: Jestのマッチャーを使用して`client.post`が`'/auth'`というパスと`params`という引数で呼び出されたか確認。
これにより、関数が正確にAPIエンドポイントにデータを送っているかをテスト。

================================================================================================
13
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
