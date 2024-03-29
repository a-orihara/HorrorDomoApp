import Cookies from 'js-cookie';
import { client } from '../../src/api/client';
import { getUserById, updateUser, userDelete, userIndex } from '../../src/api/user';

// 1
// 2 clientとCookiesのモジュール全体をモック化。モック関数は戻り値を指定しないとundefined。
jest.mock('../../src/api/client');
jest.mock('js-cookie');
// グローバルスコープで定義。必要であればモックレスポンスのデータをリセットする。
let mockResponse = { data: {} };

// 8 すべてのテストに対応するグローバル設定
beforeEach(() => {
  (client.get as jest.Mock).mockReset().mockResolvedValue(mockResponse);
  // 3 テストのたびにモックをリセット
  (client.delete as jest.Mock).mockReset().mockResolvedValue(mockResponse);
  (client.put as jest.Mock).mockReset().mockResolvedValue(mockResponse);
  (Cookies.get as jest.Mock).mockReset();
  // 4 すべてのテストに共通のモッキング:元々の使い方:Cookies.get('_access_token')
  (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
  // 5 mockResponseのデータをリセット
  mockResponse = { data: {} };
});

describe('updateUser関数のテスト', () => {
  // テストで共通の変数を定義
  const formData = { name: 'test' };

  it('client.putが正しいパスで呼ばれる', async () => {
    // このupdateUser内のclient.putの戻り値は、{ data: {} }
    await updateUser(formData);
    // 4.1 await updateUser(formData)に対するテスト
    expect(client.put).toHaveBeenCalledWith('/auth', formData, expect.anything());
  });
  it('client.putが正しいヘッダーで呼ばれる', async () => {
    await updateUser(formData);
    expect(client.put).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
      headers: {
        'access-token': 'mock__access_token',
        'client': 'mock__client',
        'uid': 'mock__uid',
      },
    });
  });
  it('updateUserの戻り値がclient.putのモックから返された値と一致しているか確認', async () => {
    const result = await updateUser(formData);
    expect(result).toEqual(mockResponse);
  });
});

describe('userDelete関数のテスト', () => {
  // 7 テストで共通の変数を定義
  const testUserId = 1;

  it('client.deleteが正しいパスで呼ばれる', async () => {
    // 6
    await userDelete(testUserId);
    // userDeleteの処理結果に対して、client.deleteが正しいパスで呼ばれたかどうかを検証
    expect(client.delete).toHaveBeenCalledWith(
      `/admin/users/${testUserId}`,
      // パスだけを検証するため、ヘッダーは何でも良いとする
      expect.anything()
    );
  });

  it('client.deleteが正しいヘッダーで呼ばれる', async () => {
    await userDelete(testUserId);
    expect(client.delete).toHaveBeenCalledWith(
      expect.anything(), // ここではヘッダーだけを確認するため、パスは何でも良い
      {
        headers: {
          'access-token': 'mock__access_token',
          client: 'mock__client',
          uid: 'mock__uid',
        },
      }
    );
  });

  it('userDeleteの戻り値がclient.deleteのモックから返された値と一致しているか確認', async () => {
    const result = await userDelete(testUserId);
    // userDeleteの戻り値がclient.deleteのモックから返された値と一致しているか確認
    expect(result).toEqual(mockResponse);
  });
});

describe('userIndex関数のテスト', () => {
  const page = 0;
  const itemsPerPage = 5;

  it('client.getが正しいパスとパラメータで呼ばれる', async () => {
    await userIndex(page, itemsPerPage);
    expect(client.get).toHaveBeenCalledWith(
      '/users',
      // 9
      expect.objectContaining({
        params: {
          page: page + 1,
          per_page: itemsPerPage,
        },
      })
    );
  });

  it('client.getが正しいヘッダーで呼ばれる', async () => {
    await userIndex(page, itemsPerPage);
    expect(client.get).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: {
          'access-token': 'mock__access_token',
          'client': 'mock__client',
          'uid': 'mock__uid',
        },
      })
    );
  });

  it('userIndexの戻り値がclient.getのモックから返された値と一致しているか確認', async () => {
    const result = await userIndex(page, itemsPerPage);
    expect(result).toEqual(mockResponse);
  });
});

