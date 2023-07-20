import Button from '../atoms/Button';

export const FollowForm = () => {
  const test = () => {
    console.log('FollowForm');
  };

  return (
    <div>
      <form className='bg-red-200' action='post' onSubmit={test}>
        <Button className='m-auto mt-3 rounded-lg bg-basic-yellow font-semibold hover:bg-hover-yellow'>follow</Button>
      </form>
    </div>
  );
};
