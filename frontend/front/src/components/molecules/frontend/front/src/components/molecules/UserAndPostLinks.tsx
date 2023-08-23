import Link from 'next/link';
import { Post } from '../../../../../../../types/post';
import { User } from '../../../../../../../types/user';

type UserAndPostLinksProps = {
  user: User;
  post: Post;
};

const UserAndPostLinks = ({ user, post }: UserAndPostLinksProps) => (
  <>
    <p>
      <Link href={`/users/${user.id}`}>
        <a className='text-xs lg:text-base lg:tracking-wider'>{user.name}</a>
      </Link>
    </p>
    <Link href={`/post/${post.id}`}>
      <a className='text-sm text-black text-opacity-50 hover:cursor-pointer hover:text-basic-pink md:text-xl'>
        {post.title}
      </a>
    </Link>
  </>
);

export default UserAndPostLinks;
