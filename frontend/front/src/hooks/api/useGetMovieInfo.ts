import { useCallback, useState } from 'react';
import { getMovieInfo } from '../../api/movieApi';
import { MovieInfo } from '../../types/movieInfo';

// TMDBから映画情報を取得するカスタムフック
export const useGetMovieInfo = () => {
  // TMDBからの映画情報の状態変数
  const [movieInfo, setMovieInfo] = useState<MovieInfo>();

  // TMDBから映画情報を取得する関数
  const handleGetMovieInfo = useCallback(async (movieTitle: string) => {
    try {
      // TMDBから映画情報を取得
      const res = await getMovieInfo(movieTitle);
      if (res.status === 200) {
        if (res.data.data.results.length === 0) {
          setMovieInfo({
            title: 'タイトルから映画が見つかリませんでした',
            overview: 'no Content',
            posterPath: '',
          });
        } else {
          setMovieInfo(res.data.data.results[0]);
        }
      }
    } catch (err) {
      alert('映画情報を取得出来ませんでした');
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
