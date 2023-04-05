import { SignUpParams } from '../types';
import client from './client';

export const signUpUser = (params: SignUpParams) => {
  return client.post('/auth', params);
};
