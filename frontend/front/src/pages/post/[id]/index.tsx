// frontend/front/src/pages/posts/[id]/index.tsx

import Layout from '../../../components/layout/Layout';
import { PostDetail } from '../../../components/molecules/PostDetail';

const PostDetailPage = () => {
  return (
    <Layout title='PostDetail'>
      <PostDetail></PostDetail>;
    </Layout>
  );
};

export default PostDetailPage;
