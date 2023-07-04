// import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../types/user';
type UserInfoProps = {
  user: User;
  postsCount: number | undefined;
  // avatarUrl: string | null;
};

const UserInfo = ({ user, postsCount }: UserInfoProps) => {
  console.log(`UserInfoの${JSON.stringify(user)}`);
  return (
    <div>
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
      <h2>総投稿数: {postsCount || 0}</h2>
      <Link href={'/post/new'}>
        <a className='hover:text-basic-pink'>投稿する</a>
      </Link>
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
