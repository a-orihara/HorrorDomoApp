import { useRouter } from 'next/router';
import { useEffect } from 'react';
// import { usePostContext } from '../../contexts/PostContext';
import { useGetPostByUserId } from '../../hooks/post/useGetPostByUserId';
import useGetUserById from '../../hooks/user/useGetUserById';
import PostList from '../molecules/PostList';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';
// ================================================================================================
const ProfilePage = () => {
  // const { posts } = usePostContext();
  const router = useRouter();
  // 1
  const { id } = router.query;
  // 選択したidに紐付くuserとpostsを取得
  const { user, handleGetUserById } = useGetUserById(id);
  const { posts, handleGetPostsByUserId } = useGetPostByUserId(id);
  // ------------------------------------------------------------------------------------------------
  // 2
  useEffect(() => {
    handleGetUserById();
    handleGetPostsByUserId();
  }, [id, handleGetUserById, handleGetPostsByUserId]);

  // 3
  if (!user) {
    return <div>Loading...</div>;
  }

  // ================================================================================================
  return (
    <div className='flex w-full flex-1 flex-col bg-green-200'>
      <div className='flex h-full flex-1 flex-row bg-blue-200'>
        <div className='w-32  md:w-48'>
          <Sidebar></Sidebar>
        </div>
        <div className='w-80 bg-red-200'>
          <UserInfo user={user}></UserInfo>
        </div>
        <div className='flex-1 bg-green-200'>
          <PostList posts={posts} user={user}></PostList>
        </div>
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

================================================================================================
3
return <div>Loading...</div>;を記載する理由
<UserInfo user={user}></UserInfo>コンポーネントは、User型のuserプロパティを必須としています。
しかし、ProfilePageコンポーネント内のuserはUser | null型です。そのため、userがnullの可能性があるときに、
<UserInfo>コンポーネントをレンダリングしようとすると、TypeScriptは型の不一致を警告します。
return <div>Loading...</div>;がある場合、userがnullのときにはこの行がレンダリングされ、以降のコード
（<UserInfo user={user}></UserInfo>を含む）は実行されません。そのため、userがnullの場合でもTypeScriptのエ
ラーは発生しないため、TypeScriptのエラーは表示されません。
*/
