// frontend/front/src/hooks/useToggleFeed.ts
import { useState } from 'react';

export const useToggleFeed = () => {
  const [showLikedPostArea, setShowLikedPostArea] = useState(false);

  const toggleFeed = () => {
    setShowLikedPostArea(!showLikedPostArea);
  };

  return { showLikedPostArea, toggleFeed };
};
