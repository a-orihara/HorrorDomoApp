import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import useFirstTimeLogin from '../../hooks/useFirstTimeLogin';
import Layout from '../layout/Layout';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';

const HomePage = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);
  // showWelcomeMessage:初回ログイン時にメッセージを表示するかを判定する真偽値
  // useFirstTimeLogin:初回ログイン時にメッセージを表示するためのカスタムフック
  const { showWelcomeMessage } = useFirstTimeLogin();

  return (
    <Layout title='HOME'>
      <div className='flex  flex-1 flex-col bg-green-200'>
        {isSignedIn && currentUser ? (
          <div className='flex h-full flex-row bg-blue-200'>
            <Sidebar></Sidebar>
            <div className='flex-1'>
              {showWelcomeMessage && (
                <h1 className='bg-basic-pink text-2xl text-white'>
                  ようこそ！, {currentUser?.name}さん! 登録が完了しました!
                </h1>
              )}
              <UserInfo user={currentUser}></UserInfo>
              {/* <h2>Email: {currentUser?.email}</h2>
              <h2>Name: {currentUser?.name}</h2>
              <h2>Profile: {currentUser?.profile || 'profileは設定されていません。'}</h2>
              <h1 className='text-blue-500'>*HOME詳細は今後実装予定</h1>
              <h1>ここはユーザーホームページ:pages/index.tsx</h1> */}
              <h1>ここはホームページ</h1>
            </div>
          </div>
        ) : (
          <div className='mx-auto flex flex-1 flex-col text-center'>
            <h1 className='mt-36 scale-y-150 text-center font-spacemono text-3xl font-semibold tracking-tighter text-black md:text-6xl'>
              Welcome to the Horror Domo App!
            </h1>
            <div className='mt-40  flex h-20 items-center justify-center text-2xl text-basic-green  md:text-4xl'>
              <Link href={'/signup'}>
                <a className='font-semibold hover:text-basic-pink'>Sign up now!</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
