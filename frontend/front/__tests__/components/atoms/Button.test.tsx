// frontend/front/__tests__/components/atoms/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../src/components/atoms/Button';

describe('Button', () => {
  test('buttonが存在すること', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
  // 1
  test('指定したテキストを持つこと', () => {
    // 3
    render(<Button>Click me</Button>);
    // 4
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    // 5
    expect(buttonElement).toBeInTheDocument();
  });

  test('クリックイベントに反応すること', async () => {
    // 2
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: 'Click me' });
    // 6
    await userEvent.click(buttonElement);
    // 7
    expect(mockClick).toHaveBeenCalled();
  });

  test('指定したクラスを持つ', () => {
    render(<Button className='test-button'>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toHaveClass('test-button');
  });
});

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
test
jestのtest関数。第一引数にテストの文章、第二引数にテストの内容を記述するアロー関数を渡します。
------------------------------------------------------------------------------------------------
ネイティブのHTMLの`button`要素ではなく、コンポーネントのテストなので、`Button`コンポーネントをテストします。
あなたの `Button` コンポーネントには、ネイティブの `button` 要素にはない追加機能やスタイリングが含まれています。
Button`コンポーネントをテストすることで、あなたのコンポーネントの特定の実装が期待通りに機能していることを確認するこ
とができます。
また、`Button`コンポーネントをテストすることで、（`onClick`ハンドラのような）プロップを基礎となる`button`要素に
正しく渡しているかどうかも検証できます。
この方法は、より柔軟で将来性のある方法です。もし後で `Button` コンポーネントにさらに機能やプロップを追加することに
なったとしても、すでにテスト戦略は出来上がっているはずです。
================================================================================================
2
jest.fn()はJestのモック関数を作成するための関数。関数の呼び出しや戻り値などを追跡することができます。
jest.fn()の戻り値は関数です。mockClickという名前の関数を生成。
------------------------------------------------------------------------------------------------
モック関数
テスト中に実際の関数の振る舞いを模倣するために使用される、仮の関数。
================================================================================================
3
render
React Testing Libraryのrender関数。テスト対象のコンポーネントをレンダリングします。これはきちんとレンダリング
されているか確認するテスト。
================================================================================================
4
screen
React Testing Libraryのscreenオブジェクト。テスト中にコンポーネントのレンダリング結果にアクセスする機能を提供。
screenオブジェクトは、DOM要素（実際のブラウザで動作している場合はDOMノード、Node.jsで動作している場合はjsdomノ
ード）を検索するための関数を提供します。
------------------------------------------------------------------------------------------------
getByRole
screenオブジェクトのgetByRole関数。第一引数に検索する要素のrole属性の値、第二引数に検索する要素のテキストを渡し
ます。
特定のDOM要素をRoleで取得する。
役割（role）が "button" である要素で、nameオプションを使用して、テキスト内容が正規表現 /click me/i と一致する
ボタン要素を検索。
------------------------------------------------------------------------------------------------
nameオプション
nameオプションで指定した文字列に一致した要素（この場合、button）を探す。
================================================================================================
5
expect
expectはJestの関数。テストの期待値を記述します。引数として変数や関数を取ることができます。
expect関数に続けてチェーンメソッド（.toBe()など）を使用して、期待される結果や条件を指定します。
------------------------------------------------------------------------------------------------
toBeInTheDocument
Jestのマッチャ関数の。テスト対象の要素がDOMに存在するかどうかをチェックするために使用されます。
================================================================================================
6
userEvent
React Testing Libraryの関数で、fireEventのラッパー関数。ユーザーが行う操作をシミュレートする。
基本fireEventよりこのuserEventを使用する。
------------------------------------------------------------------------------------------------
click
要素のクリックイベントをシミュレートするための関数
------------------------------------------------------------------------------------------------
fireEvent
React Testing Libraryのオブジェクトで、テスト中にイベントを発生させるための関数を提供します。
イベント（"click"、"change"、"input"など）を発生させる関数と、発生対象の要素を引数として受け取ります。
================================================================================================
7
toHaveBeenCalled
Jestのマッチャで、モック関数が呼び出されたかどうかをチェックします。モック関数が呼び出されていれば、アサーションは
成功（つまりテストが通る）となります。
*/