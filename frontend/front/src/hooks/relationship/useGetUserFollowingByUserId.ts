import { useCallback, useState } from 'react';
import { getUserFollowingByUserId } from '../../api/relationship';
import { FollowUser } from '../../types/relationship';

// ユーザーのフォローユーザーとその総数を取得するフック
// (userId: number | undefined)はrouter.queryからidを取得する為
export const useGetUserFollowingByUserId = (userId: number | undefined) => {
  // export const useGetUserFollowingByUserId = (userId: number) => {
  const [followingCount, setFollowingCount] = useState<number>();
  const [following, setFollowing] = useState<FollowUser[]>();

  const handleGetUserFollowingByUserId = useCallback(async () => {
    // console.log('handleGetUserFollowingが呼ばれました');
    try {
      const data = await getUserFollowingByUserId(userId);
      if (data.status == 200) {
        const followings: FollowUser[] = data.data.following;
        const count: number = data.data.followingCount;
        setFollowing(followings);
        setFollowingCount(count);
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  // 1 handleGetUserFollowingByUserId();
  return { followingCount, following, handleGetUserFollowingByUserId };
};
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
この関数は非同期的に実行され、その結果がステートに格納されます。
handleGetUserFollowingByUserId関数はAPIからのデータ取得を行うため、この関数をフック内で自動的に実行すると、
フックを使用するすべてのコンポーネントでAPIリクエストが発生します。これはパフォーマンスに影響を与える可能性がありま
す。
だからここでhandleGetUserFollowingByUserIdを実行しない。
APIリクエストのタイミングをコンポーネント側で制御する。
したがって、使う側のコンポーネントでhandleGetUserFollowingByUserIdをそのコンポーネントのuseEffect内で実行す
るべきです。
*/
