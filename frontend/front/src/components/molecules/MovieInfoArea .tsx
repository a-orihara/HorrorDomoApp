import { MovieInfo } from '../../types/movieInfo';

type MovieInfoAreaProps = {
  movieInfo: MovieInfo | undefined;
};

export const MovieInfoArea = ({ movieInfo }: MovieInfoAreaProps) => {
  console.log(`%cMovieInfoAreaに渡って来たmovieInfo:${movieInfo?.title}`, 'color: blue;');
  console.log('%cisMovieInfoFoundが呼ばれた', 'color: red; ');
  return (
    // movieInfoがあれば映画情報を表示、なければ映画情報が見つかりませんでしたと表示
    <div>
      {movieInfo !== undefined ? (
        <div className='flex flex-col items-center  bg-basic-purple'>
          <h2 className='mb-8 mt-8 flex items-center justify-center text-xl tracking-wide md:text-2xl'>
            {movieInfo.title}
          </h2>
          <div className='grid h-auto grid-cols-1 grid-rows-2 justify-items-center gap-4 sm:grid-cols-2 sm:grid-rows-1'>
            <img className='mb-4' src={`https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`} alt='no Photo' />
            <div className='mb-4 rounded-md bg-basic-beige px-4 py-4 text-base tracking-wide sm:text-xl'>
              {movieInfo.overview}
            </div>
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
export const MovieInfoArea = ({ movieInfo, isMovieInfoFound }: MovieInfoAreaProps) => {
------------------------------------------------------------------------------------------------
return (
    // movieInfoがあれば映画情報を表示、なければ映画情報が見つかりませんでしたと表示
    <div>
      {movieInfo && movieInfo.title !== 'タイトルから映画が見つかりませんでした' ? (
        <div className='flex flex-col items-center  bg-basic-purple'>
          <h2 className='mb-8 mt-8 flex items-center justify-center text-xl tracking-wide md:text-2xl'>
            {movieInfo.title}
          </h2>
          <div className='grid h-auto grid-cols-1 grid-rows-2 justify-items-center gap-4 sm:grid-cols-2 sm:grid-rows-1'>
            <img
              className='mb-4'
              src={`https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`}
              alt={movieInfo.title}
            />
            <div className='mb-4 rounded-md bg-basic-beige px-4 py-4 text-base tracking-wide sm:text-xl'>
              {movieInfo.overview}
            </div>
          </div>
        </div>
      ) : movieInfo?.title === 'タイトルから映画が見つかりませんでした' ? (
        <p className='mt-8 text-center font-bold text-black sm:text-2xl'>タイトルから映画情報</p>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
*/
