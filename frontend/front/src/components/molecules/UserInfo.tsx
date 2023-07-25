// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from '../../types/user';
import FollowStats from '../molecules/FollowStats';
type UserInfoProps = {
  user: User;
  postsCount: number | undefined;
  // avatarUrl: string | null;
};

const UserInfo = ({ user, postsCount }: UserInfoProps) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(`UserInfoのid: ${id}`);
  const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined;
  // console.log(`UserInfoの${JSON.stringify(user)}`);
  return (
    // <div className='flex h-full flex-row justify-around rounded-xl border bg-orange-200 p-4 shadow-md md:p-5 lg:flex-col'></div>
    <div className='flex h-full flex-col rounded-xl border bg-orange-200 shadow-md md:p-5'>
      <div>
        <h1 className='mb-2 mt-2 rounded-md text-center text-sm  tracking-wide md:text-2xl  lg:mb-6 lg:mt-4 lg:tracking-widest'>
          Profile
        </h1>
      </div>
      <div className='flex flex-row justify-evenly lg:mb-4 lg:mt-4'>
        {/* 1 */}
        <img
          src={user.avatarUrl || '/no_image_square.jpg'}
          alt='User Avatar'
          width='160'
          height='160'
          style={{ objectFit: 'cover', objectPosition: 'top left' }}
          className='mb-2 h-1/6 w-1/6 rounded-full bg-green-100 lg:h-24 lg:h-full lg:w-24 lg:w-full'
        />

        <h2 className='mb-2  ml-2 flex items-center justify-center bg-slate-200 text-sm md:text-xl lg:text-lg lg:tracking-wide'>
          {user.name}
        </h2>
      </div>
      <FollowStats userId={userId}></FollowStats>

      <div>
        <h2 className='mb-2 text-xs md:text-base lg:mb-4'>{user.profile || 'profileは設定されていません。'}</h2>
      </div>

      <div>
        <h2 className='mb-2 text-center text-xs md:text-base lg:mb-4'>総投稿数: {postsCount || 0}</h2>
      </div>

      <div>
        <Link href={'/post/new'}>
          <a className='mb-2  flex items-center justify-center rounded-lg border-2  bg-slate-500 text-xl font-semibold hover:cursor-pointer hover:text-basic-pink lg:text-2xl'>
            投稿を作成する
          </a>
        </Link>
      </div>
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
