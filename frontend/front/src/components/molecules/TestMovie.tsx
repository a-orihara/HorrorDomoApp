import { useGetMovieInfo } from '../../hooks/api/useGetMovieInfo';

export const TestMovie = () => {
  const { movieInfo, isMovieInfoFound, handleGetMovieInfo } = useGetMovieInfo();

  const handleButtonClick = async () => {
    // 'https://api.themoviedb.org/3',
    const movieTitle = 'エイリアン';
    handleGetMovieInfo(movieTitle);
    // 正しい
    // const url = `https://api.themoviedb.org/3//search/movie?api_key=${apiKey}&query=${movieTitle}&language=ja&region=JP`;
    // // const res = await tmdbClient.get(url);
    // const res = await axios.get(url);
  };

  return (
    <div>
      <button className='bg-blue-300' onClick={handleButtonClick}>
        おす
      </button>
      {isMovieInfoFound ? (
        movieInfo ? (
          <div>
            <p>{movieInfo.title}</p>
            <p>{movieInfo.overview}</p>
            <img src={`https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`} alt={movieInfo.title} />
          </div>
        ) : (
          <p>まだない</p>
        )
      ) : (
        <p>映画情報が見つかりませんでした</p>
      )}
    </div>
  );
};
