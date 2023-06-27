import Cookies from 'js-cookie';
import { getAuthenticatedUser, signIn, signOut, signUp } from '../../src/api/auth';
import client from '../../src/api/client';
import { SignInParams, SignUpParams } from '../../src/types/user';

jest.mock('../../src/api/client');
jest.mock('js-cookie');

// すべてのテストの前にモックをリセット
beforeEach(() => {
  // '../../src/api/client'内の各clientメソッドに対して
  (client.get as jest.Mock).mockReset();
  (client.post as jest.Mock).mockReset();
  (client.delete as jest.Mock).mockReset();
  (Cookies.get as jest.Mock).mockReset();
  // すべてのテストに共通のモッキング:元々の使い方:Cookies.get('_access_token')
  (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
});

describe('signUp関数のテスト', () => {
  // 各テストで共通の変数を定義
  let mockResponse: { data: object };
  let params: SignUpParams;

  beforeEach(() => {
    // mockResponseに空オブジェクトをセット
    mockResponse = { data: {} };
    // client.putの戻り値に空オブジェクトをセット
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    params = { name: 'test', email: 'test@example.com', password: 'password', passwordConfirmation: 'password' };
  });

  it('client.postが正しいパスで呼ばれる', async () => {
    await signUp(params);
    expect(client.post).toHaveBeenCalledWith('/auth', params);
  });

  it('signUpの戻り値がclient.postのモックから返された値と一致しているか確認', async () => {
    const result = await signUp(params);
    expect(result).toEqual(mockResponse);
  });
});

describe('signIn関数のテスト', () => {
  // 各テストで共通の変数を定義
  let mockResponse: { data: object };
  let params: SignInParams;

  beforeEach(() => {
    mockResponse = { data: {} };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    params = { email: 'test@example.com', password: 'password' };
  });

  it('client.postが正しいパスとパラメータで呼ばれる', async () => {
    await signIn(params);
    expect(client.post).toHaveBeenCalledWith('/auth/sign_in', params);
  });

  it('signInの戻り値がclient.postのモックから返された値と一致しているか確認', async () => {
    const result = await signIn(params);
    expect(result).toEqual(mockResponse);
  });
});

describe('signOut関数のテスト', () => {
  // 各テストで共通の変数を定義
  let mockResponse: { data: object };

  beforeEach(() => {
    mockResponse = { data: {} };
    (client.delete as jest.Mock).mockResolvedValue(mockResponse);
    (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
  });

  it('client.deleteが正しいパスとヘッダーで呼ばれる', async () => {
    await signOut();
    expect(client.delete).toHaveBeenCalledWith('/auth/sign_out', {
      headers: {
        'access-token': 'mock__access_token',
        client: 'mock__client',
        uid: 'mock__uid',
      },
    });
  });

  it('signOutの戻り値がclient.deleteのモックから返された値と一致しているか確認', async () => {
    const result = await signOut();
    expect(result).toEqual(mockResponse);
  });
});

describe('getAuthenticatedUser関数のテスト', () => {
  let mockResponse: { data: object };

  beforeEach(() => {
    mockResponse = { data: {} };
    (client.get as jest.Mock).mockResolvedValue(mockResponse);
    (Cookies.get as jest.Mock).mockImplementation((key: string) => `mock_${key}`);
  });

  it('認証情報が存在する場合、client.getが正しいパスとヘッダーで呼ばれる', async () => {
    await getAuthenticatedUser();
    expect(client.get).toHaveBeenCalledWith('/authenticated_users', {
      headers: {
        'access-token': 'mock__access_token',
        client: 'mock__client',
        uid: 'mock__uid',
      },
    });
  });

  it('getAuthenticatedUserの戻り値がclient.getのモックから返された値と一致しているか確認', async () => {
    const result = await getAuthenticatedUser();
    expect(result).toEqual(mockResponse);
  });

  it('認証情報が存在しない場合、client.getは呼ばれない', async () => {
    // undefinedを返すので、(key: string)の引数はいらない
    (Cookies.get as jest.Mock).mockImplementation(() => undefined);
    await getAuthenticatedUser();
    expect(client.get).not.toHaveBeenCalled();
  });
});
