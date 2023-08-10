import { useState } from 'react';
import { tmdbClient } from '../../api/client';

type Res = {
  title: string;
  overview: string;
  posterPath: string;
};

export const TestMovie = () => {
  const [movieInfo, setMovieInfo] = useState<Res | null>(null);

  const handleButtonClick = async () => {
    const movieTitle = '用心棒';
    const apiKey = '任意';
    // const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}&language=ja&region=JP`;
    // const response = await axios.get(url);
    const url = `/search/movie?api_key=${apiKey}&query=${movieTitle}&language=ja&region=JP`; // baseURLを使用
    const response = await tmdbClient.get(url); // tmdbClientを使用
    if (response.data.results[0]) {
      setMovieInfo(response.data.results[0]);
    }
  };

  console.log(`mo:${JSON.stringify(movieInfo)}`);

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
