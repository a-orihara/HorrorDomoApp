import Modal from 'react-modal';
import { useAlertContext } from '../../contexts/AlertContext';

// 1
const AlertMessage = () => {
  // AlertContextからalertOpen, setAlertOpen, alertSeverity, alertMessageを受け取る
  const { alertOpen, setAlertOpen, alertSeverity, alertMessage } = useAlertContext();

  // 3 メッセージ（モーダル）を閉じる。setOpenをfalseにする関数
  const handleCloseAlertMessage = () => {
    setAlertOpen(false);
  };

  // 2 severityに応じて背景色を変更する
  const backgroundColor = () => {
    switch (alertSeverity) {
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

  // ------------------------------------------------------------------------------------------------
  return (
    // 4
    <Modal
      // isOpen:モーダルの表示状態を管理する真偽値
      isOpen={alertOpen}
      // onRequestClose:モーダルを閉じるための関数
      onRequestClose={handleCloseAlertMessage}
      className={`mx-auto mt-10 w-full rounded-lg px-8 py-6 text-center text-white md:mt-24 md:w-auto md:max-w-md ${backgroundColor()} shadow-md`}
      // overlayClassName:モーダルの背景を設定するためのクラス名
      overlayClassName='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-6'
    >
      <div className='flex flex-col items-center justify-center'>
        <h2 className='mb-4 font-spacemono text-2xl md:text-3xl'>{alertMessage}</h2>
        <button
          onClick={handleCloseAlertMessage}
          className='mt-4 rounded-lg bg-white px-4 py-2 text-lg font-semibold text-gray-800 shadow-md transition-colors duration-300 hover:bg-gray-100 md:mt-6 md:px-6 md:py-3 md:text-xl'
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default AlertMessage;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
open プロパティは、表示状態を管理する真偽値を定義します。
------------------------------------------------------------------------------------------------
setOpen プロパティは、表示状態を設定するための関数を定義します。
------------------------------------------------------------------------------------------------
severity プロパティは、アラートの重要度を示す文字列を定義します。
severity:重大度という意味。
ここでは、'error', 'success', 'info', 'warning' の4つの文字列しか許容されておらず、それ以外の文字列は許容さ
れていません。
これにより、アラートの重要度に誤った値が渡された場合、コンパイル時にエラーが発生するため、バグを未然に防ぐことがで
きます。
それぞれエラー、成功、情報、警告を表します。これにより、アラートの重要度を簡単に理解しやすくなります。
他の文字列でも構いませんが、'error', 'success', 'info', 'warning' は、一般的によく使われるアラートの重要度
を表す文字列の一部です。ただし、アラートの目的に応じて適切な文字列を使用する必要があります。例えば、質問フォームで
のエラーは error、アクションの成功時は success、通知メッセージは info など、目的に合わせて適切な文字列を選ぶよ
うにしましょう。
------------------------------------------------------------------------------------------------
message プロパティは、アラートに表示されるメッセージの文字列を定義します。

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
4
isOpen
<Modal>の特有のプロパティの一つで、モーダルの表示状態を制御するために使用します。isOpenの値がtrueであればモーダ
ルが表示され、falseであれば非表示になります。

onRequestClose
モーダルが閉じるべきときに呼び出される関数を指定するプロパティです。
例えば、モーダルの外側をクリックしたときや、キーボードのEscキーを押したときに呼び出されます。
モーダルの外側をクリックしたりEscキーを押すと、handleCloseAlertMessage(モーダルを閉じる)が実行されます。

overlayClassName
<Modal>の特有のプロパティの一つで、モーダルの背景のスタイルを設定するために使用します。overlayClassNameで指定し
たスタイルが、モーダルが表示された際に背景として適用されます。overlayClassName に指定されたクラス名は、モーダル
背景オーバーレイ要素に適用されます。

================================================================================================
5
useEffectフックは、Reactコンポーネントがレンダリングされた後に実行される副作用を設定するために使用されます。この
コードでは、modalIsOpenの状態をopenプロパティと同期させるためにuseEffectフックが使用されています。[open]は
useEffectの第2引数であり、openプロパティが変更されたときに副作用をトリガーするように設定しています。

この処理の意図は、ErrorMessageコンポーネントに渡されるopenプロパティが変更されたときに、modalIsOpenの状態を更
新することで、モーダルの開閉状態を反映させることです。

================================================================================================
6
backgroundColor はカスタムフック useAlertMessage の中で定義した関数として返ります。まずここで、
useAlertMessageは、引数 severityを受け取っています。
severity が error の場合、 backgroundColor 関数は文字列 'bg-red-500' を返す関数となります。これは
useAlertMessage フック内の switch ステートメントにおいて、 severity が error の場合に 'bg-red-500' を返す
ように定義されているからです。

backgroundColor 関数自体は引数を取らずに severity の値に基づいて色を決定する関数となっている点に注意です。
つまり、「useAlertMessage関数の、引数severityに基づいて挙動が決まる関数」です。

------------------------------------------------------------------------------------------------
handleCloseAlertMessageは、引数で受け取ったsetOpenに入った関数にfalseをセットする（falseの結果にする）。
------------------------------------------------------------------------------------------------
modalIsOpenは、molalの表示状態の初期値。
@          @@          @@          @@          @@          @@          @@          @@          @
useAlertContext()でリファクタリング前
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
type AlertMessageProps = {
  // open:molalの表示状態を管理する真偽値を定義
  open: boolean;
  // setOpen:表示状態を設定するための関数を定義
  setOpen: (isOpen: boolean) => void;
  // severity:アラートの重要度を示す文字列を定義
  severity: 'error' | 'success' | 'info' | 'warning';
  // message:アラートに表示するメッセージを定義
  message: string;
};
------------------------------------------------------------------------------------------------
const AlertMessage = ({ open, setOpen, severity, message }: AlertMessageProps) => {
------------------------------------------------------------------------------------------------
6 カスタムフック。useAlertMessageに引数として、open, setOpen, severityを渡し、その結果のオブジェクトを受ける。
const { modalIsOpen, backgroundColor, handleCloseAlertMessage } = useAlertMessage({ open, setOpen, severity });
*/
