// frontend/front/src/components/molecules/form/SearchForm.tsx
import React, { useState } from 'react';
import { searchPosts } from '../../../api/post';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Label from '../../atoms/Label';

const PostSearchForm: React.FC = () => {
  const [query, setQuery] = useState('');

  // 検索ボタンをクリックした際の処理
  const handleSearchClick = async () => {
    // ここで検索APIを呼び出す処理を書く
    try {
      const response = await searchPosts({ query });
      // ここで検索結果を扱う（例: 状態を更新する、画面に結果を表示する等）
      console.log(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <Label className='mb-2'>検索</Label>
        <div className='flex'>
          <Input
            className='flex-grow'
            placeholder='キーワードを入力'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button className='ml-2 bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSearchClick}>
            検索
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostSearchForm;
