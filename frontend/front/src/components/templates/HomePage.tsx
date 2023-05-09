import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import Sidebar from '../organisms/Sidebar';

const HomePage = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);
  // ログイン後に、初回ログイン時のみ表示するメッセージを管理するステート
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    // ログイン後に、初回ログイン時のみ表示するメッセージを表示する
    if (localStorage.getItem('firstTimeLogin') === 'true') {
      // ログイン後に、初回ログイン時のみ表示するメッセージを表示する
      setShowWelcomeMessage(true);
      // 今後、初回ログイン時のメッセージを表示しないようにする
      localStorage.removeItem('firstTimeLogin');
    }
  }, []);

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
              <h1>Signed in successfully!</h1>
              <h2>Email: {currentUser?.email}</h2>
              <h2>Name: {currentUser?.name}</h2>
              <h1 className='text-blue-500'>*HOME詳細は今後実装予定</h1>
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
