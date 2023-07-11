import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePostContext } from '../../contexts/PostContext';
import useFirstTimeLogin from '../../hooks/useFirstTimeLogin';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';

const HomePage = () => {
  const { isSignedIn, currentUser } = useAuthContext();
  // showWelcomeMessage:初回ログイン時にメッセージを表示するかを判定する真偽値
  // useFirstTimeLogin:初回ログイン時にメッセージを表示するためのカスタムフック
  const { showWelcomeMessage } = useFirstTimeLogin();
  // console.log('HomePage.tsxのcurrentUser:', currentUser);
  const { currentUserPostsCount } = usePostContext();
  console.log(`ホームページのカレントユーザー${JSON.stringify(currentUser)}`);

  return (
    <div className='flex flex-1 flex-col bg-green-200'>
      {isSignedIn && currentUser ? (
        <div className='h-full bg-blue-200 lg:flex lg:flex-row'>
          <div className='h-12 w-full lg:h-full lg:w-48'>
            <Sidebar></Sidebar>
          </div>

          <div className='flex-1'>
            {showWelcomeMessage && (
              <h1 className='bg-basic-pink text-2xl text-white'>
                ようこそ！, {currentUser?.name}さん! 登録が完了しました!
              </h1>
            )}
            <UserInfo user={currentUser} postsCount={currentUserPostsCount}></UserInfo>
            <h1>ここはホームページ</h1>
          </div>
        </div>
      ) : (
        <div className='flex h-full w-full flex-1 flex-col text-center'>
          <h1 className='mt-36 scale-y-150 text-center font-spacemono text-3xl font-semibold tracking-tighter text-black md:text-4xl lg:text-6xl'>
            Welcome to the Horror Domo App!
          </h1>
          <div className='mt-40  flex h-20 items-center justify-center text-2xl text-basic-green  md:text-3xl  lg:text-4xl'>
            <Link href={'/signup'}>
              <a className='font-semibold hover:text-basic-pink'>Sign up now!</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
