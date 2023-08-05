import { useState } from 'react';

export const useToggleFeed = () => {
  const [showLikedPost, setShowLikedPost] = useState(false);

  const toggleFeed = () => {
    setShowLikedPost(!showLikedPost);
  };

  return {
    showLikedPost,
    toggleFeed,
  };
};
