import axios from 'axios';
import { User } from '../types';

export const signUpUser = async (name: string, email: string, password: string, password_confirmation: string;): Promise<User> => {
  const res = await axios.post()

  alert('サインアップ');
};
