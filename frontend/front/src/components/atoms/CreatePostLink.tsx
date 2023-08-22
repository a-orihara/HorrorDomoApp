import Link from 'next/link';

// 1
const CreatePostLink = () => {
  return (
    <section>
      <Link href={'/post/new'}>
        <a className='mb-2 flex items-center justify-center rounded-full border-2 border-black  bg-basic-green p-1 text-xl font-semibold text-white hover:cursor-pointer hover:bg-basic-pink lg:text-2xl'>
          Let&apos;s post!
        </a>
      </Link>
    </section>
  );
};

export default CreatePostLink;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
`CreatePostLink.tsx`についての配置の適切性と理由。
- 配置場所: `atoms`
- 理由: `CreatePostLink`コンポーネントは、リンクを表現する非常にシンプルな構造を持っています。これは基本的な要素
であり、他のコンポーネントの構築ブロックとして使うことができます。ロジックや複数の部品を組み合わせたものではないため、
atomic designの最も小さな単位である`atoms`に配置するのが適切です。
*/
