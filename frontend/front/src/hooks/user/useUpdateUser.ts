// frontend/front/src/hooks/user/useUpdateUser.ts
import { useRouter } from 'next/router';
import { useState } from 'react';
import { updateUser } from '../../api/user';
import { useAlertContext } from '../../contexts/AlertContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { AxiosError } from 'axios';

export const useUpdateUser = () => {
  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<string | null>(null);
  // 2.1
  const [avatar, setAvatar] = useState<File | null>(null);
  const { currentUser, handleGetCurrentUser } = useAuthContext();
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  const handleUpdateUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 1.1
    const formData = new FormData();
    // 1.2
    formData.append('name', name);
    // formData.append('email', email);
    formData.append('profile', profile || '');
    // 1.3
    if (avatar) {
      formData.append('avatar', avatar);
    }
    console.log(...formData.entries());

    try {
      const res = await updateUser(formData);
      if (res.status === 200) {
        // 1.4 更新後のユーザーを取得し直す
        handleGetCurrentUser();
        // console.log('%c handleGetCurrentUser後のUID:', 'color: red', Cookies.get('_uid'));
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

      // 3.1
      if (err instanceof AxiosError && err.response && typeof err.response.data.errors === 'object') {
        // axios-case-converterの為、full_messagesをfullMessagesへ変形
        const messages = err.response.data.errors.fullMessages
        // 3.2 オブジェクトの中のfull_messagesの中身の配列をfullMessagesに代入しているのでjoinが使える
        errorMessage = messages.join(', ');
      } else {
        setAlertMessage('サーバーへの接続に失敗しました');
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
    // email,
    // setEmail,
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
`const formData = new FormData();`
- ファイルをサーバに送信するために、フォームデータを作成するためのコードです。
- `FormData`は、HTMLフォームからデータを収集し、それを送信するためのキーと値のペアを保持するJavaScriptオブジェ
クトです。
- `const formData = new FormData();`と記述することで、空のフォームデータが作成されます。

================================================================================================
1.2
`formData.append('name', name);`
- フォームデータのオブジェクトにファイルデータを追加するためのコードです。
- `formData.append()`は、キーと値のペアをフォームデータオブジェクトに追加するメソッドです。
- 第1引数には、キーとして使用する文字列を指定します。
- 第2引数には、フォームデータの値として追加するデータを指定します。

================================================================================================
1.3
. **アバターだけが条件付きで処理される理由**：
- 条件処理`if (avatar) {...}`が使われるのは、でファイル（画像など）を扱うのは、名前やプロフィールのような単純な
テキストデータを扱うのとは異なるから。
- ファイルデータ、特に画像は単なるテキストではありません。それらはバイナリデータであり、特別な取り扱いが必要です。
このため、`FormData`にアバターファイルを追加する前に、アバターファイルが存在するかどうかのチェックが行われます。こ
れはファイルをサーバに正しくアップロードするために必要です。
- 一方、名前等は単純なテキストデータです。空でもテキストでも `FormData` に直接追加してサーバーに送信することがで
きます。
- さらに、一般的にファイルのアップロードを処理するには、ファイルが選択されているかどうかをチェックする必要がありま
す。ファイルとして `null` や `undefined` をアップロードしようとすると、エラーや意図しない動作を引き起こす可能性
があるから。

================================================================================================
1.4
handleUpdateUserでは、ユーザーを更新した直後に `handleGetCurrentUser()` が呼び出されます。これにより、
`render_update_success` によって返された更新されたユーザデータを直接には、フロントエンド使用されてない。余分な
サーバーリクエストが発生する可能性がありますが、データの一貫性を維持し、サーバーとクライアントの状態の不一致のリスク
を減らすという利点があります。

================================================================================================
2.1
JavaScriptの `File` タイプはファイルを表します。画像、ドキュメント、その他のファイルタイプなど、どのような種類の
ファイルでも構いません。File`オブジェクトは通常、ファイル名、サイズ、タイプ(例えば `image/jpeg`)、ファイルの内容
のようなプロパティを含んでいます。

================================================================================================
3.1
. **err instanceof AxiosError`**：
- この条件は、エラー `err` が `AxiosError` のインスタンスであるかどうかを確認します。Axios のエラーは、ネット
ワークエラーや サーバーからのエラー応答 (404 や 500 などのステータスコード) など、 Axios リクエストに問題がある
場合にスローされます。
------------------------------------------------------------------------------------------------
. **`&& err.response`**：
- この部分は `err` オブジェクトに `response` プロパティがあるかどうかを調べます。Axios のコンテキストでは、
`response` プロパティにはリクエストに対するサーバーの応答が含まれます。このプロパティは、サーバーが実際にエラース
テータスコードで応答した場合にのみ有効です。応答がない場合 (例えば、リクエストがサーバーに到達する前にネットワークの
問題で失敗した場合)、処理するエラー応答がないので、この条件はエラー処理ロジックの進行を妨げます。
------------------------------------------------------------------------------------------------
. **& typeof err.response.data.errors === 'object'`**：
- 最後に、この条件は `response` 内の `data` オブジェクトの `errors` プロパティが `object` 型であるかどうかを
チェックします。多くの API では、 `errors` プロパティはリクエストの何が問題だったのかについての詳細な情報を提供す
るために使用される。これは単純なメッセージ文字列であったり、エラー文字列の配列であったり、より一般的にはエラーの詳細
を含むオブジェクトであったりする。errors` がオブジェクトであるかどうかをチェックすることで、エラーの詳細がオブジェ
クト形式で提供される構造化されたエラーレスポンスを予期していることになります。これにより、このオブジェクトのキーに基
づいて特定のエラーメッセージを表示するなど、より洗練されたエラー処理が可能になります。
------------------------------------------------------------------------------------------------
- `err.response.data.errors`から `fullMessages` を抽出して、エラーメッセージとして表示するための1つの文字列
に結合しようとしています。もし `fullMessages` が存在しなかったり、直接アクセスできなかったりした場合は、 `errors`
オブジェクトを平坦化し、結果のメッセージを結合します。

================================================================================================
3.2
- messages はエラーメッセージの配列を指します。この配列には、サーバーから返された検証エラーや他の種類のエラーメッ
セージが含まれている。
- .join(', ') メソッドは、配列の各要素を指定された文字列（この場合はコンマとスペース）で連結し、一つの文字列にし
ます。
*/
