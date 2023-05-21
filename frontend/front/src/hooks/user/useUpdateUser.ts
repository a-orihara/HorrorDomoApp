// frontend/front/src/hooks/user/useUpdateUser.ts

import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { updateUser } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
import { UserUpdateParams } from '../../types';
// ================================================================================================
export const useUpdateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<string | null>(null);
  const { currentUser, handleGetCurrentUser } = useContext(AuthContext);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  const handleUpdateUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params: UserUpdateParams = {
      name: name,
      email: email,
      profile: profile,
    };
    try {
      const res = await updateUser(params);
      if (res.status === 200) {
        console.log(`updateのres.data:${JSON.stringify(res.data)}`);
        // 認証済みのユーザー情報を取得し、ユーザー情報や認証状態を更新する
        handleGetCurrentUser();
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.fullMessages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setAlertSeverity('error');
      if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.fullMessages) {
        setAlertMessage(`${err.response.data.errors.fullMessages[0]}`);
      } else {
        setAlertMessage('予期せぬエラーが発生しました。');
      }
      setAlertOpen(true);
    }
  };
  // ================================================================================================
  return {
    name,
    setName,
    email,
    setEmail,
    profile,
    setProfile,
    currentUser,
    handleUpdateUser,
  };
};
