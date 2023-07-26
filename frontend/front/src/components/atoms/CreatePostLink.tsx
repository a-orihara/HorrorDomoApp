import Link from 'next/link';

const CreatePostLink = () => {
  return (
    <section>
      <Link href={'/post/new'}>
        <a className='mb-2  flex items-center justify-center rounded-lg border-2  bg-slate-500 text-xl font-semibold hover:cursor-pointer hover:text-basic-pink lg:text-2xl'>
          投稿を作成する
        </a>
      </Link>
    </section>
  );
};

export default CreatePostLink;
