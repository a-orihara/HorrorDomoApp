import { PostDetailArea } from '../organisms/PostDetailArea';

// 1
export const PostDetailPage = () => {
  return <PostDetailArea></PostDetailArea>;
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
PostDetailPageについて:
配置場所: templates
理由: PostDetailPageは画面の一部を構成するorganisms（ここではPostDetailArea）を含むテンプレートで、ページの
構造を定義しています。ページのレイアウトを形成するため、templatesに配置するのが適切です。
*/
