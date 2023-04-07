import { SignInParams, SignUpParams } from '../types';
import client from './client';

export const signUpUser = (params: SignUpParams) => {
  return client.post('/auth', params);
};

export const signInUser = (params: SignInParams) => {
  return client.post('/auth/sign_in', params);
};
