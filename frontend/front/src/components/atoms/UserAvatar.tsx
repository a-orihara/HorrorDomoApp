import Link from 'next/link';

type UserAvatarProps = {
  avatarUrl: string | null;
  userId: number;
};

const UserAvatar = ({ avatarUrl, userId }: UserAvatarProps) => (
  <div className='mx-4'>
    <Link href={`/users/${userId}`}>
      <a>
        <img
          src={avatarUrl || '/no_image_square.jpg'}
          alt='user avatar'
          className='mt-2 h-8 w-8 rounded-full md:h-16 md:w-16'
        />
      </a>
    </Link>
  </div>
);

export default UserAvatar;
