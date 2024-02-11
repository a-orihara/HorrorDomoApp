import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAlertContext } from '../contexts/AlertContext';
import { useAuthContext } from '../contexts/AuthContext';

// ログインしていない場合は、ログインページにリダイレクトするカスタムフック
export const useRedirectIfNotAuthorized = () => {
  const router = useRouter();
  const { currentUser, loading } = useAuthContext();
  const { setAlertOpen, setAlertSeverity, setAlertMessage } = useAlertContext();
  // ------------------------------------------------------------------------------------------------
  console.log(`useRedirectIfNotAuthorizedのカレントユーザー:${JSON.stringify(currentUser)}`);

  // 1 サインインしていない場合はサインインページ、サインイン済みでも他ユーザーならユーザーのホームページへリダイレ
  // クトする
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        setAlertSeverity('error');
        setAlertMessage('ログインしてください');
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/signin');
        }, 1000);
      }
      // 2 URLクエリパラメータがあるかと、currentUser（ユーザーがサインインしているか）の二つをチェクし、処理を実行
      else if (typeof router.query.id === 'string' && currentUser?.id !== parseInt(router.query.id)) {
        setAlertSeverity('error');
        setAlertMessage('他のユーザーの編集ページにアクセスすることはできません');
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    }
  }, [currentUser, router, setAlertMessage, setAlertOpen, setAlertSeverity, loading]);
};

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
================================================================================================
2
router.query.idはstring | string[] | undefinedの型を持っています。
parseInt関数はstring型の引数を期待しています。
router.query.idが存在しない場合、parseInt関数にはundefinedが渡されます。
このままだとエラーになるので、2のように'string'の場合でIDが合わない場合にのみ処理するよう記載。
------------------------------------------------------------------------------------------------
このフックでは、Next.jsのルーティングシステムの一部である`router.query.id`を含む条件チェックが行われます。なぜ
なら、URLのクエリパラメータは未定義、単一の文字列（1つのパラメータ）、または文字列の配列（URL内で同じパラメータが
複数回使用されている場合）だからです。
------------------------------------------------------------------------------------------------
typeof router.query.id === 'string' && currentUser?.id !== parseInt(router.query.id)`の条件チェッ
クは、以下の2つの条件が満たされた場合にのみアクションを実行するように設計されています
- `typeof router.query.id === 'string'` は、`router.query.id` が本当に単一の文字列であることを保証する。
これは `parseInt` 関数が文字列引数を想定しているために必要である。もし `router.query.id` が `undefined` ま
たは文字列の配列の場合、それを `parseInt` に直接渡すと、JavaScript のエラーまたは不正な動作になる。
- `currentUser?.id !== parseInt(router.query.id)` は、現在のユーザのIDがURLクエリパラメータのIDと一致し
ないかどうかをチェック。currentUser?.id`は、ユーザがログインしていない場合に`undefined`になる可能性のある
`currentUser`の`id`に安全にアクセスするために、オプションのチェインを使用します。parseInt(router.query.id)`
は、URLのクエリ文字列から `id` を整数に変換して比較します。この条件により、ユーザーが自分のユーザーIDとは異なる
ユーザーIDを必要とするページにアクセスしようとしているときにのみ、アクションが実行されることが保証されます。
- これらの条件を組み合わせることで、リダイレクトとエラーメッセージは、ログインしているユーザーがURLの`id`によって
識別される別のユーザーの編集ページにアクセスしようとしたときにのみ発生し、`id`は1つの文字列として正しくフォーマット
されます。
------------------------------------------------------------------------------------------------
parseInt
文字列を整数に変換するJavaScriptの組み込み関数。
------------------------------------------------------------------------------------------------
!==
厳密な不等号演算子（strict inequality operator）です。この演算子は、2つの値が等しくない場合にtrueを返し、等し
い場合にfalseを返します。
具体的には、currentUser?.id !== parseInt(router.query.id)は、currentUserオブジェクトのidプロパティの値と
router.query.idの値が等しくない場合に条件が成立します。異なる値であれば、trueとなります。
!==演算子は、値の型と値の両方を比較するため、型変換を行わずに厳密な比較を行います。例えば、数値と文字列を比較する場
合、型が異なるため必ず異なると判定されます。
なお、!==演算子の反対の意味で、2つの値が等しい場合にtrueを返す演算子が===（厳密な等号演算子）です。
------------------------------------------------------------------------------------------------
typeof演算子
渡された値の型を文字列で返すJavaScriptの演算子。
例
console.log(typeof "Hello, world!"); // "string"
console.log(typeof 123); // "number"
console.log(typeof true); // "boolean"
*/
