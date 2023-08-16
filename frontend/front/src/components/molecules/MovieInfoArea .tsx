// import { useEffect } from 'react';

type MovieInfo = {
  title: string;
  overview: string;
  posterPath: string;
};
// export const MovieInfoArea = ({ movieTitle }: { movieTitle: string }) => {
export const MovieInfoArea = ({ movieInfo }: { movieInfo: MovieInfo | undefined }) => {
  console.log(`MovieInfoAreaに渡って来たmovieInfo:${movieInfo?.title}`);
  return (
    // movieInfoがあれば映画情報を表示、なければ映画情報が見つかりませんでしたと表示
    <div>
      {movieInfo ? (
        <div className='flex flex-col items-center'>
          <h2 className='flex items-center justify-center text-xl'>{movieInfo.title}</h2>
          <img
            className='h-4/6 w-2/6 sm:h-2/6 sm:w-1/6'
            src={`https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`}
            alt={movieInfo.title}
          />
          <p>OverView:</p>
          <p>{movieInfo.overview}</p>
        </div>
      ) : (
        <p>映画情報が見つかりませんでした</p>
      )}
    </div>
  );
};
