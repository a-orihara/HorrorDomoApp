import { MovieInfo } from '../../types/movieInfo';

type MovieInfoAreaProps = {
  movieInfo: MovieInfo | undefined;
};

export const MovieInfoArea = ({ movieInfo }: MovieInfoAreaProps) => {
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
*/
