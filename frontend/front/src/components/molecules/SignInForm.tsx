import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { signIn } from '../../api/auth';
import { useAlertContext } from '../../contexts/AlertContext';
import { AuthContext } from '../../contexts/AuthContext';
import { SignInParams } from '../../types';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
// ================================================================================================
const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { setAlertMessage, setAlertOpen, setAlertSeverity } = useAlertContext();
  const router = useRouter();
  // ------------------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const params: SignInParams = {
      email: email,
      password: password,
    };
    try {
      const res = await signIn(params);
      if (res.status === 200) {
        console.log(`signInのres.data:${JSON.stringify(res.data)}`);
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        setAlertSeverity('success');
        setAlertMessage(`${res.data.message}`);
        setAlertOpen(true);
        // ユーザーIDを元にマイページ（プロフィールページ）へ遷移
        // router.push(`/user/${res.data.data.id}`);
        setTimeout(() => {
          router.push(`/users/${res.data.data.id}`);
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`${res.data.errors.fullMessages}`);
        setAlertOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setAlertSeverity('error');
      setAlertMessage(`${err.response.data.errors}`);
      setAlertOpen(true);
    }
  };
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
          <Button className='m-auto mt-3 bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSubmit}>
            Sign In!
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
