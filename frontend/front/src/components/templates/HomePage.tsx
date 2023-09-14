import Link from 'next/link';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePostContext } from '../../contexts/PostContext';
import useFirstTimeLogin from '../../hooks/useFirstTimeLogin';
import { useToggleFeed } from '../../hooks/useToggleFeed';
import CreatePostLink from '../atoms/CreatePostLink';
import PostSearchForm from '../molecules/form/PostSearchForm';
import FeedArea from '../organisms/area/FeedArea';
import LikedPostArea from '../organisms/area/LikedPostArea';
import SearchedPostArea from '../organisms/area/SearchedPostArea';
import Sidebar from '../organisms/Sidebar';
import UserInfo from '../organisms/UserInfo';

const HomePage = () => {
  const { isSignedIn, currentUser } = useAuthContext();
  // 2
  const { showWelcomeMessage } = useFirstTimeLogin();
  const { currentUserPostsCount } = usePostContext();
  // FeedAreaとLikedPostAreaの表示切替の状態変数と関数。
  const { showLikedPostArea, toggleFeed } = useToggleFeed();
  // 検索語句。状態は親[Home]で管理。
  // searchQueryは[SearchedPostArea]のpagination取得に、setSearchQueryは[PostSearchForm]で使用
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 検索がボタンが押された(検索が実行されたか）を追跡する状態変数（真偽値）
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  // console.log(`%c現在のsearchQuery:${searchQuery}`, 'color: red');

  return (
    <div className='flex flex-1 flex-col'>
      {isSignedIn && currentUser ? (
        <div className='flex h-full flex-col lg:flex-row'>
          <div className='h-12 w-full lg:h-full lg:w-48'>
            <Sidebar></Sidebar>
          </div>
          <div className=' lg:w-96'>
            {showWelcomeMessage && (
              <h1 className='bg-basic-pink text-2xl text-white'>
                ようこそ！, {currentUser?.name}さん! 登録が完了しました!
              </h1>
            )}
            {/* toggleFeed:FeedAreaとLikedPostAreaの表示切替の関数。 */}
            <UserInfo
              user={currentUser}
              postsCount={currentUserPostsCount}
              // FeedAreaとLikedPostAreaの表示切替の関数。
              toggleFeed={toggleFeed}
              // FeedAreaとLikedPostAreaの表示切替の状態変数。
              showLikedPostArea={showLikedPostArea}
            ></UserInfo>
            <CreatePostLink></CreatePostLink>
          </div>

          <div className='flex-1 lg:w-full'>
            <PostSearchForm
              // SearchActiveを活性、非活性化するためにsetIsSearchActiveを使用
              setIsSearchActive={setIsSearchActive}
              // 入力語句を検索語句にセットする為にsetSearchQueryを使用
              setSearchQuery={setSearchQuery}
              // [PostSearchForm]で戻るボタンを表示、非表示を切り替えるためにisSearchActiveを使用
              isSearchActive={isSearchActive}
            ></PostSearchForm>
            {/* 3 isSearchActiveがtrue(アクティブ)、searchQueryが空でなければ表示 */}
            {isSearchActive && searchQuery ? (
              // searchQueryは、[SearchedPostArea]のpagination取得に使用
              <SearchedPostArea searchQuery={searchQuery}></SearchedPostArea>
            ) : showLikedPostArea ? (
              <LikedPostArea user={currentUser}></LikedPostArea>
            ) : (
              <FeedArea user={currentUser}></FeedArea>
            )}
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

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
1. `useFeedPagination(10, currentUser.id)`について警告が出る理由:
`currentUser`は`User | undefined`型として定義されており、そのため`currentUser.id`を参照する際に
`currentUser`が`undefined`かもしれないという可能性をTypeScriptは考慮します。その結果、'currentUser'は
'undefined'の可能性がありますという警告が発生します。
------------------------------------------------------------------------------------------------
2. `const userId = currentUser ? currentUser.id : undefined;`について何も警告が出ない理由:
`currentUser ? currentUser.id : undefined`の構文は、`currentUser`が`undefined`の場合は、
`userId`に`undefined`を割り当て、`undefined`ではない場合は`currentUser.id`を`userId`に割り当てます。この
ように分岐処理を行うことで、`userId`は常に定義されていることが保証され、したがって可能性がありますの警告は発生しま
せん。
`userId`はすべての実行パスで定義されることが保証されているため、警告は発生しません。
currentUserがundefinedであるかどうかに関わらず、userIdの値は必ず何かしら設定されます（currentUserが存在すれ
ばcurrentUser.id、そうでなければundefined）。そのため、'userId' はすべての実行パスで「エラーが発生せずに値が定
義される」ことが保証されているのです。

================================================================================================
2
showWelcomeMessage:初回ログイン時にメッセージを表示するかを判定する真偽値
useFirstTimeLogin:初回ログイン時にメッセージを表示するためのカスタムフック

================================================================================================
3
isSearchActive： 検索がアクティブ（検索がボタンが押された）かどうかを示す。
searchQuery： ユーザーが何を検索しているか（検索された文字列があるか）を表す文字列。
両方の条件が真の場合、<SearchedPostArea query={searchQuery}>が表示されます。
------------------------------------------------------------------------------------------------
: showLikedPostArea ? ( <LikedPostArea user={currentUser}></LikedPostArea> )
この部分は、最初の部分（isSearchActive && searchQuery）が偽の場合に実行される。
showLikedPostAreaがtrueかfalseかをチェックする。
もしtrueなら、<LikedPostArea user={currentUser}>が表示される。
------------------------------------------------------------------------------------------------
<FeedArea user={currentUser}></FeedArea>
この部分は、最初の部分(isSearchActive && searchQuery)と2番目の部分(showLikedPostArea)の両方がfalseの場合
に実行されます。
デフォルトでは<FeedArea user={currentUser}>が表示されます。
*/
