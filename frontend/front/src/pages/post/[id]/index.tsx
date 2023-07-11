// frontend/front/src/pages/posts/[id]/index.tsx

import Layout from '../../../components/layout/Layout';
import { PostDetailPage } from '../../../components/templates/PostDetailPage';

const PostDetail = () => {
  return (
    <Layout title='PostDetail'>
      <PostDetailPage></PostDetailPage>
    </Layout>
  );
};

export default PostDetail;
