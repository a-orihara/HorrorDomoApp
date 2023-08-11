import { useState } from 'react';
import { getMovieInfo } from '../../api/movieApi';

type TmbdRes = {
  title: string;
  overview: string;
  posterPath: string;
};

export const useGetTmbdInfo = () => {
  const [movieInfo, setMovieInfo] = useState<TmbdRes>();

  const handleGetTmbdInfo = async (movieTitle: string) => {
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
    handleGetTmbdInfo,
  };
};
