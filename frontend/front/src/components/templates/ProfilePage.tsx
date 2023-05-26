import { useRouter } from 'next/router';
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
  const { user, avatarUrl } = useGetUserDataById(id);

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
  // uid: 'soso@soso.com';

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
          <UserInfo user={user} avatarUrl={avatarUrl}></UserInfo>
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
*/
