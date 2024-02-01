import { Post } from '../../../types/post';
import { User } from '../../../types/user';

type CommonPostListProps = {
  posts: Post[];
  // 投稿作成user
  users: User[];
  noPostsMessage: string;
  // 1 コンポーネントの型指定
  ListItemComponent: (props: { post: Post; user: User }) => JSX.Element;
};

// propsにコンポーネントも渡せる
const CommonPostList = ({ posts, users, noPostsMessage, ListItemComponent }: CommonPostListProps) => {
  // 2 投稿が０、もしくはない場合にnoPostsMessageを表示
  if (!posts || posts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>{noPostsMessage}</p>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <ol>
        {posts.map((post) => {
          // 3 usersの中から表示する投稿の作成者のidと一致するuser（投稿者）を探す
          const user = users.find((user) => user.id === post.userId);
          // 4
          if (user) {
            // この部分で無名関数を実行している。投稿情報をListItemComponentに渡す
            return <ListItemComponent key={post.id} post={post} user={user} />;
          } else {
            // 投稿者が見つからない場合
            return (
              <div key={post.id} className='mb-4 flex flex-1 flex-col items-center justify-around'>
                <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿を表示できません</p>
              </div>
            );
          }
        })}
      </ol>
    </div>
  );
};

// 使用例:
// const FeedList = () => (
//   <CommonPostList posts={feedPosts} users={feedUsers} noPostsMessage="投稿がありません" ListItemComponent={FeedListItem} />
// );

export default CommonPostList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
. `(props: { post: Post; user: User })`:
- `props`: これは引数の名前で、コンポーネント内でこの名前を通じてプロパティにアクセスできます。ここでは、`props`
はオブジェクトとして定義されています。
- `{ post: Post; user: User }`: これはプロパティの型（オブジェクト）を定義しています。`post` プロパティは
`Post` 型のデータを受け取り、`user` プロパティは `User` 型のデータを受け取ります。
------------------------------------------------------------------------------------------------
. `=>`:
この記号は関数の戻り値の型を指定するために使います。関数が呼び出されたとき、その関数の処理が実行された後、この部分で
指定された型の値が返されます。
------------------------------------------------------------------------------------------------
. `JSX.Element`:
JSX（JavaScript XML）は、Reactコンポーネント内でUI要素を表現するための記法です。`JSX.Element` は、この関数が
返す値がReact要素であることを示しています。つまり、この関数はJSXを用いて作成されたReact要素を返すことを意味します。
------------------------------------------------------------------------------------------------
簡潔に言えば、ListItemComponent というコンポーネントの型指定 => JSX.Element; は、「ListItemComponent は、
post プロパティとして Post 型のデータ、user プロパティとして User 型のデータを受け取り、JSXで表現されたReact要
素を返す関数である」という意味です。
この型指定を基に、ListItemComponent 関数を実装する際には、受け取った post と user データを使って適切なUI要素を
構築し、それをReact要素として返す必要があります。

================================================================================================
2
Reactコンポーネントは、最初に一致したreturn文でレンダリング内容が決まります。一つのコンポーネント関数の中で複数の
return文がある場合、最初に一致したreturn文が実行され、それ以降のコードは無視されます。
------------------------------------------------------------------------------------------------
nullと空の配列はJavaScriptでは異なるものとして扱われ、if (!posts)はpostsがnullまたはundefinedの場合にのみ真
となります。一方、空の配列はfalseにはなりません。
if (!posts || posts.length === 0)という条件を追加し、空の配列の場合も真となるようにしています。

================================================================================================
3
userの型がUser | undefinedになる理由
Array.prototype.findメソッドは、与えられたテスト関数を満たす最初の要素の値を返します。もし該当する要素が見つか
らなかった場合はundefinedを返します。そのため、TypeScriptはfindメソッドの結果をUser | undefinedと推論します。

================================================================================================
4
userがundefinedではないことを確認してからFeedListItemに渡すことで、FeedListItemの引数userはUser型になる。
*/
