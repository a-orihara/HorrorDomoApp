// frontend/front/src/pages/posts/[id]/index.tsx

import { useRouter } from 'next/router';
import React from 'react';

const PostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Post Detail - {id}</h1>
      {/* ここに各postの詳細情報を表示します */}
    </div>
  );
};

export default PostDetail;
