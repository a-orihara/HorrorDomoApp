import { useCallback, useState } from 'react';
import { getFollowingCountByUserId } from '../../api/relationship';
import { FollowUser } from '../../types/relationship';

// ユーザーのフォローユーザーとその総数を取得するフック
// (userId: number | undefined)はrouter.queryからidを取得する為
export const useGetFollowingCountByUserId = (userId: number | undefined) => {
  // export const useGetUserFollowingByUserId = (userId: number) => {
  const [followingCount, setFollowingCount] = useState<number>();
  const [following, setFollowing] = useState<FollowUser[]>();
  const [followingPagination, setFollowingPagination] = useState<FollowUser[]>();

  const handleGetFollowingCountByUserId = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getFollowingCountByUserId(userId);
      if (data.status == 200) {
        console.log('handleGetUserFollowingが呼ばれました');
        const following: FollowUser[] = data.data.following;
        console.log(`ここ${JSON.stringify(following)}`);
        const count: number = data.data.followingCount;
        const followingPagination: FollowUser[] = data.data.followingPagination;
        setFollowing(following);
        setFollowingCount(count);
        setFollowingPagination(followingPagination);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, [userId]);

  // 1 handleGetUserFollowingByUserId();
  return { followingCount, following, followingPagination, handleGetFollowingCountByUserId };
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
