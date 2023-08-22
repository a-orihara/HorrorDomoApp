// import Image from 'next/image';
import { User } from '../../types/user';
import FollowStats from '../molecules/stats/FollowStats';
import { LikeStats } from '../molecules/stats/LikeStats';
type UserInfoProps = {
  user: User;
  postsCount: number | undefined;
  // FeedとLikedPostAreaの表示切替を行う関数。
  toggleFeed: () => void;
  showLikedPostArea: boolean;
};

const UserInfo = ({ user, postsCount, toggleFeed, showLikedPostArea }: UserInfoProps) => {
  // console.log(`UserInfoの${JSON.stringify(user)}`);
  // console.log(`UserInfoのshowLikedPostAreaは、${showLikedPostArea}`);
  return (
    <div className='flex  flex-col rounded-xl border bg-basic-yellow shadow-md md:p-1'>
      <section className='rounded-full bg-basic-beige'>
        <h1 className='mb-2 mt-2 rounded-md text-center text-sm  tracking-wide text-basic-green  md:text-2xl lg:mb-6 lg:mt-4 lg:tracking-widest'>
          User Info
        </h1>
      </section>

      <div className='flex flex-row justify-evenly lg:mb-4 lg:mt-4'>
        {/* 1 */}
        <img
          src={user.avatarUrl || '/no_image_square.jpg'}
          alt='User Avatar'
          width='160'
          height='160'
          style={{ objectFit: 'cover', objectPosition: 'top left' }}
          className='mb-2 h-16 w-16 rounded-full bg-green-100 lg:h-36  lg:w-36'
        />
        {/* 2 */}
        <section className='flex flex-col'>
          <h1 className='flex items-center justify-center break-all  text-xs text-basic-green md:text-lg lg:text-base lg:tracking-wide'>
            Name:
          </h1>
          <p className='mb-2  ml-2 flex flex-1 items-center justify-center break-all text-sm md:text-xl lg:text-lg lg:tracking-wide'>
            {user.name}
          </p>
        </section>
      </div>

      <div className='flex flex-row justify-evenly lg:mb-4 lg:mt-4'>
        <FollowStats userId={user.id}></FollowStats>
        {/* // toggleFeed:FeedとLikedPostAreaの表示切替を行う関数。 */}
        <LikeStats userId={user.id} toggleFeed={toggleFeed} showLikedPostArea={showLikedPostArea}></LikeStats>
      </div>

      <section className='mb-2 flex flex-col rounded-md bg-basic-beige px-2'>
        <h1 className='mb-2 flex items-center justify-center break-all text-xs text-basic-green md:text-lg lg:text-base lg:tracking-wide'>
          Profile:
        </h1>
        <p className='mb-4 break-all text-xs md:text-lg lg:mb-4'>{user.profile || 'profileは設定されていません。'}</p>
      </section>

      <section>
        <h2 className='mb-2 text-center text-xs text-basic-green md:text-base'>総投稿数: {postsCount || 0}</h2>
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
