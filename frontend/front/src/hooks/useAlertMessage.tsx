import { useEffect, useState } from 'react';
// 1
type UseAlertMessageProps = {
  // open:molalの表示状態を管理する真偽値を定義
  open: boolean;
  // setOpen:表示状態を設定するための関数を定義
  setOpen: (isOpen: boolean) => void;
  // severity:アラートの重要度を示す文字列を定義
  severity: 'error' | 'success' | 'info' | 'warning';
  // message:アラートに表示するメッセージを定義
};

export function useAlertMessage({ open, setOpen, severity }: UseAlertMessageProps) {
  // モーダルの表示/非表示を管理するためのuseStateを定義
  const [modalIsOpen, setModalOpen] = useState<boolean>(open);

  // 5 モーダルの表示をopenの値(true/false)に合わせて変更する
  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  // 2 severityに応じて背景色を変更する
  const backgroundColor = () => {
    switch (severity) {
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 3 モーダルを閉じる。setOpenをfalseにする関数
  const handleCloseAlertMessage = () => {
    setOpen(false);
  };

  // return {
  //   modalIsOpen: modalIsOpen,
  //   backgroundColor: backgroundColor,
  //   handleCloseAlertMessage: handleCloseAlertMessage,
  // };
  return { modalIsOpen, backgroundColor, handleCloseAlertMessage };
}
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
severity:重大度

*open プロパティは、表示状態を管理する真偽値を定義します。
*setOpen プロパティは、表示状態を設定するための関数を定義します。
*severity プロパティは、アラートの重要度を示す文字列を定義します。
ここでは、'error', 'success', 'info', 'warning' の4つの文字列しか許容されておらず、それ以外の文字列は許容さ
れていません。
これにより、アラートの重要度に誤った値が渡された場合、コンパイル時にエラーが発生するため、バグを未然に防ぐことがで
きます。
それぞれエラー、成功、情報、警告を表します。これにより、アラートの重要度を簡単に理解しやすくなります。
他の文字列でも構いませんが、'error', 'success', 'info', 'warning' は、一般的によく使われるアラートの重要度
を表す文字列の一部です。ただし、アラートの目的に応じて適切な文字列を使用する必要があります。例えば、質問フォームで
のエラーは error、アクションの成功時は success、通知メッセージは info など、目的に合わせて適切な文字列を選ぶよ
うにしましょう。
*message プロパティは、アラートに表示されるメッセージの文字列を定義します。

================================================================================================
2
propsとして渡されたアラートの重要度に応じて、背景色を決定する関数です。アラートの重要度は、propsとして渡された
'severity'という文字列で指定されており、それに応じて適切な背景色を返します。
アラートコンポーネントが、アラートの種類に応じた背景色を持つようにすることです。これにより、ユーザーがアラートの種
類を直感的に理解しやすくなります。

================================================================================================
3
handleCloseAlertMessageは、引数で受け取ったsetOpenに入った関数にfalseをセットする（falseの結果にする）。
setOpenで受け取った関数にfalseを設定して実行する。これにより、アラートを閉じることができます。

================================================================================================
5
useEffectフックは、Reactコンポーネントがレンダリングされた後に実行される副作用を設定するために使用されます。この
コードでは、modalIsOpenの状態をopenプロパティと同期させるためにuseEffectフックが使用されています。[open]は
useEffectの第2引数であり、openプロパティが変更されたときに副作用をトリガーするように設定しています。

この処理の意図は、ErrorMessageコンポーネントに渡されるopenプロパティが変更されたときに、modalIsOpenの状態を更
新することで、モーダルの開閉状態を反映させることです。

------------------------------------------------------------------------------------------------
useEffectは、openプロパティが変更されたときに、その変更をmodalIsOpen状態に反映させるためにあります。
useStateで初期化されたmodalIsOpenは、その初期化時点でのopenの値（useState<boolean>(open);）を保持します。
しかし、openの値が後から変わったとしても、その変化はmodalIsOpenに自動的には反映されません。
そのため、openの値が変わったときにmodalIsOpenもそれに合わせて変わるようにするためには、useEffectを使用してopen
の変更を監視し、その変更をmodalIsOpenに反映させる必要があります。
たとえば、外部からopenがtrueからfalseに変更されたとき、このuseEffectがなければmodalIsOpenは初期化時の値true
を保持したままになり、その結果としてモーダルは開いたままになってしまいます。
しかし、このuseEffectがあることでopenがfalseに変わったときにmodalIsOpenもfalseになり、モーダルは閉じることが
できます。
このように、Reactでは親コンポーネントから渡されたpropsの値の変更を子コンポーネントの状態に反映させるためには、通
常useEffectを使用します。

Reactのコンポーネント内で定義されたstateは、そのコンポーネント内でのみ管理されます。
そして、useStateフックは初回のレンダリング時にのみ初期値を設定し、その後は値が変更されない限り再度初期化されませ
ん。
そのため、親コンポーネントのstateが変わったとしても、それをpropsとして自身のstateで受け取る子コンポーネントの
stateに直接影響を与えることはありません。
子コンポーネントのstateが親コンポーネントから渡されたpropsの値の変化に追従するようにするためには、Reactの
useEffectフックを使うのが一般的です。
Reactコンポーネント内でステートが変更されると、そのコンポーネントは再レンダリングされます。
*/
