import type { NextPage } from 'next';
import Layout from '../components/layout/Layout';
import { TestMovie } from '../components/molecules/TestMovie';
import HomePage from '../components/templates/HomePage';

const Home: NextPage = () => {
  // ------------------------------------------------------------------------------------------------
  return (
    <Layout title='Home'>
      <HomePage></HomePage>
      <TestMovie></TestMovie>
    </Layout>
  );
};

export default Home;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1


*/
