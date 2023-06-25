import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPostList } from '../api/post';
import { Post } from '../types/post';

type PostProviderProps = {
  children: React.ReactNode;
};

// 1
type PostContextProps = {
  posts: Post[];
};

// 2 デフォルト値はkeyがpostsの値が空の配列
const PostContext = createContext<PostContextProps>({ posts: [] });

// 全ての子コンポーネントでPostを使えるようにするProviderコンポーネント
export const PostProvider = ({ children }: PostProviderProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostList();
        if (data.data.status == 200) {
          setPosts(data.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // .ProviderはContextオブジェクトの一部であり、Contextオブジェクトを使用するコンポーネントに値を渡すために使用。
  // valueプロパティを通じてデータを提供します。
  // createContextによって生成されたContextオブジェクトは、.Providerと.Consumerという2つのReactコンポーネントを持っています。
  return <PostContext.Provider value={{ posts }}>{children}</PostContext.Provider>;
};

// Postを取得するカスタムフック
export const usePostContext = () => useContext(PostContext);

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
PostContextPropsはkey名postsの値がPost型の配列を持つオブジェクト型
PostContextは関数コンポーネントで、関数コンポーネントに渡す引数は基本オブジェクト型
================================================================================================
2
createContextで新しいContextオブジェクトを作成（関数コンポーネントではない）。
Contextオブジェクトに渡す引数は基本的にオブジェクト型;
createContext関数は引数としてデフォルト値を受け取ります。これは新しく作成されたContextのデフォルトの値です。
デフォルト値は、Providerで値が提供されていない場合、もしくはContextを使用するコンポーネントがProviderの外側にあ
る場合に使用されます。
このデフォルト値として指定できるのは任意の型ですが、Reactのコンテキストは主に複数の値を渡す目的で使われるため、オブ
ジェクト型が一般的に使用されます。
const PostContext = createContext<PostContextProps[]>([]);
*/
