import { useState } from 'react';
import { getMovieInfo } from '../../api/movieApi';

type Res = {
  title: string;
  overview: string;
  posterPath: string;
};

export const TestMovie = () => {
  const [movieInfo, setMovieInfo] = useState<Res | null>(null);

  const handleButtonClick = async () => {
    // 'https://api.themoviedb.org/3',
    const movieTitle = '用心棒';

    // 正しい
    // const url = `https://api.themoviedb.org/3//search/movie?api_key=${apiKey}&query=${movieTitle}&language=ja&region=JP`;
    // // const res = await tmdbClient.get(url);
    // const res = await axios.get(url);

    const res = await getMovieInfo(movieTitle);

    if (res.data.data.results[0]) {
      setMovieInfo(res.data.data.results[0]);
    }
  };

  return (
    <div>
      <button className='bg-blue-300' onClick={handleButtonClick}>
        おす
      </button>
      {movieInfo ? (
        <div>
          <p>{movieInfo.title}</p>
          <p>{movieInfo.overview}</p>
          <img src={`https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`} alt={movieInfo.title} />
        </div>
      ) : (
        <p>まだない</p>
      )}
    </div>
  );
};
