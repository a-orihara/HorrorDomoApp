import axios from 'axios';
import { useState } from 'react';

type Res = {
  title: string;
  overview: string;
  poster_path: string;
};

export const TestMovie = () => {
  const [movieInfo, setMovieInfo] = useState<Res | null>(null);

  const handleButtonClick = async () => {
    const movieTitle = 'ふみょーさ';
    const apiKey = '任意';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}&language=ja&region=JP`;
    const response = await axios.get(url);
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
          <img src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`} alt={movieInfo.title} />
        </div>
      ) : (
        <p>まだない</p>
      )}
    </div>
  );
};
