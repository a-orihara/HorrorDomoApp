import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signIn } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { SignInParams } from '../../types';

// ================================================================================================
export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // setIsSignedIn:ログイン状態を管理、setCurrentUser:ログインユーザーの情報を管理
  // const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { setIsSignedIn, setCurrentUser } = useAuthContext();
  // setAlertMessage:アラートのメッセージを管理、setAlertOpen:アラートの表示状態を管理、setAlertSeverity:アラートの種類を管理
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  // ------------------------------------------------------------------------------------------------
  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const params: SignInParams = {
      email: email,
      password: password,
    };
    try {
      const res = await signIn(params);
      console.log(`サインインのres${JSON.stringify(res.data)}`);
      if (res.status === 200) {
        // ログインに成功したら、Cookieにアクセストークン、クライアント、uidを保存
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push(`/users/${res.data.data.id}`);
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.fullMessages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };

  // ================================================================================================
  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
  };
};
