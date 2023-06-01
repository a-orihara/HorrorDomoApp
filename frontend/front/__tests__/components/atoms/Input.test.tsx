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
*/
