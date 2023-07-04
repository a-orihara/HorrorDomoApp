import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signIn } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePostContext } from '../../contexts/PostContext';
import { SignInParams } from '../../types/user';

// ================================================================================================
export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // setIsSignedIn:ログイン状態を管理、setCurrentUser:ログインユーザーの情報を管理
  // const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { handleGetCurrentUser } = useAuthContext();
  // setAlertMessage:アラートのメッセージを管理、setAlertOpen:アラートの表示状態を管理、setAlertSeverity:アラートの種類を管理
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const { handleGetCurrentUserPostList } = usePostContext();
  const router = useRouter();

  // ------------------------------------------------------------------------------------------------
  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // paramsオブジェクトを作成、emailとpasswordを格納
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
        // 1
        handleGetCurrentUser();
        handleGetCurrentUserPostList();
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push(`/users/${res.data.data.id}`);
        }, 1000);
      } else {
        setAlertSeverity('error');
        // setAlertMessage(`${res.data.errors.fullMessages}`);
        setAlertMessage(`${res.data.errors[0]}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors}`);
      // setAlertMessage(`${err.response}`);
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

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
setIsSignedIn(true);
setCurrentUser(res.data.data);
だとサインイン直後にHomePageに行ってもavatarが表示されない。非同期処理が関係？
*/
