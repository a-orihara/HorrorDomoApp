import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useGetPostList from '../../hooks/post/useGetPostList';
import useGetUserDataById from '../../hooks/user/useGetUserDataById';
import PostListItem from '../atoms/PostListItem';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';
// ================================================================================================
const ProfilePage = () => {
  // const [user, setUser] = useState<User | null>(null);
  // ポストデータを保持するためのStateを追加
  // const [posts, setPosts] = useState<Post[]>([]);
  const { posts } = useGetPostList();
  const router = useRouter();
  // 1
  const { id } = router.query;
  const { user, handleGetUserDataById } = useGetUserDataById(id);
  // ------------------------------------------------------------------------------------------------
  // 2
  useEffect(() => {
    handleGetUserDataById();
  }, [handleGetUserDataById]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // ================================================================================================
  return (
    <div className='flex  flex-1 flex-col bg-green-200'>
      <div className='flex h-full flex-col bg-blue-200'>
        <Sidebar></Sidebar>
        <UserInfo user={user}></UserInfo>
        <h1>ここはユーザー詳細ページ:pages/users/[id]/index.tsx</h1>
        <br />
        {posts.map((post) => (
          <PostListItem key={post.id} post={post}></PostListItem>
        ))}
        <br />
        <p>ふは</p>
      </div>
    </div>
  );
};

export default ProfilePage;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
router.query
現在のページのクエリストリングの値を表すオブジェクトです。{}の中にidを書くことで、router.queryオブジェクトから、
idパラメーターを分割代入で取り出しています。

================================================================================================
2
ここのuseEffectの第二引数に、handleGetUserDataByIdを渡している理由。
handleGetUserDataById関数が変更されるたびにhandleGetUserDataByIdが呼び出されることになります。依存配列が空
[]では、handleGetUserDataByIdはコンポーネントがマウントされるときに一度だけ呼び出されます。
idが変更された場合、ユーザーデータを再度取得する必要がありますが、最初の例ではこれを処理します。一方、[]では、idの
変更に関係なく、handleGetUserDataByIdは一度しか呼び出されないので、処理されません。
------------------------------------------------------------------------------------------------
ちなみに、useGetUserDataById.ts` において、`useCallback` を使用しない場合、レンダリング毎にuseEffactにより、
新しい `handleGetUserDataById` 関数が作成され、`ProfilePage` が依存している `handleGetUserDataById` 関
数がレンダリング毎に変わるため、不必要な再レンダリングを引き起こす。これは、コンポーネントが複雑な場合や再レンダリン
グが多い場合に、パフォーマンスの問題につながる可能性があります。
------------------------------------------------------------------------------------------------
`handleGetUserDataById`に `useCallback` を使用する目的は、関数をメモ化することです。つまり、依存関係の1つが
変更された場合にのみ関数を変更します。この場合、`handleGetUserDataById`は、`id`が変更された場合にのみ変更され
ます。これにより、不必要な再レンダリングを防ぎ、パフォーマンスを向上させることができます。
------------------------------------------------------------------------------------------------
さらにuseCallback`により新しい `handleGetUserDataById` 関数が作成されますが、useCallbackは生成するだけで、
この関数は自動的に実行されません。ProfilePage.tsx`の `useEffect` 内のように、明示的に呼び出されたときのみ実行
されます。
*/
