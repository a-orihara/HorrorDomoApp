// frontend/front/src/hooks/user/useUpdateUser.ts

import { useRouter } from 'next/router';
import { useState } from 'react';
import { updateUser } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { AxiosError } from 'axios';


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
    // 1.1
    if (avatar) {
      formData.append('avatar', avatar);
      // formData.append('user[avatar]', avatar);
    }
    console.log(...formData.entries());

    try {
      const res = await updateUser(formData);
      if (res.status === 200) {
        console.log(`updateのres.data:${JSON.stringify(res.data)}`);
        // 1.2 更新後のユーザーを取得し直す
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
      // デフォルトメッセージを設定し、これをAxiosに関連しない、その他のエラーの際に表示
      let errorMessage = '予期しないエラーが発生しました';
      // Axiosエラーかチェック
      if (err instanceof AxiosError) {
        if (err.response) {
          errorMessage = err.response.data.errors
          ? err.response.data.errors.join(', ')
          // Axiosエラーだが、特定のエラーメッセージがサーバー側で設定されていない等の場合を処理
          : '不明なエラーが発生しました';
        }else {
        // Axiosのレスポンスがない、JavaScript他のエラーの場合のメッセージ
        setAlertMessage('サーバーへの接続に失敗しました');
        }
      }
      setAlertSeverity('error');
      setAlertMessage(errorMessage);
      // この位置でメッセージが決定された後にのみアラートが表示されることを保証。
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
1.1
[formData.append('avatar', avatar || '');]にすると、avatarがnullの場合に、
ActiveSupport::MessageVerifier::InvalidSignatureのエラーが発生する。
ActiveStorageのデータを扱う場合初期値はundefinedにする。
空文字列だと、
ActiveSupport::MessageVerifier::InvalidSignatureのエラーが出る。

================================================================================================
1.2
handleUpdateUserでは、ユーザーを更新した直後に `handleGetCurrentUser()` が呼び出されます。これにより、
`render_update_success` によって返された更新されたユーザデータを直接には、フロントエンド使用されてない。余分な
サーバーリクエストが発生する可能性がありますが、データの一貫性を維持し、サーバーとクライアントの状態の不一致のリスク
を減らすという利点があります。
*/
