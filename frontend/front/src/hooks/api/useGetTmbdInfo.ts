import { useState } from 'react';
import { getTmbdInfo } from '../../api/tmdbService';

type TmbdRes =
  | {
      title: string;
      overview: string;
      posterPath: string;
    }
  | string;

export const useGetTmbdInfo = () => {
  const [movieInfo, setMovieInfo] = useState<TmbdRes>();

  const handleGetTmbdInfo = async (movieTitle: string) => {
    try {
      const res = await getTmbdInfo(movieTitle);
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
