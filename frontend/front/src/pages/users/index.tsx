import UserListItem from '../../components/atoms/UserListItem';
import Layout from '../../components/layout/Layout';
import UsersPagination from '../../components/molecules/UsersPagination';
import { useUsersPagination } from '../../hooks/user/useUsersPagination';

const Index = () => {
  // 1ぺージに表示するユーザー数
  const itemsPerPage = 10;
  // 1 ユーザー一覧を取得して、ステートに格納し、ページをクリックした時の処理を定義したカスタムフック
  const { users, totalUsersCount, handlePageChange } = useUsersPagination(itemsPerPage);

  return (
    <Layout title={'Users'}>
      <div className='flex flex-1 flex-col'>
        <div className='flex flex-1 flex-col'>
          <h1 className='mx-auto mb-2 flex h-10 items-center justify-center text-lg font-semibold sm:text-2xl md:h-14 md:text-4xl'>
            All Users
          </h1>
          <ul className='flex flex-1 flex-col justify-around'>
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </ul>
        </div>
        <UsersPagination
          totalUsersCount={totalUsersCount}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
        ></UsersPagination>
      </div>
    </Layout>
  );
};

export default Index;
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
usersは、指定したページの指定した表示件数分のユーザーの配列。
totalUsersは、総ユーザー数。
handlePageChangeは、ページネーションのページ変更時に実行する関数で、新たに指定したページの指定した表示件数分のユ
ーザーの配列と総ユーザー数が取得される。
================================================================================================
*/
