// frontend/front/src/pages/posts/new.tsx

import Layout from '../../components/layout/Layout';
import { PostFormPage } from '../../components/templates/PostFormPage';

const NewPost = () => {
  return (
    <Layout title='Post Form'>
      <PostFormPage></PostFormPage>
    </Layout>
  );
};

export default NewPost;
