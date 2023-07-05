import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUserPostList, getPostDetailByUserId } from '../api/post';
import { Post } from '../types/post';

type PostProviderProps = {
  children: React.ReactNode;
};

// 1
type PostContextProps = {
  currentUserPosts: Post[] | undefined;
  currentUserPostsCount: number | undefined;
  postDetailByPostId: Post | undefined;
  handleGetCurrentUserPostList: () => void;
  handleGetPostDetailByPostId: (userId: number) => void;
};

// 2 デフォルト値はkeyがpostsの値が空の配列
const PostContext = createContext<PostContextProps | undefined>(undefined);

// 全ての子コンポーネントでPostを使えるようにするProviderコンポーネント
export const PostProvider = ({ children }: PostProviderProps) => {
  const [currentUserPosts, setCurrentUserPosts] = useState<Post[]>([]);
  const [postDetailByPostId, setPostDetailByPostId] = useState<Post>();
  const [currentUserPostsCount, setCurrentUserPostsCount] = useState<number | undefined>(undefined);

  // サインイン中ユーザーのPost一覧を状態変数にセットする関数
  const handleGetCurrentUserPostList = async () => {
    try {
      // サインイン中ユーザーのPost一覧を取得する関数
      const data = await getCurrentUserPostList();
      if (data.data.status == 200) {
        setCurrentUserPosts(data.data.data);
        setCurrentUserPostsCount(data.data.totalPosts);
        console.log('handleGetPostListでpostがセット');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 指定したuserIdのpostの詳細を取得する関数
  const handleGetPostDetailByPostId = async (postId: number) => {
    try {
      // 指定したuserIdのpostの詳細を取得する関数
      const data = await getPostDetailByUserId(postId);
      if (data.data.status == 200) {
        setPostDetailByPostId(data.data.data);
        console.log('handleGetPostListでpostがセット');
      }
    } catch (err) {
      console.error(err);
    }
  };
  // ある操作を一度だけ実行し、その後再実行しない場合（例：APIからのデータの初回取得）、依存配列は空にします。
  useEffect(() => {
    handleGetCurrentUserPostList();
  }, []);

  // .ProviderはContextオブジェクトの一部であり、Contextオブジェクトを使用するコンポーネントに値を渡すために使用。
  // valueプロパティを通じてデータを提供します。
  // createContextによって生成されたContextオブジェクトは、.Providerと.Consumerという2つのReactコンポーネントを持っています。
  return (
    <PostContext.Provider
      value={{
        currentUserPosts,
        currentUserPostsCount,
        postDetailByPostId,
        handleGetCurrentUserPostList,
        handleGetPostDetailByPostId,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Postを取得するカスタムフック
export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContextはPostProvider内で使用しなければならない');
  }
  return context;
};

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
