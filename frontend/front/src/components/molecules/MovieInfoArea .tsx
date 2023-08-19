type MovieInfo = {
  title: string;
  overview: string;
  posterPath: string;
};

export const MovieInfoArea = ({ movieInfo }: { movieInfo: MovieInfo | undefined }) => {
  // console.log(`MovieInfoAreaに渡って来たmovieInfo:${movieInfo?.title}`);
  console.log('%cMovieInfoAreaが呼ばれた', 'color: blue;');
  return (
    // movieInfoがあれば映画情報を表示、なければ映画情報が見つかりませんでしたと表示
    <div>
      {movieInfo !== undefined ? (
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
      ) : movieInfo === null ? (
        <p>タイトルから映画情報が見つかりませんでした</p>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};
