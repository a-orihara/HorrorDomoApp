// frontend/front/src/hooks/usePostSearchForm.ts
import { useState } from 'react';

type UsePostSearchFormProps = {
  // enterQuery(入力語句)をSearchQuery(検索語句)にセットする。検索語句は親(Home)を通して、SearchedPostAreaに渡る。
  setSearchQuery: (query: string) => void;
  // IsSearchActive(検索postを表示するかどうかを決める)をセットする関数
  setIsSearchActive: (isActive: boolean) => void;
};

// Home（親）の`setSearchQuery`, `setIsSearchActive`を引数に取ってコンポーネントで使用
export const usePostSearchForm = ({ setSearchQuery, setIsSearchActive }: UsePostSearchFormProps) => {
  // 入力語句を管理する状態
  const [enterQuery, setEnterQuery] = useState('');

  // formのinputでenterキーを押すと発火。検索アイコン以外でも発火するようにする。
  const handleSubmit = (e: React.FormEvent) => {
    // 2
    e.preventDefault();
    handleSearchClick();
  };

  // 検索アイコンを押すと発火。入力語句を検索語句に代入、検索状態をアクティブ(true)にする
  const handleSearchClick = () => {
    // 入力語句を検索語句に代入
    setSearchQuery(enterQuery);
    // 検索状態をアクティブ(true)。親(Home)に通知。
    setIsSearchActive(true);
  };

  // 戻るボタンを押すと発火
  const handleBackClick = () => {
    // 検索状態を非アクティブ(false)。結果としてSearchedPostAreaを非表示。
    setIsSearchActive(false);
    // 検索語句を空
    setSearchQuery('');
    // 入力語句を空（戻るを押しても入力欄に語句が残ったままにしない為）
    setEnterQuery('');
  };

  return {
    enterQuery,
    setEnterQuery,
    handleSubmit,
    handleSearchClick,
    handleBackClick,
  };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
2
.e.preventDefault()は具体的に何をするのですか？
e.preventDefault()メソッドは、HTML要素のデフォルトの動作を阻止します。JavaScriptでは、eはeventを表すことが多
く、ハンドラのトリガーとなったイベントを表すオブジェクトです。
あなたのコードでは、e.preventDefault()は、フォームが送信されたときに発生するhandleSubmit関数内で使用されていま
す。デフォルトでは、フォームを送信するとページがリロードされますが、e.preventDefault() はこの動作を停止し、ペー
ジがリロードされないようにします。
------------------------------------------------------------------------------------------------
.e.preventDefault()は具体的にどのような誤動作を防ぐのでしょうか？
意図しないページのリロード： e.preventDefault()が防ぐ主な誤動作は、フォームが送信されたときにページがリロードさ
れることです。リロードはウェブアプリケーションの流れを中断させ、パフォーマンスに不必要な負担をかける可能性があります。

*/