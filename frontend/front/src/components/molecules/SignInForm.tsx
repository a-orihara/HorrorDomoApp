import React from 'react';
import { useSignIn } from '../../hooks/auth/useSignIn';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

// ================================================================================================
const SignInForm = () => {
  const { email, setEmail, password, setPassword, handleSignIn } = useSignIn();

  // ================================================================================================
  return (
    <div className='flex flex-1 flex-col bg-red-200'>
      <h1 className='mt-20 flex h-20 items-center justify-center bg-white pt-4 text-2xl font-semibold md:text-4xl'>
        Sign In
      </h1>
      <form className='mt-12 flex flex-1 flex-col bg-amber-100 md:mt-20'>
        <div>
          <Label
            className='m-auto w-4/5 bg-red-100 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5'
            htmlFor='email'
          >
            Email:
          </Label>
          <br />
          <Input
            className='m-auto mb-4 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
            id='email'
            type='email'
            name='email'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          ></Input>
        </div>
        <div className='md:mt-12 lg:mt-0'>
          <Label
            className='m-auto w-4/5 bg-red-100 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5'
            htmlFor='password'
          >
            Password:
          </Label>
          <br />
          <Input
            className='m-auto mb-4 mt-1 w-4/5  md:w-3/5 lg:w-2/5'
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          ></Input>
        </div>
        <div className='md:mt-8 lg:mt-0'>
          <Button className='m-auto mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSignIn}>
            Sign In!
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
