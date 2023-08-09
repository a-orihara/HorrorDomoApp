import { FollowUser } from '../../../types/follow';
import { FollowListItem } from '../../molecules/listItem/FollowListItem';

type FollowListProps = {
  followUsers: FollowUser[];
  title: string;
  noFollowMessage: string;
};

// 1
export const FollowList = ({ followUsers, title, noFollowMessage }: FollowListProps) => {
  return (
    <div className='flex flex-1 flex-col bg-red-200'>
      <h1 className='mx-auto mb-2 mt-2 flex h-8 items-center justify-center text-2xl font-semibold  md:h-12 md:text-4xl'>
        {title}
      </h1>
      {!followUsers || followUsers.length === 0 ? (
        <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
          <p className='border-b-2 border-slate-200 text-base md:text-xl'>{noFollowMessage}</p>
        </div>
      ) : (
        <ol className='mb-4 flex flex-1 flex-col justify-around'>
          {followUsers.map((targetUser) => (
            <FollowListItem key={targetUser.id} targetUser={targetUser}></FollowListItem>
          ))}
        </ol>
      )}
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
. PostListがorganismsでFollowListがmoleculesに配置するのが適切な理由
PostListはPostListItemというmoleculesを複数回使う構造で、より複雑な構成を持っているためorganismsに相当します。
FollowListはFollowListItemを複数回使う構造であるため、moleculesに相当する可能性があります。
しかし、FollowList自体が複数の要素から構成され、より高い構造を持っている場合、organismsとしても考えることができ
ます。

. FollowListを/organisms/List/に配置するのは適切か、その理由
適切です。
根拠: FollowListの構造がPostListと類似しているため、同じディレクトリに配置する方が一貫性があり、理解しやすくなり
ます。
配置パス: frontend/front/src/components/organisms/List/FollowList.tsx
*/
