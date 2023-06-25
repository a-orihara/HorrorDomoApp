import { Post } from '../../types/post';

// PostListItemPropsはkey名がpostで値にPost型を持つオブジェクト型;
type PostListItemProps = {
  post: Post;
};

// 1 関数コンポーネントの引数は基本的にオブジェクト型。
const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <li key={post.id}>
      <p className='text-center text-base md:text-xl'>{post.content}</p>
    </li>
  );
};

export default PostListItem;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
分割代入を使わない場合は、

const PostListItem = (props: PostListItemProps) => {
  const post = props.post;
  return (
    <li key={post.id}>
      <p className='text-center text-base md:text-xl'>{post.content}</p>
    </li>
  );
};
------------------------------------------------------------------------------------------------
オブジェクトのプロパティを取り出す例、

type PostListItemProps = {
  myName: string;
};

const hello = (name:PostListItemProps) =>{
    const helloName = name.myName
    console.log(`こんにちは${helloName}さん`)
}

*オブジェクトで渡す場合は、引数の型をオブジェクト型にする必要がある。
hello({myName:"Mike"});
*/
