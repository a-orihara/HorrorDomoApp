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
  // 説明はuseLikedPostsPaginationの1.1へ 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);
  // 2 loading状態の管理。loading中はtrue
  const [isLoading, setIsLoading] = useState(false);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();

  const handleGetFollowingByUserId = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const res = await getFollowingByUserId(page, itemsPerPage, userId);
        setFollowing(res.data.following);
        setTotalFollowingCount(res.data.followingCount);
      } catch (err: any) {
        setAlertSeverity('error');
        // この形式で取得成功
        setAlertMessage(`${err.response.data.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }finally {
        // リクエスト完了後、ロードを停止する
        setIsLoading(false);
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

  // 説明はuseLikedPostsPaginationの1.2へ
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return { following, totalFollowingCount, handlePageChange, currentPage, isLoading };
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

================================================================================================
2
ロード処理を `useFollowingPagination` 内にカプセル化するという決定は、フロントエンド開発におけるロジックの分離
とモジュール設計の原則に直接関係している。以下はその理由です：
------------------------------------------------------------------------------------------------
- **Separation of Concerns**： データを取得するのと同じカスタムフック(`useFollowingPagination`)内でロード
状態を管理することで、懸念事項の分離の原則に従います。このアプローチでは、ローディング状態を含むページネーションデー
タのフェッチと管理に関連するすべてのロジックを単一のまとまったユニット内に閉じ込めます。関連するすべての動作が一元化
されているため、コードがより読みやすく、保守しやすく、デバッグしやすくなります。
------------------------------------------------------------------------------------------------
- 再利用性**： フック内のロードロジックをカプセル化することで、再利用性が高まります。フックは、異なるコンポーネント
間で再利用できるように設計されています。フック内にローディングステートロジックを含めることで、フォロワー情報とそのロ
ーディングステートを表示する必要があるコンポーネントは、ローディングロジックを複製する必要なく、このフックを呼び出す
だけでそれを行うことができます。
------------------------------------------------------------------------------------------------
- 状態管理の改善**： データ取得ロジックが存在する場所の近くでローディングステートを処理することで、ステート管理が簡
素化されます。ローディングからロードへの）状態遷移がデータ・フェッチ操作と密接に整合していることが保証されるため、状
態の不整合が発生する可能性が低くなり、ローディング状態に基づく条件付きレンダのような機能の実装が容易になります。
------------------------------------------------------------------------------------------------
- モジュラー・コード構造**： このアプローチは、各モジュール（この場合はフック）がアプリの機能の明確な側面を担当する
、よりモジュール化されたコード構造に貢献します。これは、複雑な機能をより小さく、管理しやすく、テスト可能なユニットに
分割する、最新のフロントエンド開発のプラクティスと一致します。
- ユーザーエクスペリエンスの向上**： フック内でロード状態を管理することで、リクエストのステータス（ロード、成功、エ
ラー）についてユーザーに即座にフィードバックを提供することが容易になります。この直接的なフィードバックのループは、ア
プリケーションが何をしているのかをユーザーに知らせ続けるので、良いユーザーエクスペリエンスには不可欠です。
------------------------------------------------------------------------------------------------
まとめると、ロード処理を `useFollowingPagination` 内にカプセル化することは、ロジックの再利用や分離のためのカス
タムフックなど、最新の React 開発プラクティスの利点を活用する戦略的な選択であり、より保守性が高く、モジュール化され
た、ユーザーフレンドリーなアプリケーションを作成するためのものです。
*/
