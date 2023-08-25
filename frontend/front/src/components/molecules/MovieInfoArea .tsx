// type MovieInfo = {
//   title: string;
//   overview: string;
//   posterPath: string;
//   isMovieInfoFound: boolean;
// };

import { MovieInfo } from '../../types/movieInfo';

export const MovieInfoArea = ({ movieInfo }: { movieInfo: MovieInfo | undefined }) => {
  // console.log(`MovieInfoAreaに渡って来たmovieInfo:${movieInfo?.title}`);
  // console.log('%cMovieInfoAreaが呼ばれた', 'color: blue;');
  return (
    // movieInfoがあれば映画情報を表示、なければ映画情報が見つかりませんでしたと表示
    <div>
      {movieInfo !== undefined ? (
        <div className='flex flex-col items-center  bg-basic-purple'>
          <h2 className='mb-8 mt-8 flex items-center justify-center text-xl tracking-wide md:text-2xl'>
            {movieInfo.title}
          </h2>
          <div className='grid h-auto grid-cols-1 grid-rows-2 justify-items-center gap-4 sm:grid-cols-2 sm:grid-rows-1'>
            <img
              // className='h-60 w-44 bg-orange-200 sm:h-96  sm:w-72'
              className='mb-4'
              src={`https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`}
              alt={movieInfo.title}
            />
            <div className='mb-4 rounded-md bg-basic-beige px-4 py-4 text-base tracking-wide sm:text-xl'>
              {movieInfo.overview}
            </div>
          </div>
        </div>
      ) : movieInfo === null ? (
        <p>タイトルから映画情報が見つかりませんでした</p>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};
