import { useRouter } from 'next/router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
  // 現在のユーザーの投稿一覧
  const [currentUserPosts, setCurrentUserPosts] = useState<Post[]>([]);
  // 現在のユーザーの投稿総数
  const [currentUserPostsCount, setCurrentUserPostsCount] = useState<number | undefined>(undefined);
  // 選択された投稿の詳細
  const [postDetailByPostId, setPostDetailByPostId] = useState<Post>();

  const router = useRouter();
  // const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();

  // サインイン中ユーザーのPost一覧を状態変数にセットする関数 #index
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
      console.log('handleGetCurrentUserPostListのエラー');
      console.error(err);
    }
  };

  // 指定したuserIdのpostの詳細を取得する関数 #show
  // PostDetailのuseEffectの依存配列に含まれる為、メモ化する
  // Alertモーダルがうまく表示されず、一旦alertで処理。
  const handleGetPostDetailByPostId = useCallback(
    async (postId: number) => {
      try {
        // 指定したuserIdのpostの詳細を取得する関数
        const data = await getPostDetailByUserId(postId);
        if (data.data.status == 200) {
          setPostDetailByPostId(data.data.data);
        } else if (data.data.status == 404) {
          alert('投稿を表示できません');
          setTimeout(() => {
            router.push(`/`);
          }, 1000);
        } else {
          console.log('handleGetPostDetailByPostId:ノーポスト');
        }
      } catch (err: any) {
        // errオブジェクトのresponseオブジェクトのdataオブジェクトが、{"status":"404","message":"投稿が見つかりません"}
        alert('投稿を表示できません');
        setTimeout(() => {
          router.push(`/`);
        }, 1000);
      }
    },
    [router]
  );

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
------------------------------------------------------------------------------------------------
Contextから関数を取得する実装はReactにおいて一般的に見られます。以下、その理由を説明します。

1. Contextはグローバルな状態管理を行うためのツールで、コンポーネントツリー全体で共有したいデータを保存します。この
データは、状態（state）だけでなく、その状態を操作するための関数も含まれます。状態とその操作方法を同時に提供すること
で、コンポーネント間の一貫性とデータの一元管理を実現します。

2. 関数をContextに含めることで、コンポーネントはその関数を直接利用でき、自身で関数を定義する必要がなくなります。こ
れにより、コードの再利用性が向上し、コードの冗長性が低減します。

3. Contextを用いた状態管理においては、関数自体が状態の一部となります。そのため、関数をContextから取得することは、
状態を操作するための直感的な方法と言えます。

以上の理由から、Contextから関数を取得する実装は一般的によく見られ、Reactの状態管理における効率的な手法となってい
ます。
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
