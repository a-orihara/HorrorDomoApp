import { useState } from 'react';
import Input from '../../atoms/Input';
import { usePostSearchForm } from '../../../hooks/post/usePostSearchForm';

type PostSearchFormProps = {
  // enterQuery(入力語句)をSearchQuery(検索語句)にセットする。検索語句は親(Home)を通して、SearchedPostAreaに渡る。
  setSearchQuery: (enterQuery: string) => void;
  // IsSearchActive(検索postを表示するかどうかを決める)をセットする関数
  setIsSearchActive: (active: boolean) => void;
  // SearchedPostAreaが表示されるかどうかの真偽値;
  isSearchActive: boolean;
};

const PostSearchForm = ({ setSearchQuery, setIsSearchActive, isSearchActive }: PostSearchFormProps) => {
  const { enterQuery, setEnterQuery, handleSubmit, handleSearchClick, handleBackClick } = usePostSearchForm({ setSearchQuery, setIsSearchActive });

  return (
    <div className='m-1 flex flex-row items-center'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-row'>
          {/* Input and SVG wrapped in a div */}
          <div className='relative items-center'>
            <Input
              className='sm :ml-4 p-1 text-base md:text-lg lg:text-2xl'
              placeholder='映画のタイトルを入力'
              // 入力文字を格納
              value={enterQuery}
              onChange={(e) => setEnterQuery(e.target.value)}
            />
            {/* 検索アイコン */}
            <svg
              className='absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-basic-green md:h-8 md:w-8'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              onClick={handleSearchClick}
            >
              <circle cx='11' cy='11' r='8' />
              <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
          </div>
          {/* isSearchActiveがtrueの時のみ表示されるボタン */}
          {isSearchActive && (
            <button
              className='ml-4 text-basic-green hover:bg-basic-orange hover:text-basic-pink'
              onClick={handleBackClick}
            >
              戻る
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostSearchForm;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
. **`<form onSubmit={(e) => e.preventDefault()}>` の解説**:
- `<form>` タグは、ユーザーがサブミットボタンを押したときに、`onSubmit` イベントを発火させます。
- このイベントは通常、ページのリフレッシュまたは新しいページへの遷移を引き起こします。
------------------------------------------------------------------------------------------------
. **`onSubmit={(e) => e.preventDefault()}` の意味**:
- `e.preventDefault()` は、イベントのデフォルトの動作（この場合、ページのリロードや遷移）をキャンセルします。
- このコードが存在することで、フォームのサブミットが起きてもページはリロードされず、`handleSearchClick` 関数が呼
び出されるだけとなります。

*/
