import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { signOut } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../atoms/AlertMessage';
import Button from '../atoms/Button';

const Navigation = () => {
  // AuthContextから値を取得
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  // AlertContextから値を取得
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  // サインアウト処理。処理後は、トップページに遷移
  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (res.data.success === true) {
        console.log(`signOutのres.data:${JSON.stringify(res.data)}`);
        // サインアウト時には各Cookieを削除
        Cookies.remove('access-token');
        Cookies.remove('client');
        Cookies.remove('uid');
        // ここで、isSignedInをfalseにしないと、ログアウト後にヘッダーのボタンが変わらない。
        setIsSignedIn(false);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        // サインアウトしたら、トップページに遷移
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.full_messages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };
  return (
    <nav className='text-s basic-border mr-auto flex h-16  flex-grow bg-red-200  text-center font-semibold tracking-tighter text-basic-green md:text-2xl'>
      {/* 1 */}
      <ul className='flex flex-1 flex-row items-center justify-around bg-blue-200'>
        <Link href={'/'}>
          <a className='hover:text-basic-pink'>HOME</a>
        </Link>
        {router.pathname !== '/signup' && !loading && !isSignedIn && (
          <Link href={'/signup'}>
            <a className='hover:text-basic-pink'>SignUp</a>
          </Link>
        )}
        {!loading && !isSignedIn && (
          <Link href={'/signin'}>
            <a className='hover:text-basic-pink'>SignIn</a>
          </Link>
        )}
        {!loading && isSignedIn && (
          <Button
            className='flex h-14 items-center justify-center bg-basic-green text-white hover:bg-basic-pink'
            onClick={handleSignOut}
          >
            SignOut
          </Button>
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

.router.pathname は現在のページのパスを表しており、条件式 router.pathname !== '/signup' は現在のページが
'/signup' ページでない場合に true を返します。
./signupページでなく、非同期処理が終わり、認証してなければ、SignUpリンクを表示
./signupページでなく、非同期処理が終わり、認証していればば、SignOutリンクを表示

@          @@          @@          @@          @@          @@          @@          @@          @
css

@          @@          @@          @@          @@          @@          @@          @@          @
*/

/*
@          @@          @@          @@          @@          @@          @@          @@          @
// components/Navigation.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const router = useRouter();

  const navItems = isLoggedIn
    ? [
        { href: '/', label: 'ホーム', icon: '🏠' },
        { href: '/notifications', label: '通知', icon: '🔔' },
        { href: '/messages', label: 'メッセージ', icon: '✉️' },
        { href: '/profile', label: 'プロフィール', icon: '👤' },
        { href: '/signout', label: 'サインアウト', icon: '🚪' },
      ]
    : [
        { href: '/', label: 'ホーム', icon: '🏠' },
        { href: '/signin', label: 'サインイン', icon: '🔑' },
        { href: '/signup', label: 'サインアップ', icon: '✍️' },
      ];

  return (
    <nav>
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <a
                className={`flex items-center space-x-1 ${
                  router.pathname === item.href
                    ? 'text-blue-500 font-semibold'
                    : 'text-gray-500'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;


*/
