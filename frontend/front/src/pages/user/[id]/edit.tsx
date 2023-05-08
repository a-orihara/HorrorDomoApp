import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AlertMessage from '../../../components/atoms/AlertMessage';
import EditPage from '../../../components/templates/EditPage';
import { AuthContext } from '../../../contexts/AuthContext';

const Edit = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  // アラートメッセージの種類を管理するステート
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
  // アラートのメッセージ内容を管理するステート
  const [alertMessage, setAlertMessage] = useState('');
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  // 1
  useEffect(() => {
    if (!currentUser) {
      setAlertSeverity('error');
      setAlertMessage('ログインしていません');
      setAlertOpen(true);
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    }
  }, [currentUser, router]);
  return (
    <>
      <EditPage></EditPage>
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        severity={alertSeverity}
        message={alertMessage}
      ></AlertMessage>
    </>
  );
};

export default Edit;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
user/[id]/edit.tsxのuseEffectは、そのページが表示されている状態で、currentUserが変更された場合に発火します。
なので、別のページにいる場合は、user/[id]/edit.tsxのコンポーネントはアンマウントされているため、useEffectは発
火しません。
別のページでcurrentUserが変更された場合、user/[id]/edit.tsxに遷移した際に、useEffectが正しく発火してログイン
状態をチェックすることが期待されます。

依存配列に値を二つ入れている理由と利用意図：
currentUser：currentUserが変更された場合に、ログインしているかどうかを再評価して、ログインしていなければログイ
ンページにリダイレクトするために使用されます。
router：routerオブジェクトが変更された場合に、useEffect内の処理を再実行するために使用されます。通常、routerは
変更されませんが、useEffect内で使用しているため、念のため依存配列に含めています。

依存配列に値を二つ入れている場合の挙動：
依存配列に含まれるいずれかの値が変更されたときに、useEffect内の処理が再実行されます。

依存配列に値を入れない場合の問題点：
依存配列が空の場合、useEffect内の処理はコンポーネントのマウント時にのみ実行されます。これにより、currentUserが
後から変更された場合でも、ログインしているかどうかを再評価せず、リダイレクトが正しく機能しない可能性があります。
*/
