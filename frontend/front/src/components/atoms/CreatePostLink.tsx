import Link from 'next/link';

const CreatePostLink = () => {
  return (
    <section>
      <Link href={'/post/new'}>
        <a className='mb-2 flex items-center justify-center rounded-full border-2 bg-basic-yellow  p-1 text-xl font-semibold hover:cursor-pointer hover:text-basic-pink lg:text-2xl'>
          Let&apos;s post!
        </a>
      </Link>
    </section>
  );
};

export default CreatePostLink;
