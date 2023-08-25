import { Post } from '../../../types/post';
import { User } from '../../../types/user';
import FeedListItem from '../../molecules/listItem/FeedListItem';
import CommonPostList from './CommonPostList';

type FeedListProps = {
  feedPosts: Post[];
  feedUsers: User[];
};

const FeedList = ({ feedPosts, feedUsers }: FeedListProps) => {
  return (
    <CommonPostList
      posts={feedPosts}
      users={feedUsers}
      // propsにコンポーネントも渡せる
      // ListItemComponent={FeedListItem}
      // 1 無名関数を渡してマッピング
      ListItemComponent={({ post, user }) => <FeedListItem feedPost={post} feedUser={user} />}
      noPostsMessage='投稿がありません'
    />
  );
};

export default FeedList;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
ラムダ式（無名関数）を用いて、`CommonPostList`の`ListItemComponent`プロパティに関数を渡しています。この関数
は、`CommonPostList`から渡される`post`と`user`という引数を受け取り、それらを`FeedListItem`コンポーネントの
`feedPost`と`feedUser`プロパティにマッピングしています。具体的な解説は以下の通りです。
* マッピング :
この文脈での「マッピング」とは、異なるコンポーネント間で情報を受け渡すために、プロパティやデータの名前を変換して一致
させるプロセスを指す。
------------------------------------------------------------------------------------------------
1. **ラムダ式（無名関数）の定義**:
`({ post, user }) => <FeedListItem feedPost={post} feedUser={user} />` の部分で、無名関数を定義してい
ます。
- 引数: `post`と`user`という名前のオブジェクトを引数として受け取ります。この引数を元にして新しいReact要素を作成
しています。
- 戻り値: 引数で受け取った`post`と`user`を`FeedListItem`コンポーネントのプロパティとして渡し、その結果として生
成されたJSX要素（feedPostとfeedUserを引数に持つFeedListItemコンポーネント）を生成して返します。
この部分で`FeedListItem`コンポーネントに`feedPost`と`feedUser`という名前のプロパティを設定しています。ここで
`post`と`user`という名前の引数が、それぞれ`feedPost`と`feedUser`というプロパティにマッピングされていることが
わかります。
------------------------------------------------------------------------------------------------
2. **プロパティ名の変換**:
引数として受け取った`post`と`user`は`FeedListItem`の`feedPost`と`feedUser`プロパティに対応しているので、そ
のままマッピングします。
------------------------------------------------------------------------------------------------
3. **プロパティの渡し方**:
`CommonPostList`コンポーネントの`ListItemComponent`プロパティに、上記で定義した無名関数を渡しています。
`CommonPostList`内でこの関数が呼び出されると、それぞれの`post`と`user`が`FeedListItem`に渡されるようになり
ます。
------------------------------------------------------------------------------------------------
この方法により、プロパティ名が異なる場合でも共通のコンポーネントを使用し、それぞれのコンポーネントに適切なプロパティ
を渡すことが可能となります。
`CommonPostList`コンポーネント内で定義された`ListItemComponent`において、適切なプロパティ名で`FeedListItem`
コンポーネントに情報を渡すことができます。このプロセスを「マッピング」と呼びます。
@          @@          @@          @@          @@          @@          @@          @@          @
参考
------------------------------------------------------------------------------------------------
以前のコード

const FeedList = ({ feedPosts, feedUsers }: FeedListProps) => {
  // 1
  if (!feedPosts || feedPosts.length === 0) {
    return (
      <div className='mb-4 flex flex-1 flex-col items-center justify-around'>
        <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿がありません</p>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <ol>
        {feedPosts?.map((feedPost) => {
          // 2
          const feedUser = feedUsers.find((feedUser) => feedUser.id === feedPost.userId);
          // 3
          if (feedUser) {
            return <FeedListItem key={feedPost.id} feedPost={feedPost} feedUser={feedUser}></FeedListItem>;
          } else {
            return (
              <div key={feedPost.id} className='mb-4 flex flex-1 flex-col items-center justify-around'>
                <p className='border-b-2 border-slate-200 text-base md:text-xl'>投稿を表示できません</p>
              </div>
            );
          }
        })}
      </ol>
    </div>
  );
};
*/
