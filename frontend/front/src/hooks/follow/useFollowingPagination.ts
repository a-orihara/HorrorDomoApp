import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getFollowingByUserId } from '../../api/follow';
import { useAlertContext } from '../../contexts/AlertContext';
import { FollowUser } from '../../types/follow';

export const useFollowingPagination = (itemsPerPage: number, userId?: number) => {
  // 指定したuserIdのフォローユーザー一覧
  const [following, setFollowing] = useState<FollowUser[]>([]);
  // 指定したuserIdのフォローユーザーの総数
  const [totalFollowingCount, setTotalFollowingCount] = useState(0);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // console.log(`OK:useFollowingPaginationの${userId}`);

  const handleGetFollowingByUserId = useCallback(
    async (page: number) => {
      try {
        const res = await getFollowingByUserId(page, itemsPerPage, userId);
        setFollowing(res.data.following);
        setTotalFollowingCount(res.data.followingCount);
        // console.log(`OK:handleGetFollowingByUserIdのtotalFollowing:${res.data.followingCount}`);
        // console.log(`OK:handleGetFollowingByUserIdのfollowing:${JSON.stringify(res.data.following)}`);
      } catch (err: any) {
        setAlertSeverity('error');
        // この形式で取得成功
        setAlertMessage(`${err.response.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    },
    [itemsPerPage, router, setAlertMessage, setAlertOpen, setAlertSeverity, userId]
  );

  // 1 親FollowingPageの、router.queryの値が、初期レンダリング時にはまだundefinedである可能性がある為、条件分岐を記載
  useEffect(() => {
    if (userId !== undefined) {
      handleGetFollowingByUserId(currentPage);
    }
  }, [handleGetFollowingByUserId, currentPage, userId]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { following, totalFollowingCount, handlePageChange, currentPage };
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
フック `useFollowingPagination` のコメントにある、最初のレンダリング時に `router.query` が `undefined`
になる可能性があるというのは、Next.js でよくある動作のことです。コンポーネントが最初にマウントされたとき、Next.js
はURLパラメータの解析を終えていない可能性があり、その結果 `router.query` が `undefined` または不完全になりま
す。これは、コンポーネントやフックがURLパラメータに依存してデータを取得したりアクションを実行したりする場合に特に関
係します。
------------------------------------------------------------------------------------------------
- **初期レンダリングと `router.query`**： Next.jsのページが最初にレンダリングされるとき、特にクライアント側で
は、URLパラメータ（`router.query`）がすぐに利用できないことがあります。この遅延は、Next.jsがURLとパラメータを
解析するときに、非同期で`router.query`にデータを入力するためです。
------------------------------------------------------------------------------------------------
- 条件分岐**： この非同期動作を処理するために、`handleGetFollowingByUserId(currentPage)`を呼び出す前に、条
件分岐チェック（`if (userId !== undefined)` ）を行います。このチェックは `userId` (`router.query` から抽
出される) が定義されている場合にのみ関数が呼び出されることを保証します。このチェックを行わないと、`undefined` の
値を使おうとしてエラーや意図しない動作をする可能性があります。
------------------------------------------------------------------------------------------------
- **UseEffect 依存配列**： userId` が `useEffect` フックの依存配列に含まれていることに注意してください。これ
は、 `currentPage` や `handleGetFollowingByUserId` が変更されたときだけでなく、 `userId` が定義されたとき
にもフックが再実行されることを意味する。最初は `userId` が `undefined` の場合、フックのロジックはスキップされる
。一旦 `userId` が決定されると（つまり、`router.query` に値が入力され、`userId` が設定されると）、フックは再
び実行され、今度は条件ロジックを実行してデータを取得する。
------------------------------------------------------------------------------------------------
- なぜ必要なのか？このパターンは、データフェッチやURLパラメータに依存する副作用が正しいタイミング、特に必要なパラメ
ータがすべて利用可能になった後に実行されることを保証するために不可欠です。
------------------------------------------------------------------------------------------------
まとめると、フック `useEffect` 内の条件分岐は、必要なパラメータ（この場合は `userId`）が利用可能なときにのみ
`handleGetFollowingByUserId` が呼び出されるようにするためのセーフガードであり、Next.js で`router.query`が
利用可能であるという非同期的な性質に対応しています。
*/
