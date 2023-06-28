import ReactPaginate from 'react-paginate';

type PostsPaginationProps = {
  // 全post数
  totalPostsCount: number;
  // iページあたりのpost数
  itemsPerPage: number;
  // ページ遷移時の処理
  handlePageChange: (data: { selected: number }) => void;
};

const PostsPagination = ({ totalPostsCount, itemsPerPage, handlePageChange }: PostsPaginationProps) => {
  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      pageCount={Math.ceil(totalPostsCount / itemsPerPage)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      onPageChange={handlePageChange}
      containerClassName={'pagination justify-around flex space-x-3 h-12 md:text-2xl text-xl'}
      activeClassName={'active bg-basic-pink'}
    />
  );
};

export default PostsPagination;
