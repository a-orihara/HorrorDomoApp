// import Image from 'next/image';
import { User } from '../../types';
type UserInfoProps = {
  user: User;
  avatarUrl: string | null;
};
const UserInfo = ({ user, avatarUrl }: UserInfoProps) => {
  return (
    <div className='flex-1'>
      <h2>Name: {user.name}</h2>
      <h2>Email: {user.email}</h2>
      <h2>Profile: {user.profile || 'profileは設定されていません。'}</h2>
      {avatarUrl && <img src={avatarUrl} alt='User Avatar' />}
      {/* {avatarUrl && <Image src={avatarUrl} alt='User Avatar' width={200} height={200} />} */}
      <h1 className='text-blue-500'>*詳細は今後実装予定</h1>
    </div>
  );
};

export default UserInfo;
