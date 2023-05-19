import EditPage from '../../../components/templates/EditPage';
import { useRedirectIfNotAuthorized } from '../../../hooks/useRedirectIfNotAuthorized';

// ================================================================================================
const Edit = () => {
  useRedirectIfNotAuthorized();

  // ================================================================================================
  return (
    <>
      <EditPage></EditPage>
    </>
  );
};

export default Edit;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
*/
