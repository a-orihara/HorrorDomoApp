import { useRouter } from 'next/router';
import FollowingPage from '../../../components/templates/FollowingPage';

const Following = () => {
  const router = useRouter();
  const { id } = router.query;
  if (id === undefined) {
    return null;
  }
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  return (
    <div>
      <FollowingPage userId={userId}></FollowingPage>
    </div>
  );
};

export default Following;
