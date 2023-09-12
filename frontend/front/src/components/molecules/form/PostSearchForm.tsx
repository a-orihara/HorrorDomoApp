// frontend/front/src/components/molecules/form/SearchForm.tsx
import { useState } from 'react';
// import { searchPosts } from '../../../api/post';
import Input from '../../atoms/Input';

type PostSearchFormProps = {
  // setSearchedPosts: (posts: [Post]) => void;
  setSearchQuery: (query: string) => void;
};

const PostSearchForm = ({ setSearchQuery }: PostSearchFormProps) => {
  // 検索キーワードを管理する状態
  const [query, setQuery] = useState('');
  // const [searchedPosts, setSearchedPosts] = useState<Post>();
  const handleSearchClick = () => {
    setSearchQuery(query);
  };

  // // 検索ボタンをクリックした際の処理
  // const handleSearchClick = async () => {
  //   // ここで検索APIを呼び出す処理を書く
  //   try {
  //     const res = await searchPosts({ query });
  //     // ここで検索結果を扱う（例: 状態を更新する、画面に結果を表示する等）
  //     console.log(`response.data:${JSON.stringify(res.data.data)}`);
  //     setSearchedPosts(res.data.data);
  //     setSearchQuery(query);
  //   } catch (error) {
  //     console.error('Search failed:', error);
  //   }
  // };
  return (
    <div className='m-1 flex flex-row items-center'>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          {/* Input and SVG wrapped in a div */}
          <div className='relative items-center'>
            <Input
              className='sm :ml-4 p-1 text-base md:text-lg lg:text-2xl'
              placeholder='映画のタイトルを入力'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* 検索アイコン */}
            <svg
              className='absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-basic-green lg:h-8 lg:w-8'
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
