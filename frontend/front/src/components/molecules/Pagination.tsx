//frontend/front/src/components/molecules/Pagination.tsx
import ReactPaginate from 'react-paginate';

type PaginationProps = {
  totalCount: number;
  itemsPerPage: number;
  handlePageChange: (data: { selected: number }) => void;
};

const Pagination = ({ totalCount, itemsPerPage, handlePageChange }: PaginationProps) => {
  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      pageCount={Math.ceil(totalCount / itemsPerPage)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      onPageChange={handlePageChange}
      containerClassName={'pagination justify-around flex space-x-3 h-8 lg:h-12 md:text-2xl lg:text-xl text-base'}
      activeClassName={'active bg-basic-pink'}
    />
  );
};
export default Pagination;
