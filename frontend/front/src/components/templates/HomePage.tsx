import Link from 'next/link';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePostContext } from '../../contexts/PostContext';
import useFirstTimeLogin from '../../hooks/useFirstTimeLogin';
import { useFeedPagination } from '../../hooks/user/useFeedPagination';
import Pagination from '../molecules/Pagination';
import PostList from '../molecules/PostList';
import UserInfo from '../molecules/UserInfo';
import Sidebar from '../organisms/Sidebar';

const HomePage = () => {
  const { isSignedIn, currentUser } = useAuthContext();
  // showWelcomeMessage:初回ログイン時にメッセージを表示するかを判定する真偽値
  // useFirstTimeLogin:初回ログイン時にメッセージを表示するためのカスタムフック
  const { showWelcomeMessage } = useFirstTimeLogin();
  // console.log('HomePage.tsxのcurrentUser:', currentUser);
  const { currentUserPostsCount } = usePostContext();
  const userId = currentUser ? currentUser.id : undefined;
  const { posts, totalPostsCount, handlePageChange } = useFeedPagination(10, userId);

  console.log(`ホームページのカレントユーザー${JSON.stringify(currentUser)}`);
  console.log(`ホームページの諸々の値${totalPostsCount}`);

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
          </div>
          <PostList user={currentUser} posts={posts}></PostList>
          <Pagination totalCount={totalPostsCount} itemsPerPage={10} handlePageChange={handlePageChange}></Pagination>
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

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
1. `useFeedPagination(10, currentUser.id)`について警告が出る理由:
`currentUser`は`User | undefined`型として定義されており、そのため`currentUser.id`を参照する際に
`currentUser`が`undefined`かもしれないという可能性をTypeScriptは考慮します。その結果、'currentUser'は
'undefined'の可能性がありますという警告が発生します。

2. `const userId = currentUser ? currentUser.id : undefined;`について何も警告が出ない理由:
`currentUser ? currentUser.id : undefined`の構文は、`currentUser`が`undefined`の場合は、
`userId`に`undefined`を割り当て、`undefined`ではない場合は`currentUser.id`を`userId`に割り当てます。この
ように分岐処理を行うことで、`userId`は常に定義されていることが保証され、したがって可能性がありますの警告は発生しま
せん。
`userId`はすべての実行パスで定義されることが保証されているため、警告は発生しません。
currentUserがundefinedであるかどうかに関わらず、userIdの値は必ず何かしら設定されます（currentUserが存在すれ
ばcurrentUser.id、そうでなければundefined）。そのため、'userId' はすべての実行パスで「エラーが発生せずに値が定
義される」ことが保証されているのです。
*/
