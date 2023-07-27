// frontend/front/src/hooks/user/useUpdateUser.ts

import { useRouter } from 'next/router';
import { useState } from 'react';
import { updateUser } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';

export const useUpdateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const { currentUser, handleGetCurrentUser } = useAuthContext();
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  const handleUpdateUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.append('user[name]', name);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('profile', profile || '');
    // 1
    if (avatar) {
      formData.append('avatar', avatar);
      // formData.append('user[avatar]', avatar);
    }
    console.log(...formData.entries());

    try {
      const res = await updateUser(formData);
      if (res.status === 200) {
        console.log(`updateのres.data:${JSON.stringify(res.data)}`);
        // 更新後のユーザー情報をセット
        // setCurrentUser(res.data.data);
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
        setAlertMessage('An unexpected error occurred.');
      }
      setAlertOpen(true);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    profile,
    setProfile,
    setAvatar,
    currentUser,
    handleUpdateUser,
  };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
[formData.append('avatar', avatar || '');]にすると、avatarがnullの場合に、
ActiveSupport::MessageVerifier::InvalidSignatureのエラーが発生する。
ActiveStorageのデータを扱う場合初期値はundefinedにする。
空文字列だと、
ActiveSupport::MessageVerifier::InvalidSignatureのエラーが出る。
*/
