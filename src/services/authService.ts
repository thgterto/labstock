import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

const MOCK_USER: User = {
  id: 'USR-001',
  name: 'Jane Doe',
  email: 'jane.doe@labcontrol.com',
  role: 'admin',
  initials: 'JD'
};

const STORAGE_KEY = 'labcontrol_auth_token';

class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === 'admin' && password === 'admin') {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(STORAGE_KEY, token);
      return { user: MOCK_USER, token };
    }

    throw new Error('Invalid credentials');
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;
    // Simulate fetching user from token
    return MOCK_USER;
  }
}

export const authService = new AuthService();
