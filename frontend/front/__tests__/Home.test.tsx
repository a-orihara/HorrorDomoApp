// 1
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index';

it('Should render hello text', () => {
  render(<Home></Home>);
  // screen.debug();
  expect(screen.getByText('ホームページ')).toBeInTheDocument();
});
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
一般的にJestを使用してテストを実行する場合、プロジェクト直下に__tests__フォルダを作成。
テストファイル名に .test.tsx をつけることがJestのデフォルトの命名規則

*/
