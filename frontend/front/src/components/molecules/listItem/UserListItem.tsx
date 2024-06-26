// frontend/front/src/components/UserListItem.tsx
import Link from 'next/link';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useDeleteUser } from '../../../hooks/user/useDeleteUser';
import { User } from '../../../types/user';

// ================================================================================================
type UserListItemProps = {
  user: User;
};
// ================================================================================================
// user:指定したページの指定した表示件数分のユーザー情報の内の一user
const UserListItem = ({ user }: UserListItemProps) => {
  const { currentUser } = useAuthContext();
  const { handleDeleteUser } = useDeleteUser();
  // currentUserが表示中のユーザーが異なる場合にtrue
  const isDifferentUser = currentUser?.id !== user.id;
  // currentUserが管理者の場合にtrue
  const isAdmin = currentUser?.admin;

  return (
    <li key={user.id} className='flex flex-row justify-center'>
      {/* 1 */}
      <Link href={`/users/${user.id}`}>
        <a className='text-center text-base tracking-widest underline hover:text-basic-pink md:text-2xl lg:text-xl'>
          {user.name}
        </a>
      </Link>
      {isAdmin && isDifferentUser && (
        <a
          className='ml-4 text-center text-basic-green hover:cursor-pointer hover:text-basic-pink'
          onClick={() => handleDeleteUser(user.id)}
        >
          delete
        </a>
      )}
    </li>
  );
};

export default UserListItem;
{
  /* <a>
          <p className='bg-red-100 text-center text-base tracking-widest hover:text-basic-pink md:text-xl'>
            {user.name}
          </p>
        </a> */
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
h1タグとpタグの使用について:タグの選択は、そのコンテンツの重要性と意味によります。
<h1>タグは、ページの主要な見出しを表すために使用されます。そのため、各ページでは一度だけ使用するのが最善です。
また、SEOにとっても重要な役割を果たします。
<p>タグは、段落や一般的なテキストを表示するために使用されます。
もしこのリンクがページの主要な見出しや重要なセクションの見出しを示すものであれば、<h1>を使用するべきです。ただし、
一般的なテキストリンクや説明の一部としてリンクが含まれている場合は、<p>タグを使用するべきです。
*/
