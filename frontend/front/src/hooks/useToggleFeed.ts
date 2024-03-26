import { useState } from 'react';

// FeedとLikedPostAreaの表示切替のカスタムフック
export const useToggleFeed = () => {
  // FeedとLikedPostAreaの表示切替の状態変数。trueだとLikedPostAreaを表示
  const [showLikedPostArea, setShowLikedPostArea] = useState(false);

  // FeedとLikedPostAreaの表示切替の関数
  const toggleFeed = () => {
    // FeedとLikedPostAreaの表示切替の状態変数:showLikedPostAreaを反転
    setShowLikedPostArea(!showLikedPostArea);
  };

  return { showLikedPostArea, toggleFeed };
};
