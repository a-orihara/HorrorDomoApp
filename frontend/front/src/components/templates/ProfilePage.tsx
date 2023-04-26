import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserById } from '../../api/auth';
import { User } from '../../types';
import Layout from '../layout/Layout';
import Sidebar from '../organisms/Sidebar';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        const res = await getUserById(id as string);
        const fetchedUser: User = res.data;
        setUser(fetchedUser);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserData();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <Layout title='Profile'>
      <div className='flex  flex-1 flex-col bg-green-200'>
        <div className='flex h-full flex-row bg-blue-200'>
          <Sidebar></Sidebar>
          <div className='flex-1 '>
            <h1>Signed in successfully!</h1>
            <h2>Email: {user.email}</h2>
            <h2>Name: {user.name}</h2>
            <Image src='/favicon.png' alt={user.name} width={100} height={100} />

            <h1 className='text-blue-500'>*詳細は今後実装予定</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
