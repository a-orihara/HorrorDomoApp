import { useRouter } from 'next/router';
import { usePostContext } from '../../contexts/PostContext';

export const PostDetail = () => {
  const { posts } = usePostContext();
  const router = useRouter();
  const { id } = router.query;
  console.log(`ポスト：${JSON.stringify(posts)}`);
  const post = posts?.find((post) => post.id === Number(id));
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className=' flex h-20 items-center justify-center pt-4 text-2xl font-semibold md:text-4xl'>投稿詳細ページ</h1>
      <div>
        {post ? (
          <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {/* 他の投稿詳細情報をここに表示 */}
          </div>
        ) : (
          <p>投稿が見つかりませんでした。</p>
        )}
      </div>
      <div className='flex flex-1 flex-col'></div>
      <div></div>
    </div>
  );
};
