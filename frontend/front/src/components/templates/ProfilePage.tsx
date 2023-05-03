import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserById } from '../../api/auth';
import { User } from '../../types';
import Layout from '../layout/Layout';
import Sidebar from '../organisms/Sidebar';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  // 1
  const { id } = router.query;

  // 2
  useEffect(() => {
    if (!id) return;
    const fetchUserData = async () => {
      try {
        const res = await getUserById(id as string);
        const fetchedUser: User = res.data;
        setUser(fetchedUser);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserData();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(`ユーザー：${JSON.stringify(user)}`);
  // allowPasswordChange: false;
  // email: 'soso@soso.com';
  // id: 3;
  // image: null;
  // name: 'soso';
  // provider: 'email';
  // uid: 'soso@soso.com';

  return (
    <Layout title='Profile'>
      <div className='flex  flex-1 flex-col bg-green-200'>
        <div className='flex h-full flex-row bg-blue-200'>
          <Sidebar></Sidebar>
          <div className='flex-1 '>
            <h1>Signed in successfully!</h1>
            <h2>Email: {user.email}</h2>
            <h2>Name: {user.name}</h2>
            <h1>Signed in successfully!</h1>
            <h1 className='text-blue-500'>*Profile詳細は今後実装予定</h1>
            <p>{user.name}</p>

            {/* <Image
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
            /> */}

            <h1 className='text-blue-500'>*詳細は今後実装予定</h1>
          </div>
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
idに合うユーザー情報を取得

if(!id) return;
idがundefinedの場合は何もしないようにするための処理です。この場合は、idがまだ設定されていない初回レンダリング時に
は何もしないようになっている。

関数コンポーネントのレンダリング後に非同期処理を実行し、idが変更された場合に再度処理を実行する。
具体的には、idが存在する場合にgetUserByIdという関数を実行し、取得したユーザーデータをsetUser関数を使ってuserス
テートにセットしています。
[id]はuseEffectの依存配列であり、idの値が変わった場合に再度このuseEffectが実行されるようにしています。
利用意図としては、指定したidに対応するユーザーデータを非同期的に取得し、画面に表示するためです。

------------------------------------------------------------------------------------------------
getUserById(id as string);
as string
TypeScriptの型アサーションと呼ばれるもので、idがstring型であることを明示的に示している。
*/
