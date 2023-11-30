// frontend/front/src/pages/mailConfirmation.tsx
import axios, { AxiosError } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAlertContext } from '../contexts/AlertContext';

// サインアップ時のmail認証用のコンポーネント
const MailConfirmation: NextPage = () => {
  const router = useRouter();
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();

  useEffect(() => {
    // 2.1
    if (!router.isReady) {
      return;
    }

    // 3.1
    if (router.query['confirmation_token']) {
      const url = process.env.NEXT_PUBLIC_API_URL + '/user/confirmations';
      axios({ method: 'PATCH', url: url, data: router.query })
        .then(() => {
          setAlertMessage('認証に成功しました');
          setAlertSeverity('success');
          setAlertOpen(true);
          router.push('/signin');
        })
        .catch((e: AxiosError<{ error: string }>) => {
          console.log(e.message);
          setAlertMessage('不正なアクセスです');
          setAlertSeverity('error');
          setAlertOpen(true);
          router.push('/');
        });
    } else {
      setAlertMessage('不正なアクセスです');
      setAlertSeverity('error');
      setAlertOpen(true);
      router.push('/');
    }
  }, [router, setAlertMessage, setAlertSeverity, setAlertOpen]);

  return <></>;
};

export default MailConfirmation;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
2.1
`if (!router.isReady)` は、ルーターの準備が完了していない場合に何もしないようにするための条件文です。
------------------------------------------------------------------------------------------------
`if (!router.isReady)` の意味と使用意図：
- `router` は Next.js の `useRouter` フックを使用して取得されています。これは、ルーターオブジェクトを表します。
------------------------------------------------------------------------------------------------
- `router.isReady` は、ルーターオブジェクトのプロパティで、ルーターが初期化され、準備が完了したかどうかを示すブ
ール値です。つまり、`true` の場合、ルーターが準備完了していることを意味し、`false` の場合、まだ初期化やデータの
読み込みが行われていないことを示します。
------------------------------------------------------------------------------------------------
- `if (!router.isReady)` は、ルーターがまだ初期化されておらず、データの読み込みが行われていない場合に条件を満
たすことを意味します。つまり、この条件はルーターが完全に動作可能でない場合に実行されるコードブロックを指定しています。
------------------------------------------------------------------------------------------------
- 使用意図：このコードの目的は、ページコンポーネントが初期化される際に、ルーターが完全に初期化されるまで待機するこ
とです。`router.isReady` が `true` でない場合、まだルーターが完全に準備されていないため、後続の処理（API呼び出
しやアラートの表示など）を実行しないようにしています。これにより、ページが正しく初期化され、必要なデータが読み込まれ
てから処理が実行されることを保証します。

================================================================================================
3.1
`router.query`
`query` は、ルーターオブジェクトから取得されるクエリーパラメータ（query parameter）を指します。
- `router.query` は、ルーターオブジェクトから現在のURLのクエリーパラメータを取得するためのプロパティです。バッ
クエンドのrailsのdeviseのconfirmのmail認証で、`confirmation_token=#{@token}`を送っている。
- クエリーパラメータは、URLに付与されたキーと値のペアで、通常は `?` の後にキーと値が続く形式で表現されます。
- `router.query['confirmation_token']` は、現在のURLのクエリーパラメータから `confirmation_token` とい
うキーに関連付けられた値を取得します。
- このコードの目的は、`confirmation_token` クエリーパラメータが存在するかどうかを確認することです。*/