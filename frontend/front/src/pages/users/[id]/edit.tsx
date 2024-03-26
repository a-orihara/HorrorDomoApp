import Layout from '../../../components/layout/Layout';
import EditPage from '../../../components/templates/EditPage';
import { useRedirectIfNotAuthorized } from '../../../hooks/useRedirectIfNotAuthorized';

const Edit = () => {
  useRedirectIfNotAuthorized();

  return (
    <Layout title='EDIT'>
      <EditPage></EditPage>
    </Layout>
  );
};

export default Edit;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
*/
