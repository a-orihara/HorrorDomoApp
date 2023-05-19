// frontend/front/src/hooks/useFirstTimeLogin.ts
import { useEffect, useState } from 'react';

// 初回ログイン時のみ表示するメッセージを表示するかどうかの状態を返す
const useFirstTimeLogin = () => {
  // 初回ログイン時のみ表示するメッセージを表示するかどうかの状態
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // ログイン後に、初回ログイン時のみ表示するメッセージを表示する
  useEffect(() => {
    // ログイン後に、初回ログイン時のみ表示するメッセージを表示する
    if (localStorage.getItem('firstTimeLogin') === 'true') {
      // ログイン後に、初回ログイン時のみ表示するメッセージを表示する
      setShowWelcomeMessage(true);
      // 今後、初回ログイン時のメッセージを表示しないようにする
      localStorage.removeItem('firstTimeLogin');
    }
  }, []);

  return { showWelcomeMessage };
};

export default useFirstTimeLogin;
