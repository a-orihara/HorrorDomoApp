import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../../src/components/atoms/Input';

describe('Input', () => {
  test('input（入力フィールド）の存在', () => {
    render(<Input className='test-input' />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  test('プレースホルダの表示', () => {
    render(<Input placeholder='Test Placeholder' />);
    // 1
    const inputElement = screen.getByPlaceholderText('Test Placeholder');
    // 2
    expect(inputElement).toBeInTheDocument();
  });

  test('指定したクラスを持つ', () => {
    render(<Input className='test-input' />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('test-input');
  });

  test('入力された値が正しく表示される', async () => {
    render(<Input placeholder='Test Placeholder' />);
    const inputElement = screen.getByPlaceholderText('Test Placeholder');
    // 3
    await userEvent.type(inputElement, 'test value');
    expect(inputElement).toHaveValue('test value');
  });
});

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
getByPlaceholderText
特定の引数の文字列をプレースホルダーテキストに持つ要素を取得する。
指定されたプレースホルダーテキストを持つ要素がDOM内に存在することを確認できる。

================================================================================================
2
toBeInTheDocument
Jestのマッチャ関数。要素がDOM内に存在するかどうかをテストする。
要素の表示や非表示、存在の確認など、DOM内での要素の状態をテストする際に役立ちます。

================================================================================================
3
### `await userEvent.type` の仕組み
- ユーザーのタイピングをシミュレートする**：userEvent.type(element, 'text')` は、ユーザが指定された`element`
に文字列 `'text'` を入力するのをシミュレートします。このメソッドは、ユーザが各キーを押して指定されたテキストを入力
するのを模倣したキーボードイベントを生成します。これには、文字列の各文字に対する keyDown、keyPress、input、keyUp
イベントが含まれます。
- 非同期操作**： このtypeメソッドは非同期でプロミスを返します。これは、入力にタイプすることで、フォームのバリデー
ション、オートコンプリート、入力に基づくデータの取得など、Webアプリケーションの様々な副作用や非同期操作がトリガーさ
れる可能性があるためです。await` を使うことで、入力のシミュレーションが完了するのをテストが確実に待つことができます。
- **テストでの使用**： テストのコンテキストでは、`await userEvent.type(inputElement, 'test value')` は、
ユーザが `inputElement` に `'test value'` と入力するのをシミュレートするために使用されます。これは、入力値の検
証、検索操作のトリガー、入力条件に基づく送信ボタンの有効化/無効化など、コンポーネントがユーザー入力にどのように反応
するかをテストする場合に特に便利です。
*/
