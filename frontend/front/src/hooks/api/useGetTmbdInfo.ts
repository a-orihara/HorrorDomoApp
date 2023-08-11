import { useState } from 'react';
import { getMovieInfo } from '../../api/movieApi';

type MovieInfo = {
  title: string;
  overview: string;
  posterPath: string;
};

export const useGetMovieInfo = () => {
  const [movieInfo, setMovieInfo] = useState<MovieInfo>();

  const handleGetMovieInfo = async (movieTitle: string) => {
    try {
      const res = await getMovieInfo(movieTitle);
      if (res.status === 200) {
        setMovieInfo(res.data.data);
      }
    } catch (err: any) {
      alert('エラーが発生しました');
    }
  };

  return {
    movieInfo,
    handleGetMovieInfo,
  };
};
