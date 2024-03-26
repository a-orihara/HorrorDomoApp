import Layout from '../../components/layout/Layout';
import { PostFormPage } from '../../components/templates/PostFormPage';
import { useRedirectIfNotAuthorized } from '../../hooks/useRedirectIfNotAuthorized';

const NewPost = () => {
  useRedirectIfNotAuthorized();
  return (
    <Layout title='Post Form'>
      <PostFormPage></PostFormPage>
    </Layout>
  );
};

export default NewPost;
