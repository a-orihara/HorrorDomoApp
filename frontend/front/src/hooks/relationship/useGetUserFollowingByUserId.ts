import { useCallback, useState } from 'react';
import { getUserFollowingByUserId } from '../../api/relationship';

// ユーザーのフォロー数を取得するフック
export const useGetUserFollowingByUserId = (userId: number | undefined) => {
  const [followingCount, setFollowingCount] = useState();
  const [following, setFollowing] = useState();

  const handleGetUserFollowingByUserId = useCallback(async () => {
    // console.log('handleGetUserFollowingが呼ばれました');
    try {
      const data = await getUserFollowingByUserId(userId);
      const following = data.data.following;
      const count = data.data.followingCount;
      setFollowing(following);
      setFollowingCount(count);
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
