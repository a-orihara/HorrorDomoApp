import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { signIn } from '../../api/auth';
import { SignInParams } from '../../types';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import { AuthContext } from '../../contexts/AuthContext';
// ------------------------------------------------------------------------------------------------
const SignInForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const params: SignInParams = {
      email: email,
      password: password,
    };
    try {
      const res = await signIn(params);
      console.log(res);
      if (res.status === 200) {
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        alert('ログイン成功');
        router.push('/');
      } else {
        alert('ログイン失敗');
      }
    } catch (err) {
      console.log(err);
      alert(`ログインエラー${err}`);
    }
  };
  // ------------------------------------------------------------------------------------------------
  return (
    <div className='mar flex h-full flex-1 items-center justify-center bg-slate-300'>
      <div className='flex-1 bg-red-200'>
        <h1>Sign In From</h1>
        <form>
          <div>
            <Label htmlFor='email'>Email:</Label>
            <br />
            <Input
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
            <Label htmlFor='password'>Password:</Label>
            <br />
            <Input
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
            <Button onClick={handleSubmit}>Sign In!</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
