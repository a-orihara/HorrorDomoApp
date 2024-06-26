import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../contexts/AuthContext';
import { useSignOut } from '../../hooks/auth/useSignOut';
import Button from '../atoms/Button';
import AlertMessage from './AlertMessage';

// 1
const Navigation = () => {
  // AuthContextから値を取得。Linkコンポーネントの表示制御に使用。
  const { loading, isSignedIn } = useAuthContext();
  const router = useRouter();
  // useSignOut: ユーザーのサインアウト処理
  const handleSignOut = useSignOut();

  return (
    <nav className='flex h-16 items-center justify-around text-base font-semibold tracking-tighter text-basic-green md:text-2xl'>
      {/* 2 */}
      <ul className='flex flex-1 flex-row items-center justify-around'>
        <li className='flex-1 '>
          <Link href={'/'}>
            <a className='flex items-center justify-around hover:text-basic-pink'>HOME</a>
          </Link>
        </li>

        {/* 3 */}
        {router.pathname !== '/signup' && !loading && !isSignedIn && (
          <li className='flex-1'>
            <Link href={'/signup'}>
              <a className='flex items-center justify-around hover:text-basic-pink'>SignUp</a>
            </Link>
          </li>
        )}

        {/* 4 */}
        {!loading && !isSignedIn && (
          <li className='flex-1'>
            <Link href={'/signin'}>
              <a className='flex items-center justify-around hover:text-basic-pink'>SignIn</a>
            </Link>
          </li>
        )}

        {/* 5 */}
        {!loading && isSignedIn && (
          <li className='flex flex-1 items-center justify-center'>
            <Button
              className='flex h-8 items-center justify-center bg-basic-green text-base text-white hover:bg-basic-pink md:h-12 md:text-lg lg:text-xl'
              onClick={handleSignOut}
            >
              SignOut
            </Button>
          </li>
        )}
      </ul>
      <AlertMessage></AlertMessage>
    </nav>
  );
};

export default Navigation;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Navigation.tsxについて:
配置場所: molecules
Navigation.tsxはLinkやButtonなどの複数の要素を組み合わせたコンポーネントであるため、moleculesに配置するのが適
切です。moleculesは複数のatoms（単一の要素）を組み合わせた単位です。

================================================================================================
2
ulタグの理由
ul タグは、順序を持たないリスト（unordered list）を表し、li タグは、リストの各項目（list item）を表します。
つまり、ul タグはリスト全体を囲み、li タグは各項目を表すのに使われます。
ul タグに li タグを入れる理由は、リストをマークアップするためです。ul タグを使用することで、順序を持たないリスト
を表現できます。li タグを使用することで、各項目を表現できます。リスト全体を ul タグで囲むことで、各項目がリストの
一部であることが明確になります。
また、ul タグに li タグを入れることで、視覚的なデザインやスタイリングを適用することもできます。CSSを使用して、リ
ストアイテムの間隔やマージン、フォントサイズ、色などを設定することができます。
------------------------------------------------------------------------------------------------
&&は、左側がtrueなら右側を返す。
isSignedIn が false （反転してtrue）の場合にのみ Link コンポーネントを返します。
それ以外は何も返さない。書き換えると、
if (isSignedIn === false) { return <Link href={'/signup'}>SignUp</Link> }
------------------------------------------------------------------------------------------------
router.pathnameは、useRouter()フックを使って取得したルーター情報のパス名を表します。
router.pathnameは、ページのURLからホスト名やクエリパラメーターを除いたパス名文字列で返します。
例えば、https://example.com/products/123というURLがある場合、router.pathnameは/products/123を返します。
router.pathnameは、<Link>コンポーネントのhref属性などで使用されることが多いです。
条件分岐を行う際に、router.pathnameを使うことで、現在のページのパス名に応じて表示するナビゲーションやコンテンツを
切り替えることができます。
------------------------------------------------------------------------------------------------
.router.pathname は現在のページのパスを表しており、条件式 router.pathname !== '/signup' は現在のページが
'/signup' ページでない場合に true を返します。
./signupページでなく、非同期処理が終わり、認証してなければ、SignUpリンクを表示
./signupページでなく、非同期処理が終わり、認証していれば、SignOutリンクを表示

================================================================================================
3
現在のURLパスが '/signup' ではない。
データの読み込みが完了していて、loading が false である。
ユーザーがサインインしていないことを示すため、isSignedIn が false である

================================================================================================
4
データの読み込みが完了していて、loading が false である。
ユーザーがサインインしていないことを示すため、isSignedIn が false である。

================================================================================================
5
データの読み込みが完了していて、loading が false である。
ユーザーがサインインしていて、isSignedIn が true である。

@          @@          @@          @@          @@          @@          @@          @@          @
*/
