import React, { useContext, useState } from 'react';
import { updateUser } from '../../api/auth';
import { AuthContext } from '../../contexts/AuthContext';
import { UserUpdateParams } from '../../types';
import AlertMessage from '../atoms/AlertMessage';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

const UserForm: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');
  const [alertMessage, setAlertMessage] = useState('');

  // const [password, setPassword] = useState('');
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params: UserUpdateParams = {
      name: name,
      email: email,
      // password: password,
      // passwordConfirmation: passwordConfirmation,
    };
    try {
      const res = await updateUser(params);
      console.log(res.data);
      if (res.status === 200) {
        setAlertSeverity('success');
        setAlertMessage('ユーザー情報の更新に成功しました！');
        setAlertOpen(true);
        // setTimeout(() => {
        //   router.push('/');
        // }, 3000);
      }
    } catch (err) {
      setAlertSeverity('error');
      setAlertMessage('ユーザー情報の更新中にエラーが発生しました。');
      setAlertOpen(true);
    }
  };

  // ------------------------------------------------------------------------------------------------
  return (
    <div className='mar flex h-full flex-1 items-center justify-center bg-slate-300'>
      <div className='flex-1 bg-red-200'>
        <h1>Update your profile</h1>
        <form>
          <div>
            {/* 1 */}
            <Label htmlFor='name'>Name:</Label>
            <br />
            <Input
              id='name'
              type='text'
              name='name'
              value={name}
              // currentUser(変数): User | undefinedで、undefinedの可能性があるので、currentUser?.nameとする
              placeholder={currentUser ? currentUser.name : 'Name'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Label htmlFor='email'>Email:</Label>
            <br />
            <Input
              id='email'
              type='email'
              name='email'
              value={email}
              placeholder={currentUser ? currentUser.email : 'Email'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Button className='bg-basic-yellow font-semibold hover:bg-hover-yellow' onClick={handleSubmit}>
              Save Changes!
            </Button>
          </div>
          <AlertMessage
            open={alertOpen}
            setOpen={setAlertOpen}
            severity={alertSeverity}
            message={alertMessage}
          ></AlertMessage>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
htmlForは、HTMLのlabelタグのfor属性に対応するReact JSXの属性です。htmlForを指定することで、labelタグと
inputタグを関連付ける（対応するinput要素のid属性を指定）ことができます。
*/
