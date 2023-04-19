import React from 'react';
import Layout from '../components/layout/Layout';
import UserForm from '../components/molecules/UserForm';
import Sidebar from '../components/organisms/Sidebar';

const SettingsPage: React.FC = () => {
  return (
    <Layout title='Settings'>
      <div className='flex'>
        <Sidebar />
        <div className='p-4'>
          <h1 className='text-xl font-bold'>Settings</h1>
          <UserForm></UserForm>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
