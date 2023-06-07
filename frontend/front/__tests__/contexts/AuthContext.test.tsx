import { render, waitFor } from '@testing-library/react';
import { getAuthenticatedUser } from '../../src/api/auth';
import { AuthContext, AuthProvider } from '../../src/contexts/AuthContext';
import { User } from '../../src/types/index';

jest.mock('../../src/api/auth');

const mockUser: User = {
  id: 1,
  uid: 'test_uid',
  provider: 'test_provider',
  email: 'test@example.com',
  name: 'Test User',
  allowPasswordChange: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  admin: false,
  profile: null,
  avatarUrl: null,
};

// const mockGetAuthenticatedUser = getAuthenticatedUser as jest.MockedFunction<typeof getAuthenticatedUser>;

const mockGetAuthenticatedUser = getAuthenticatedUser as jest.Mock;

describe('AuthContext', () => {
  // 1
  beforeEach(() => {
    mockGetAuthenticatedUser.mockResolvedValue({
      data: { isLogin: true, data: mockUser },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('コンポーネントがマウントされたときに現在のユーザーを設定する', async () => {
    let currentUser: User | undefined;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            currentUser = value?.currentUser;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => expect(mockGetAuthenticatedUser).toBeCalled());
    expect(currentUser).toEqual(mockUser);
  });
});

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
beforeEach
Jestが提供する関数。スイートの各テストの前に特定の条件を設定するために使用されます。beforeEach`に渡された関数は、
スイートの各個別テストの前に実行されます。
*/
