import { useState } from 'react';
import { getUserFollowingByUserId } from '../../api/relationship';

export const useGetUserFollowingByUserId = (userId: number) => {
  const [followingCount, setFollowingCount] = useState();
  const handleGetUserFollowingByUserId = async () => {
    const data = await getUserFollowingByUserId(userId);
    const count = data.data.followingCount;
    setFollowingCount(count);
  };
  // 1 handleGetUserFollowingByUserId();
  return { followingCount, handleGetUserFollowingByUserId };
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
