import Link from 'next/link';
import React from 'react';

const Navigation = () => {
  return (
    <nav className='text-s ml-3 mr-auto  items-center justify-around text-center font-spacemono font-semibold tracking-tighter text-basic-green md:text-2xl'>
      {/* 1 */}

      <ul className='flex flex-row justify-around '>
        <Link href={'/'}>HOME</Link>
        <Link href={'/'}>SignUp</Link>
        <Link href={'/'}>SignOut</Link>
      </ul>
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
また、ul タグに li タグを入れることで、視覚的なデザインやスタイリングを適用することもできます。CSSを使用して、リストアイテムの間隔やマージン、フォントサイズ、色などを設定することができます。
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
