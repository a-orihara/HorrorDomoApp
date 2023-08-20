import { useCallback, useState } from 'react';
import { getMovieInfo } from '../../api/movieApi';

type MovieInfo = {
  title: string;
  overview: string;
  posterPath: string;
};

// TMDBから映画情報を取得するカスタムフック
export const useGetMovieInfo = () => {
  // TMDBからの映画情報の状態変数
  const [movieInfo, setMovieInfo] = useState<MovieInfo>();
  // TMDBでmovieTitleの映画情報が見つからなかった場合の真偽値
  const [isMovieInfoFound, setIsMovieInfoFound] = useState<boolean>(true);

  // TMDBから映画情報を取得する関数
  const handleGetMovieInfo = useCallback(async (movieTitle: string) => {
    try {
      // TMDBから映画情報を取得
      console.log('◆handleGetMovieInfo発火するな◆');
      const res = await getMovieInfo(movieTitle);
      if (res.status === 200) {
        // movieTitleから映画情報が見つからなかった
        // console.log(`res:${JSON.stringify(res.data.data)}`);
        if (res.data.data.results.length === 0) {
          console.log('setIsMovieInfoFound(false)');
          setIsMovieInfoFound(false);
        } else {
          setMovieInfo(res.data.data.results[0]);
          console.log('setIsMovieInfoFound(true)');
          setIsMovieInfoFound(true);
        }
      }
    } catch (err: any) {
      alert('エラーが発生しまぷぷした');
    }
  }, []);

  return {
    movieInfo,
    handleGetMovieInfo,
  };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
{"data":{"page":1,"results":[],"total_pages":1,"total_results":0}}
------------------------------------------------------------------------------------------------
{
    "data": {
        "page": 1,
        "results": [
            {
                "original_title": "用心棒",
                "overview": "やくざと元締めが対立するさびれた宿場町。...
                "poster_path": "/lIbwlZe5KHKfrFykpOTWHzPdqbO.jpg",
                "title": "用心棒"
            },
            {
                ...
            }
*/