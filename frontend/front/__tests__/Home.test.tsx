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

render関数を利用することでAPPコンポーネントはテストの中で<body><div>タグの中に追加されて描写されます。
2行目にあるscreenはさまざまなメソッドを持ちそのうちの一つgetByTextメソッドを利用してrenderで描写したAppコンポーネントの中で”learn react”という文字列を探しています。
test関数、expect関数はJestの関数でtoBeInTheDocumentはjest-domライブラリに含まれているCustom matchers

it関数やtest関数を1つのファイルに複数記述することができますがit関数やtest関数を複数含めることができるdescribe関数があります。describe関数のブロックはTest Suitesと呼ばれtest/it関数のブロックはTest(Test Case)と呼ばれます。
*/