describe('getUserById関数のテスト', () => {
  const testUserId = 1;

  it('client.getが正しいパスで呼ばれる', async () => {
    await getUserById(testUserId);
    expect(client.get).toHaveBeenCalledWith(`/users/${testUserId}`, expect.anything());
  });

  it('client.getが正しいヘッダーで呼ばれる', async () => {
    await getUserById(testUserId);
    expect(client.get).toHaveBeenCalledWith(expect.anything(), {
      headers: {
        'access-token': 'mock__access_token',
        'client': 'mock__client',
        'uid': 'mock__uid',
      },
    });
  });

  it('getUserByIdの戻り値がclient.getのモックから返された値と一致しているか確認', async () => {
    const result = await getUserById(testUserId);
    expect(result).toEqual(mockResponse);
  });
});

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
このテストでjest.spyOnを使わない理由
jest.spyOn`は特定のオブジェクトのメソッドをスパイし、その振る舞いを記録するための機能を持つ。これにより、そのメソ
ッドがどのように呼び出され、何を返したかなどを詳細に調査することができる。
さらに、`jest.spyOn`はオリジナルの実装を保持したままスパイするため、メソッドの実行結果をテストする際に役立つ。
一方で、今回の`api/user.test.ts`においては、`clientModule.default.delete`メソッドの呼び出しをモック（つま
り、実際の処理を行わずにテストのためのダミーの振る舞いをする）している。つまり、メソッドの実行結果を調査する必要がな
く、ただメソッドが期待した引数で呼び出されるかどうかだけを確認したい場合である。
------------------------------------------------------------------------------------------------
`api/user.test.ts`でのテストの目的は、関数`userDelete`が正しく動作することを保証することである。
具体的には、`client.delete`メソッドが期待通りの引数（正しいURLとヘッダー）で呼び出されるかどうかを確認する。
これは、APIのエンドポイントとヘッダーが正しく設定されていれば、後続の処理（具体的なデータの取得や操作）はaxiosライ
ブラリとサーバー側の実装に依存するためである。メソッドがどのように呼び出され、何を返したかを詳細に調査する必要がない
と判断したのは、`userDelete`関数自体の内部ロジックがシンプルであるからである。関数内部で複雑な処理を行っている場
合や、戻り値がその後の処理に大きく影響する場合には、関数の戻り値をテストすることが重要になる。しかし、この
`userDelete`関数は単にaxiosの`delete`メソッドを呼び出しているだけで、その結果は関数の外部で処理される。
したがって、関数が正しい引数で`delete`メソッドを呼び出すかどうかを確認することが重要となる。

================================================================================================
2
モジュールからエクスポートされているもののみモック化
------------------------------------------------------------------------------------------------
jest.mock('../../src/api/client');で、api/clientをモック化する理由。
モック化する理由は、実際のAPIへのリクエストを行わずにテストを実行するためです。
テスト中に実際のAPIへリクエストを行うと、ネットワークの問題やAPIサーバの問題でテストが失敗する可能性があります。そ
のため、テスト中はAPIクライアントをモック化して、APIへのリクエストをシミュレートします。モック化すると、実際のリク
エストを送信せずに、期待されるレスポンスを返すことができます。
また、モック化された関数がどのように呼び出されたか（どの引数で、何回呼び出されたかなど）を確認することができます。

================================================================================================
3
. client.delete as jest.Mockでモック化しているのはなぜ？
jest.mock('../../src/api/client')により、全体のclientモジュールがモック化されていますが、ここでは
client.deleteメソッドに対してのみモック動作を制御したいため、client.deleteを特定してモックリセットしています。
具体的には次のような理由からです。
jest.mockによるモック化は、指定したモジュール全体（この場合はclient）をモック化します。これにより、モジュール内の
すべての関数がモック関数に置き換えられ、テスト中にそれらの関数が呼び出されても実際の処理は実行されません。モック関数
のデフォルトの戻り値はundefined。
一方、(client.delete as jest.Mock).mockReset()はモック化したclient.delete関数の呼び出し履歴や設定をリセッ
トします。これにより、テストケース間での影響を避け、各テストケースを独立に実行できます。
つまり、(client.delete as jest.Mock).mockReset()は特定のモック関数（この場合はclient.delete）の状態をリセ
ットするために使用されています。

================================================================================================
4
Cookies.get` に対して独自の実装を提供しています。この場合、関数は入力されたキーに基づいたモック値を返します。
jest.mock('js-cookie')` は `js-cookie` モジュールのモックを作成しますが、その関数の実装を指定するまではしま
せん。
------------------------------------------------------------------------------------------------
(Cookies.get as jest.Mock)
jest.mock('js-cookie')はモジュール全体をモック化しますが、Cookies.get as jest.Mockはそのモック化されたget
関数を特定の型（この場合はjest.Mock）として扱います。as jest.Mockがない場合、TypeScriptはgetがモック関数であ
ることを認識できず、モック関数特有のメソッド（例えばmockImplementation）を使用することができません。
------------------------------------------------------------------------------------------------
mockImplementation
Jestのメソッドであり、モック関数に具体的な実装を提供するために使用されます。
mockImplementationを使用することで、モック関数が特定の結果や動作を返すように設定することができます。これは、テス
トケースで特定の条件をシミュレートしたり、テスト対象のコードが期待どおりに動作するかを検証する際に役立ちます。

================================================================================================
4.1
. `expect.anything()` について:
- このメソッドは、Jestのマッチャー（比較処理）の一つです。
- 期待される値が何であれ（`null` や `undefined` を除く）マッチするとされます。
- このテストでは、`client.put`メソッドが正しいパスとフォームデータで呼び出されることが主な関心事です。第三引数（
オプション、ヘッダーなど）についてはこのテストでは何でも良いとしています。
- `expect.anything()`を使うことで、第三引数が何であれテストは通過するようになっています。
- Jestのマッチャーを使って、特定の引数に柔軟性を持たせることができます。このテストケースでは、第一引数と第二引数に
厳格な期待値が設定されていますが、第三引数については柔軟に設定されているため、`expect.anything()` が用いられてい
ます。

================================================================================================
5
const mockResponse = { data: {} };
APIからのレスポンスを模倣するオブジェクトを作成しています。ここでは、実際のデータは必要ないため、dataフィールドは
空オブジェクトとしています。このmockResponseは、モック化したclient.deleteメソッドが返す値として使われます。
data`というキーは、APIではレスポンスのメインペイロードを送り返すのによく使われます。
================================================================================================
6
await userDelete(testUserId);
userDelete関数の実行結果は変数に取得せず、ただ関数が終了するのを待っています（この関数が非同期関数であるため。
これは、テストの目的が「client.deleteが期待したパスとヘッダーで呼ばれるかどうか」であり、userDelete関数の戻り値
には関心がないためです。戻り値はどこにも代入されず、単に破棄されます。

