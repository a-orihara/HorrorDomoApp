// 1

import ProfilePage from '../../../components/templates/ProfilePage';

const profile = () => {
  return <ProfilePage></ProfilePage>;
};
export default profile;

// const UserProfile = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     if (!id) return;

//     const fetchUserData = async () => {
//       try {
//         const res = await getUserById(id as string);
//         const fetchedUser: User = res.data;
//         setUser(fetchedUser);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//       }
//     };
//     fetchUserData();
//   }, [id]);

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Layout title='Profile'>
//         <Sidebar></Sidebar>
//         <h1>UserProfile</h1>
//         <p>{user.name}</p>
//         <p>{user.email}</p>
//       </Layout>
//     </div>
//   );
// };

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
ユーザーのプロフィール写真と基本ユーザーデータ、そしてマイクロポストの一覧を表示する動的なページ
渡されたuserIDを元に、apiへリクエストし、ユーザーの情報を取得する

================================================================================================
1
getServerSidePropsは、ServerSide(サーバーサイド)で実行される、ページを生成するメソッドです。
getServerSidePropsはリクエスト毎に実行されます。
サーバーサイドでのレンダリングの際にデータを取得するために使用されます。この関数を使用することで、データを取得し、ペ
ージコンポーネントにpropsとして渡すことができます。
ページコンポーネント以外の通常のコンポーネント内では実行することができません。
getServerSidePropsで返されるpropsオブジェクトのキー名は必ず"props"である必要があります。

------------------------------------------------------------------------------------------------
「params」オブジェクトは、Next.jsのページルーティングシステムから提供されるオブジェクトで、URLのパス内で定義され
た動的なセグメント（[id]の部分）を含みます。例えば、/users/[id]のようなパスを持つページであれば、「params」オブ
ジェクトには「id」プロパティが含まれます。
「getServerSideProps」関数は、動的なデータを含む「params」オブジェクトを使用して、そのidページ内のデータを生成
します。

------------------------------------------------------------------------------------------------
const userId = params?.id as string;
オプションチェイン演算子 ?. と as 演算子を使用して、 params オブジェクトから id プロパティを取得し、文字列型の
userId 変数に代入する文法です。?. は、params オブジェクトがnullまたは undefined の場合に、undefined を返す
ために使用されます。そして、as 演算子は、変数の型を指定するために使用されます。

*オプションチェイン演算子(?.)
オブジェクトのプロパティにアクセスする際に、プロパティが存在しない場合にundefinedを返す演算子です。オプションチェ
イン演算子を使うことで、プロパティが存在しない場合のエラーを回避することができます。
params?.idの部分はOptional chainingと呼ばれる演算子(オプションチェイン演算子)で、paramsオブジェクトがnullま
たはundefinedの場合に例外が発生することを防止するために使用されます。
これは、このページのURLにidパラメーターが含まれない場合に、paramsオブジェクトが存在しないため、例外をスローする可
能性があるためです。Optional chaining演算子を使用することで、オブジェクトが存在しない場合に、プログラムがクラッ
シュすることを回避する（例外をスローせず、undefinedを返す）ことができます。

*as
型アサーションを行うための演算子です。型アサーションとは、ある型をasで指定した型として扱うことを意味します。
たとえば、サーバーからデータを取得する場合、データの型が何であるかを保証することはできません。そのため、型アサーシ
ョンが使用されます。
params から取得した id は URL の動的セグメントから取得された文字列であり、string 型に明確に変換する必要があり
ます。
TypeScript はコンパイル時に型チェックを行うため、コンパイラに明確な型情報を提供することでコンパイルエラーを回避で
きます。例えば、params?.id は params オブジェクトが存在しない場合に undefined を返しますが、as string によ
って undefined ではなく必ず文字列型に変換することができます。
userIdには必ず文字列が代入されるようにしています。これによって、後続の処理でuserIdを使う際にundefinedが入ってエ
ラーが発生するのを回避することができます。
------------------------------------------------------------------------------------------------
getServerSidePropsは、次のような引数を受け取ります。

context: ページコンポーネントがレンダリングされる前に、サーバーサイドで関数が実行されるため、サーバーサイドでのリ
クエストと関連する情報が含まれます。
context.params: ページコンポーネントがパスパターンを持つ動的ルートである場合、このオブジェクトにパラメータが含ま
れます。
context.req: HTTPリクエストに関連する情報が含まれます。
context.res: HTTPレスポンスに関連する情報が含まれます。
context.query: クエリ文字列に関連する情報が含まれます。

デフォルトではNext.jsはすべてのページでPre-Renderingを行います。Pre-Renderingはクライアント側のJavaScriptで処理を行う前にNext.js側(サーバ)でページを事前に作成し作成したページをクライアントに送信する機能です。
*/
