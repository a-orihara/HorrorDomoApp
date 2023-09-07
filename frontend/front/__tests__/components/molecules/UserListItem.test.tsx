import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserListItem from '../../../src/components/molecules/listItem/UserListItem';
import { useAuthContext } from '../../../src/contexts/AuthContext';
import { useDeleteUser } from '../../../src/hooks/user/useDeleteUser';
// 1 この時点でAuthContext内の全ての関数をモック化
jest.mock('../../../src/contexts/AuthContext');
jest.mock('../../../src/hooks/user/useDeleteUser');

// 2 既にモック化されたuseAuthContextを代入
const mockUseAuthContext = useAuthContext as jest.Mock;
const mockUseDeleteUser = useDeleteUser as jest.Mock;

// テストデータ
const mockUser = {
  id: 1,
  uid: '1',
  provider: '',
  allowPasswordChange: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Test User',
  email: 'test@user.com',
  admin: false,
  profile: '',
  avatarUrl: '',
};

describe('UserListItem', () => {
  // 3
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 4
  it('listがレンダリングされる', () => {
    mockUseAuthContext.mockReturnValue({
      currentUser: { id: 2, name: 'Other User', email: 'other@user.com', admin: false },
    });
    // handleDeleteUserという関数を返す
    mockUseDeleteUser.mockReturnValue({ handleDeleteUser: jest.fn() });
    render(<UserListItem user={mockUser} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  // 4
  it('ユーザーの名前が表示される', () => {
    // 5
    mockUseAuthContext.mockReturnValue({
      currentUser: { id: 2, name: 'Other User', email: 'other@user.com', admin: false },
    });
    mockUseDeleteUser.mockReturnValue({ handleDeleteUser: jest.fn() });
    render(<UserListItem user={mockUser} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('Linkコンポーネントのhrefが正しく設定されている', () => {
    mockUseAuthContext.mockReturnValue({
      currentUser: { id: 2, name: 'Other User', email: 'other@user.com', admin: false },
    });
    mockUseDeleteUser.mockReturnValue({ handleDeleteUser: jest.fn() });
    render(<UserListItem user={mockUser} />);
    // 7
    expect(screen.getByText('Test User').closest('a')).toHaveAttribute('href', '/users/1');
  });

  // 「管理者としてのUIの変化」をテスト
  it('現在のユーザーが管理者で、別のユーザーを表示しているとき、deleteリンクが表示される', () => {
    mockUseAuthContext.mockReturnValue({
      currentUser: { id: 2, name: 'Other User', email: 'other@user.com', admin: true },
    });
    const handleDeleteUser = jest.fn();
    mockUseDeleteUser.mockReturnValue({ handleDeleteUser });
    render(<UserListItem user={mockUser} />);
    // 指定されたテキスト(delete)を持つ要素がレンダリングされているかどうかを確認する
    expect(screen.getByText('delete')).toBeInTheDocument();
  });

  it('deleteリンクをクリックすると、handleDeleteUserが呼び出される', async () => {
    mockUseAuthContext.mockReturnValue({
      currentUser: { id: 2, name: 'Other User', email: 'other@user.com', admin: true },
    });
    const handleDeleteUser = jest.fn();
    mockUseDeleteUser.mockReturnValue({ handleDeleteUser });
    render(<UserListItem user={mockUser} />);
    // 指定されたテキスト(delete)を持つ要素をクリックする
    await userEvent.click(screen.getByText('delete'));
    // 8
    expect(handleDeleteUser).toHaveBeenCalledWith(1);
  });
});

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
jest.mock('../../../src/contexts/AuthContext');
jest.mockの引数はモジュールのパスです。この引数に指定したパスのモジュールが、モック化されたモジュールに置き換えら
れます。引数には相対パスや絶対パスを指定することができます。
テスト実行時にAuthContextモジュールの代わりに、自動的にモックモジュールが使用されます。
テスト対象のモジュールが他のモジュールをインポートしている場合、それらのモジュールもモック化する必要があります。
------------------------------------------------------------------------------------------------
AuthContext` のモジュールのモックバージョンを作成しています。つまり、`useAuthContext` や `AuthProvider` を
含む `AuthContext` からエクスポートされた関数は、テスト中にモック関数に置き換えられる。
実装が与えられなければ、モック関数は実行時にデフォルトundefinedを返します。
また、jest.requireActual関数の使用で、指定した関数だけ本来の実装内容の関数を使用することもできる。
------------------------------------------------------------------------------------------------
mockとは、一言でいうとテストに必要な部品の値を擬似的に設定するもの、模型のようなもの。
これにより、テストをより制御しやすくし、他のモジュールとの依存関係を切り離して単体でテストすることができます。
================================================================================================
2
const mockUseAuthContext = useAuthContext as jest.Mock;
TypeScriptの型アサーションです。`useAuthContext`がJestのモック関数であると仮定。
これはTypeScript が `useAuthContext` に対して Jest のモック関数メソッド (`mockReturnValue()` や
`mockImplementation()` など) を呼び出せるようにするため、純粋に TypeScript のために書いています。
この行以降、`mockUseAuthContext` は `useAuthContext` と同じ関数を指す変数ですが、TypeScript はこれがJest
のモック関数であることを理解するようになります。これで `mockUseAuthContext` で Jest のモック関数のメソッドを呼
び出すことができるようになります。
------------------------------------------------------------------------------------------------
asの後にタイプアサーションが続きます。これは、左側の値（この場合は `getAuthenticatedUser` ）を右側で指定された
型（この場合は `jest.Mock` ）とみなすように TypeScript に指示します。
------------------------------------------------------------------------------------------------
jest.Mock` はJestが提供するモック関数を表す型です。この型は、関数の振る舞いを制御したり、関数がどのように呼び出さ
れたかを問い合わせることができるプロパティを持っています。特定の値やオブジェクト、関数ではない。
================================================================================================
3
afterEach
Jestが提供する関数です。これは、特定のファイル内の各テストの後に何らかのコードを実行するために使用されます。
これにより、各テストケースが独立して実行されることが保証されます。
------------------------------------------------------------------------------------------------
jest.clearAllMocks()
Jestが提供する別の関数です。この関数は、モック関数（`jest.fn()`で作成した関数や、`jest.mock()`で自動的にモック
化した関数）に格納されている情報をすべてリセットします。この関数の主な目的は、戻り値や実装をクリアし、モックを元の状
態（未定義戻り値）に戻すことです。
------------------------------------------------------------------------------------------------
テストを実行するたびに、すべてのモックをリセットするようJestに指示するコードブロックです。
一般的にユニットテストでは、テストを分離するのが良い習慣です。これは、あるテストが次のテストの環境に影響を与えないよ
うにすることを意味します。各テストの後にすべてのモックをクリアすることで、あるテストのために行った設定が他のテストの
動作に誤って影響を与えないようにします。
例えば、モック関数があり、あるテストでその実装を変更した場合、クリアしない限り、次のテストでもその実装は変更されたま
まになってしまいます。これは、テストの順番が結果に影響するという、デバッグしにくいエラーにつながる可能性があります。
================================================================================================
4
UserListItem.tsxは、Linkの表示に条件分岐があるから、このテストや'ユーザーの名前が表示される'、'Linkコンポーネン
トのhrefが正しく設定されている'のテストでも、mockUseAuthContextとmockUseDeleteUserが必要。
------------------------------------------------------------------------------------------------
`currentUser` オブジェクトは `id`, `name`, `email`, `admin` フィールドのみを含む
これは、この特定のテストで `UserListItem` コンポーネントに必要なフィールドがこれらだけであるためです。モックデー
タはできるだけ小さくし、テストに必要なデータのみを含めるようにします。uid` や `createdAt` などの他のフィールドは
このテストでは使用しないので、含める必要はありません。
================================================================================================
5
mockReturnValue
jestモック関数によって返される値、返り値を設定する関数です。モック関数は、実際の関数の代わりに使用され、テスト中に
特定の値や振る舞いを返すことができます。
currentUserプロパティを持つオブジェクトを返しています。
================================================================================================
6
new Date()
JavaScriptの組み込みオブジェクトであり、現在の日時を表すオブジェクトを作成。
createdAt`はDateオブジェクトを想定しており、nullやundefinedではありません。もし空のままだと、TypeScriptは型
定義に違反するとしてエラーを投げるので、Dateオブジェクトを作成しています。
================================================================================================
7
closest
DOM要素（Elementオブジェクト）が提供するメソッド。Elementオブジェクトのインスタンス（つまり、実際の要素）に対し
て使用できます。
DOMツリー上で指定されたセレクタに最も近い親要素（祖先要素）を取得するためのメソッドです。一致する祖先がない場合は、
NULLを返します。
------------------------------------------------------------------------------------------------
React Testing Libraryのscreenオブジェクトは、テスト時に実際のDOM要素を操作するためにjsdomと呼ばれるライブラ
リを使用します。jsdomは、ブラウザ環境をシミュレートすることでDOM操作を可能にします。そのため、screen.getByText
で取得した要素に対してclosestメソッドを使用することができます。
------------------------------------------------------------------------------------------------
Next.jsでは、`Link`コンポーネントは、JavaScriptが有効な場合にクライアントサイドのナビゲーションを可能にする`a`
タグのラッパーに過ぎない。JavaScriptが無効な場合、ナビゲーションは `a` タグに戻ります。したがって、href属性は厳
密には`a`タグにあり、`Link`コンポーネント自体にあるわけではありません。そのため、このテストでは `a` タグの `href`
属性をチェックしています。
このため、toHaveAttribute('href', '/users/1')がaタグに適用されます。Linkコンポーネントはクライアントサイドの
ルーティングを処理しますが、レンダリングされたHTMLで最終的にhref属性を取得するのはaタグなのです。
したがって、この場合、aタグにtoHaveAttribute('href', '/users/1')を適用するのが正しいのです。
また、React Testing Libraryは、ユーザーが体験するような最終結果をテストすることを目的としており、この場合、
JavaScriptが実行された後の最終的なHTMLであるため、aタグを生成したLinkコンポーネントよりも、レンダリングされたaタ
グに関心があることに注意してください。
------------------------------------------------------------------------------------------------
toHaveAttribute
React Testing Libraryと組み合わせて使用するJest matcherで、特定のDOM要素に特定の値を持つ属性があるかどうかを
判定します。あなたのコードでは、`a`タグに `/users/1` という値を持つ `href` 属性があるかどうかをチェックするため
に使用されています。
================================================================================================
8
toHaveBeenCalledWith
Jestのメソッドで、モック関数が特定の引数で呼び出されたかどうかを保証する。ここでは、`toHaveBeenCalledWith(1)`
を使って `handleDeleteUser` 関数が `1` を引数として呼び出されたかどうかをテストしています。
================================================================================================
UserListItemコンポーネントが正しくレンダリングされ、ユーザーの名前が表示されること。
Linkコンポーネントのhref属性が正しく設定されていること。
現在のユーザーが管理者で、表示しているユーザーが別のユーザーであるとき、deleteリンクが表示されること。
deleteリンクをクリックすると、handleDeleteUser関数が適切なユーザーIDとともに呼び出されること。
useAuthContextとuseDeleteUserフックはモック化されており、これらが期待通りに呼び出されることが確認されています。
*/
