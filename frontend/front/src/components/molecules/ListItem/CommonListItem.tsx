import useFormattedTime from '../../../hooks/helpers/useFormattedTime';
import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import { LikeButtonIcon } from '../../atoms/LikeButtonIcon';

type CommonListItemProps = {
  post: Post;
  user: User;
  currentUser?: User;
  handleDeletePost: (postId: number) => void;
};

const CommonListItem = ({ post, user, currentUser, handleDeletePost }: CommonListItemProps) => {
  // postの作成日時を形成するカスタムフック
  const postCreatedTime = useFormattedTime(post.createdAt);
  // postの文字数が30文字より多い場合は、30文字までを表示し、それ以降は...と表示
  const truncateContent = post.content.length > 30 ? `${post.content.substring(0, 30)}...` : post.content;

  return (
    <div>
      {/* post.content */}
      <p className='text-left text-sm md:text-xl'>{truncateContent}</p>
      <div className='flex'>
        <p className='mr-5 text-xs lg:text-base'>作成日時:{postCreatedTime}</p>
        {/* 1 currentUserで条件を満たせばいいねを表示する */}
        {currentUser && currentUser.id !== post.userId && <LikeButtonIcon postId={post.id} liked={post.liked} />}
        {/* currentUserで条件を満たせば投稿を削除する */}
        {currentUser?.id === post.userId && (
          <a
            className='hover:cursor-pointer'
            onClick={() => {
              if (window.confirm('投稿を削除しますか？')) {
                handleDeletePost(post.id);
              }
            }}
          >
            <h1 className='text-center text-sm text-basic-green hover:text-basic-pink lg:text-base'>delete</h1>
          </a>
        )}
      </div>
    </div>
  );
};

export default CommonListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
currentUserが定義されている場合にのみLikeButtonIconコンポーネントを描画します。
よって、LikeButtonIconコンポーネントに渡されるuserIdは常にnumber型となり、undefinedは渡されません。
------------------------------------------------------------------------------------------------
. 一般的には `undefined` を可能な限り早く処理することでエラーの可能性を最小限に抑えることが推奨されています。した
がって、この場合、`CommonListItem` コンポーネントで `currentUser` が `undefined` かどうかを確認し、
`LikeButtonIcon` コンポーネントには `undefined` を渡さないようにするのが一般的に良いとされています。
. この修正により、currentUserが定義されていない場合には、LikeButtonIcon自体がレンダリングされません。よって、
LikeButtonIconにundefinedが渡されることはありません。
. Reactのコンポーネントは可能な限り "pure"（純粋）であるべきです。つまり、ある入力が与えられた時に同じ出力を返すべ
きです。したがって、undefinedやnullが許容されないpropsを持つコンポーネントにそれらの値を渡すべきではありません。
これにより、コンポーネントの安定性と予測可能性が保証されます。
*/
