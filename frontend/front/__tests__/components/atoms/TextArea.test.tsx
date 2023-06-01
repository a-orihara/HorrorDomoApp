import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextArea from '../../../src/components/atoms/TextArea';

describe('TextArea', () => {
  test('textAreaがレンダリングされる', () => {
    render(<TextArea />);
    // 1
    const textAreaElement = screen.getByRole('textbox');
    expect(textAreaElement).toBeInTheDocument();
  });

  test('テキストエリアが指定したテキストを含む', async () => {
    render(<TextArea />);
    // HTMLTextAreaElementに型指定しないと、HTMLElement型になり、valueが存在しないというエラーが出る
    const textAreaElement: HTMLTextAreaElement = screen.getByRole('textbox');
    // 2
    await userEvent.type(textAreaElement, 'テストテキスト');
    expect(textAreaElement.value).toBe('テストテキスト');
  });

  test('指定したクラスを持つ', () => {
    render(<TextArea className='test-class' />);
    const textAreaElement = screen.getByRole('textbox');
    expect(textAreaElement).toHaveClass('test-class');
  });

  test('basic-borderクラスを持つ', () => {
    render(<TextArea />);
    const textAreaElement = screen.getByRole('textbox');
    expect(textAreaElement).toHaveClass('basic-border');
  });
});
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
textbox ロールは、自由形式テキストの入力を可能にする要素を識別するために使用されます。 可能であれば、このロールを
使用するのではなく、単一行入力の場合は type="text" の <input> 要素を使用し、複数行入力の場合は <textarea> 要
素を使用してください。
================================================================================================
2
userEvent.type
@testing-library/react` が提供する関数。文字を入力する。
まずタイピングイベントが発生する要素の位置を特定します。これは `userEvent.type` に渡す最初の引数である。
第2引数に文字列を渡すと、文字列全体を1文字ずつ入力します。
*/
