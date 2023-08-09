// frontend/front/src/pages/posts/[id]/index.tsx

import Layout from '../../../components/layout/Layout';
import { PostDetailPage } from '../../../components/templates/PostDetailPage';
// 1
const PostDetail = () => {
  return (
    <Layout title='PostDetail'>
      <PostDetailPage></PostDetailPage>
    </Layout>
  );
};

export default PostDetail;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
PostDetailについて:
配置場所: pages
理由: PostDetailは具体的なページを表し、テンプレートとしてのPostDetailPageを使用してページ全体を構築しています。
具体的なページのエントリーポイントとなるため、pagesに配置するのが適切です。
*/