================================================================================================
7
以前の処理
let mockResponse: { data: object };
let testUserId: number;
------------------------------------------------------------------------------------------------
let を使用する理由は、変数 mockResponse が beforeEach ブロック内で再代入されるためです。各テスト実行前に
mockResponse は新しいオブジェクト { data: {} } に再代入されます。一方、 const は一度定義すると再代入できない
ため、このケースでは使用できません。testUserIdも同じ。

================================================================================================
8
`beforeEach`は、Jestの関数で、それぞれのテストケース（`it`や`test`のブロック）が実行される前に実行されます。
テスト間での副作用を防ぐ: 各テストが互いに独立して動作することを保証するために、各テスト前に一部の設定をリセットした
り初期化したりします。
テストの準備を行う: 一部のテストが必要とする特定の状態を設定するために使います。
------------------------------------------------------------------------------------------------
上記のコードにおける `beforeEach` の挙動は次のとおり。
. `client.delete` と `Cookies.get` のモックをリセットします。これにより、テスト間でモックの呼び出し状態が共
有されることを防ぎます。
. `Cookies.get` メソッドのモックを設定します。これにより、各テストで `Cookies.get` が呼び出されるたびに、渡さ
れたキーに対して `mock_` が付いた文字列を返します。
. `mockResponse` に空のオブジェクトを設定し、それを `client.delete` の戻り値として設定します。これにより、各
テストで `client.delete` が呼び出されるたびに、指定した `mockResponse` が返されます。
. テストで使用する `testUserId` を `1` に設定します。これにより、各テストで同一のユーザーIDを用いることができま
す。

================================================================================================
9
expect.objectContaining
Jestのマッチャーの一つで、オブジェクトが期待されるプロパティを含んでいるか（部分一致）をチェックします。
この関数は、オブジェクトを引数に取ります。この引数は期待されるプロパティとその値のセットを表します。
paramsというプロパティを持ち、その値が{ page: page + 1, per_page: itemsPerPage }であることを期待している。
*/
