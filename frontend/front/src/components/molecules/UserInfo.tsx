// import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../types/user';
import FollowStats from '../molecules/FollowStats';
type UserInfoProps = {
  user: User;
  postsCount: number | undefined;
};

const UserInfo = ({ user, postsCount }: UserInfoProps) => {
  // console.log(`UserInfoの${JSON.stringify(user)}`);
  return (
    <div className='flex h-full flex-col rounded-xl border bg-orange-200 shadow-md md:p-5'>
      <section>
        <h1 className='mb-2 mt-2 rounded-md text-center text-sm  tracking-wide md:text-2xl  lg:mb-6 lg:mt-4 lg:tracking-widest'>
          Profile
        </h1>
      </section>

      <section className='flex flex-row justify-evenly lg:mb-4 lg:mt-4'>
        {/* 1 */}
        <img
          src={user.avatarUrl || '/no_image_square.jpg'}
          alt='User Avatar'
          width='160'
          height='160'
          style={{ objectFit: 'cover', objectPosition: 'top left' }}
          className='mb-2 h-1/6 w-1/6 rounded-full bg-green-100 lg:h-36  lg:w-36'
          // className='mb-2 flex-1 rounded-full bg-green-100'
        />
        {/* 2 */}
        <h2 className='mb-2 ml-2  flex items-center justify-center break-all text-sm md:text-xl lg:text-lg lg:tracking-wide'>
          {user.name}
        </h2>
      </section>

      <FollowStats userId={user.id}></FollowStats>

      <section>
        <h2 className='mb-2 break-all text-xs md:text-base lg:mb-4'>
          {user.profile || 'profileは設定されていません。'}
        </h2>
      </section>

      <section>
        <h2 className='mb-2 text-center text-xs md:text-base lg:mb-4'>総投稿数: {postsCount || 0}</h2>
      </section>

      <section>
        <Link href={'/post/new'}>
          <a className='mb-2  flex items-center justify-center rounded-lg border-2  bg-slate-500 text-xl font-semibold hover:cursor-pointer hover:text-basic-pink lg:text-2xl'>
            投稿を作成する
          </a>
        </Link>
      </section>
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

================================================================================================
2
break-wordsだと日本語は折り返すが、英語は折り返さない。
break-allに変更すると、英語の単語でも途中で改行が行われ、コンテナから文字列が溢れ出ることを防ぐことができます。
*/
