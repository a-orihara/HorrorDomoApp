import Cookies from 'js-cookie';
import { client } from './client';

// ユーザー情報を更新
export const getMovieInfo = (movieTitle: string) => {
  console.log("◆getMovieInfoが発火ピピふ")
  return client.get(`/movies?title=${movieTitle}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};
