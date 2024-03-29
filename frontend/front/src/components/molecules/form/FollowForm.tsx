import { useEffect, useState } from 'react';
import { isFollowing } from '../../../api/follow';
import { useFollowContext } from '../../../contexts/FollowContext';
import { useCreateFollow } from '../../../hooks/follow/useCreateFollow';
import { useDeleteFollow } from '../../../hooks/follow/useDeleteFollow';
import Button from '../../atoms/Button';

type FollowFormProps = {
  userId: number;
  otherUserId: number | undefined;
};

export const FollowForm = ({ userId, otherUserId }: FollowFormProps) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const { handleCreateFollow } = useCreateFollow(otherUserId);
  const { handleDeleteFollow } = useDeleteFollow(otherUserId);
  const { handleGetFollowersCountByUserId } = useFollowContext();

  // 1 crrentユーザーと別ユーザーのフォロー状態を作成し、アクション完了時にフォロワー数を更新する。
  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    handleCreateFollow().then(() => {
      setIsFollowed(true);
      handleGetFollowersCountByUserId(otherUserId);
    });
  };

  // 2 crrentユーザーと別ユーザーのフォロー状態を削除し、アクション完了時にフォロワー数を更新する。
  const handleUnFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (window.confirm('フォローを解除しますか？')) {
      event.preventDefault();
      handleDeleteFollow().then(() => {
        setIsFollowed(false);
        handleGetFollowersCountByUserId(otherUserId);
      });
    }
  };

  useEffect(() => {
    // crrentユーザーと別ユーザーのフォロー状態を非同期にチェックし、それに応じてフォロー状態を更新する。
    const checkFollow = async () => {
      // currentIdと otherUserId が undefined でないことを確認する
      if (userId !== undefined && otherUserId !== undefined) {
        const response = await isFollowing(userId, otherUserId);
        setIsFollowed(response.data.isFollowing);
      }
    };
    checkFollow();
  }, [userId, otherUserId]);

  return (
    <div>
      <form>
        {/* フォロー状態により表示を切り分ける */}
        {isFollowed ? (
          <Button
            className='m-auto mb-1 mt-1 flex h-8 items-center justify-center rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow md:h-12'
            onClick={handleUnFollowClick}
          >
            フォロー中
          </Button>
        ) : (
          <Button
            className='m-auto mb-1 mt-1 flex h-8 items-center justify-center rounded-lg bg-basic-yellow font-semibold placeholder:m-auto hover:bg-hover-yellow md:h-12'
            onClick={handleFollowClick}
          >
            フォローする
          </Button>
        )}
      </form>
    </div>
  );
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
isFollowedステートの更新を即時反映するため、handleCreateFollowの後にsetIsFollowed(true)。
API呼び出しに失敗した場合でもフォロー済みとして表示が切り替わる可能性を防ぐ為、thenでつなぐ。
------------------------------------------------------------------------------------------------
フォローされた別ユーザーにとっては、フォロワー数を変更するので、handleGetFollowersCountByUserIdを呼び出す。
handleGetFollowersCountByUserIdをthenの後に呼ばないと、即時にフォロワー数が変更されない。おそらくバックエン
ドのDBがすぐに反映されないため、古いデータを取得し、画面上のフォロワー数が更新されない可能性があります。
バックエンドのフォロー更新がデータベースに反映された後に、フォロワー数を取得するために、handleCreateFollow()が、
Promiseを返すことを利用し、.thenの中にhandleGetFollowersCountByUserId(otherUserId)を呼び出すようにする。
------------------------------------------------------------------------------------------------
useCreateFollowフック内のhandleCreateFollow関数で非同期処理とエラーハンドリングが完全にカバーされているので、
ここで下記のようなエラーやasyncの処理は不要。
try {
    await handleCreateFollow();
    setIsFollowed(true);
  } catch (err: any) {
    console.error(err);
  }

================================================================================================
2
フォロー解除された別ユーザーにとっては、フォロワー数を変更するので、handleGetFollowersCountByUserIdを呼び出す。
*/
