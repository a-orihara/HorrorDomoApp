// import Image from 'next/image';
import { User } from '../../types/user';
type UserInfoProps = {
  user: User;
  // avatarUrl: string | null;
};

const UserInfo = ({ user }: UserInfoProps) => {
  // console.log(`UserInfoの${JSON.stringify(user)}`);
  return (
    <div className='flex-1'>
      {/* 1 */}
      <img
        src={user.avatarUrl || '/no_image_square.jpg'}
        alt='User Avatar'
        width='100'
        height='100'
        style={{ objectFit: 'cover', objectPosition: 'top left' }}
      />
      <h2>Name: {user.name}</h2>
      <h2>Email: {user.email}</h2>
      <h2>Profile: {user.profile || 'profileは設定されていません。'}</h2>
      {/* {avatarUrl && <Image src={avatarUrl} alt='User Avatar' width={200} height={200} />} */}
      <h1 className='text-blue-500'>*詳細は今後実装予定</h1>
    </div>
  );
};

export default UserInfo;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
指定したサイズとクロッピングで画像を表示するためには、imgタグにwidthとheightの属性を設定し、object-fit: coverと
object-position: top leftのスタイルを適用します。
画像のクロッピングとは、画像を指定した領域内に切り抜くことを指します。
objectFit: 'cover':
画像のアスペクト比を維持しつつ、指定した領域に画像をピッタリとフィットさせることを意味します。
objectPosition: 'top left':
画像を領域内での位置を指定します。top leftは、画像を領域の左上に配置することを意味します。
*/
