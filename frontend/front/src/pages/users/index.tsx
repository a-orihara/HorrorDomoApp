import Layout from '../../components/layout/Layout';
import Pagination from '../../components/molecules/Pagination';
import UserList from '../../components/organisms/list/UserList';
import { useUsersPagination } from '../../hooks/user/useUsersPagination';

const Index = () => {
  // 1ぺージに表示するユーザー数
  const itemsPerPage = 10;
  // 1 ユーザー一覧を取得して、ステートに格納し、ページをクリックした時の処理を定義したカスタムフック
  const { users, totalUsersCount, handlePageChange } = useUsersPagination(itemsPerPage);

  return (
    <Layout title={'Users'}>
      <div className='flex flex-1 flex-col'>
        <UserList users={users}></UserList>
        {/* 一覧リストの下に表示されるページネーション部分のUI */}
        <Pagination
          totalCount={totalUsersCount}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
        ></Pagination>
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
