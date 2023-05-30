import type { NextPage } from 'next';
import Layout from '../components/layout/Layout';
import HomePage from '../components/templates/HomePage';

const Home: NextPage = () => {
  // const { isSignedIn, currentUser } = useContext(AuthContext);
  // ------------------------------------------------------------------------------------------------
  return (
    <Layout title='Home'>
      <HomePage></HomePage>
    </Layout>
  );
};

export default Home;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1


*/
