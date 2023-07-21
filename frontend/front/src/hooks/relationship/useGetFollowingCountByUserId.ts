import { useCallback, useState } from 'react';
import { getFollowingCountByUserId } from '../../api/follow';

// idユーザーのフォローユーザーの総数を取得するフック
// (userId: number | undefined)はrouter.queryからidを取得する為
export const useGetFollowingCountByUserId = (userId: number | undefined) => {
  const [followingCount, setFollowingCount] = useState<number>();

  const handleGetFollowingCountByUserId = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getFollowingCountByUserId(userId);
      if (data.status == 200) {
        const count: number = data.data.followingCount;
        setFollowingCount(count);
      }
    } catch (err) {
      // ◆エラー仮実装
      alert('ユーザーが存在しません');
    }
  }, [userId]);

  return { followingCount, handleGetFollowingCountByUserId };
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
