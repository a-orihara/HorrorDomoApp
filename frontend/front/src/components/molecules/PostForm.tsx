import React from 'react';
import { useCreatePost } from '../../hooks/post/useCreatePost';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import TextArea from '../atoms/TextArea';

const PostForm: React.FC = () => {
  const { content, setContent, title, setTitle, handleCreatePost } = useCreatePost();
  // const [title, setTitle] = useState('');

  return (
    <div className='flex flex-1 flex-col'>
      <h1 className=' flex h-20 items-center justify-center bg-red-200 pt-4 text-2xl font-semibold md:text-4xl'>
        Let&apos;s post it!
      </h1>
      <form className='mt-4 flex flex-1 flex-col' method='post' onSubmit={handleCreatePost}>
        <div>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='title'>
            Title:
          </Label>
          <Input
            className='m-auto mb-2 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
            id='title'
            type='text'
            name='title'
            value={title}
            // currentUser(変数): User | undefinedで、undefinedの可能性があるので、currentUser?とする
            placeholder='タイトルを入力してください'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
            }}
          ></Input>
        </div>
        <div className='flex flex-1 flex-col'>
          <Label className='m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5' htmlFor='profile'>
            Content:
          </Label>
          <TextArea
            className='m-auto w-4/5 flex-1 md:w-3/5 lg:w-2/5'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='何を思っている？'
            maxLength={140}
          />
        </div>
        <div>
          <Button className='m-auto mb-2 mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow' type='submit'>
            投稿
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;

/*
@          @@          @@          @@          @@          @@          @@          @@          @

*/
