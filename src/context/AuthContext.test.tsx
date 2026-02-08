import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Mock the authService
vi.mock('../services/authService', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    login: vi.fn(),
  },
}));

// Test component to consume the context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-name">{user.name}</div>}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restores session on mount when authenticated', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com', role: 'user', initials: 'TU' };

    // Mock the auth service to return true for isAuthenticated and return a user
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.getCurrentUser as any).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state should be loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('remains unauthenticated on mount when not authenticated', async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.getCurrentUser).not.toHaveBeenCalled();
  });

  it('logs out on initialization error', async () => {
    // Mock isAuthenticated to throw an error
    (authService.isAuthenticated as any).mockImplementation(() => {
      throw new Error('Storage error');
    });

    // Mock console.error to prevent cluttering the test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Auth initialization failed', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
