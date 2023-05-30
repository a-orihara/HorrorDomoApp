import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { signOut } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
// ================================================================================================
// サインアウト処理。処理後は、トップページに遷移する。
export const useSignOut = () => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (res.data.success === true) {
        console.log(`signOutのres.data:${JSON.stringify(res.data)}`);
        // サインアウト時には各Cookieを削除
        Cookies.remove('access-token');
        Cookies.remove('client');
        Cookies.remove('uid');
        // ここで、isSignedInをfalseにしないと、ログアウト後にヘッダーのボタンが変わらない。
        setIsSignedIn(false);
        // ユーザーを未定義にする
        setCurrentUser(undefined);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        // サインアウトしたら、トップページに遷移
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.fullMessages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };
  // ------------------------------------------------------------------------------------------------
  return handleSignOut;
};
