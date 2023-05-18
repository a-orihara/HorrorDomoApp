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
      <form className='mt-20 flex flex-1 flex-col bg-amber-100'>
        <div>
          <Label className='m-auto w-2/5 bg-red-100 pl-3 text-left text-lg md:text-2xl' htmlFor='email'>
            Email:
          </Label>
          <br />
          <Input
            className='m-auto mb-2 mt-1 w-2/5 bg-blue-100'
            id='email'
            type='email'
            name='email'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          ></Input>
        </div>
        <div>
          <Label className='m-auto w-2/5 bg-red-100 pl-3 text-left text-lg md:text-2xl' htmlFor='password'>
            Password:
          </Label>
          <br />
          <Input
            className='m-auto mb-2 mt-1 w-2/5 bg-blue-100'
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          ></Input>
        </div>
        <div>
          <Button className='m-auto mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSignIn}>
            Sign In!
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
