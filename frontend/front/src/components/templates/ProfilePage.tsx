import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useGetUserDataById from '../../hooks/user/useGetUserDataById';
import Layout from '../layout/Layout';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';

// ================================================================================================
const ProfilePage = () => {
  // const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  // 1
  const { id } = router.query;
  const { user, handleGetUserDataById } = useGetUserDataById(id);

  // 2
  useEffect(() => {
    handleGetUserDataById();
  }, [handleGetUserDataById]);
  // ------------------------------------------------------------------------------------------------
  if (!user) {
    return <div>Loading...</div>;
  }
  // allowPasswordChange: false;
  // email: 'soso@soso.com';
  // id: 3;
  // image: null;
  // name: 'soso';
  // provider: 'email';
  // uid: 'soso@soso.com'

  // ================================================================================================
  return (
    <Layout title='Profile'>
      <div className='flex  flex-1 flex-col bg-green-200'>
        <div className='flex h-full flex-row bg-blue-200'>
          <Sidebar></Sidebar>
          {/* <div className='flex-1 '>
            <h2>Name: {user.name}</h2>
            <h2>Email: {user.email}</h2>
            <h2>Profile: {user.profile || 'profileは設定されていません。'}</h2>
            <h1 className='text-blue-500'>*詳細は今後実装予定</h1>
            <h1>ここはユーザー詳細ページ:pages/users/[id]/index.tsx</h1>
            <Image
              // user.avatar が undefined だった場合にデフォルト画像を表示
              src={user.avatarUrl || '/no_image_square.jpg'}
              alt={user.name}
              width={100}
              height={100}
              onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                // onerrorプロパティにnullを代入して、無限ループに陥るのを防止
                e.currentTarget.onerror = null;
                // srcプロパティにデフォルトの画像のURLを設定
                e.currentTarget.src = '/no_image_square.jpg';
              }}
            />
          </div> */}
          <UserInfo user={user}></UserInfo>
          <h1>ここはユーザー詳細ページ:pages/users/[id]/index.tsx</h1>
        </div>
      </div>
    </Layout>
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
