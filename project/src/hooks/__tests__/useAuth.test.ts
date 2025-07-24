import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { auth, notion } from '../../lib/auth';

// Mock the auth utilities
jest.mock('../../lib/auth', () => ({
  auth: {
    getSession: jest.fn(),
    validatePin: jest.fn(),
    createSession: jest.fn(),
    clearSession: jest.fn(),
  },
  notion: {
    getToken: jest.fn(),
    saveToken: jest.fn(),
  },
}));

const mockAuth = auth as jest.Mocked<typeof auth>;
const mockNotion = notion as jest.Mocked<typeof notion>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with unauthenticated state when no session exists', () => {
    mockAuth.getSession.mockReturnValue(undefined);
    mockNotion.getToken.mockReturnValue('');
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.notionToken).toBe('');
  });

  it('initializes with authenticated state when session exists', () => {
    mockAuth.getSession.mockReturnValue('session-123');
    mockNotion.getToken.mockReturnValue('secret_token123');
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.notionToken).toBe('secret_token123');
  });

  it('handles successful login', () => {
    mockAuth.getSession.mockReturnValue(undefined);
    mockAuth.validatePin.mockReturnValue(true);
    mockNotion.getToken.mockReturnValue('');
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      const success = result.current.login('1234');
      expect(success).toBe(true);
    });
    
    expect(mockAuth.validatePin).toHaveBeenCalledWith('1234');
    expect(mockAuth.createSession).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles failed login', () => {
    mockAuth.getSession.mockReturnValue(undefined);
    mockAuth.validatePin.mockReturnValue(false);
    mockNotion.getToken.mockReturnValue('');
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      const success = result.current.login('9999');
      expect(success).toBe(false);
    });
    
    expect(mockAuth.validatePin).toHaveBeenCalledWith('9999');
    expect(mockAuth.createSession).not.toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles logout', () => {
    mockAuth.getSession.mockReturnValue('session-123');
    mockNotion.getToken.mockReturnValue('secret_token123');
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.logout();
    });
    
    expect(mockAuth.clearSession).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles successful notion token update', () => {
    mockAuth.getSession.mockReturnValue('session-123');
    mockNotion.getToken.mockReturnValue('');
    mockNotion.saveToken.mockReturnValue(true);
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      const success = result.current.updateNotionToken('secret_newtoken');
      expect(success).toBe(true);
    });
    
    expect(mockNotion.saveToken).toHaveBeenCalledWith('secret_newtoken');
    expect(result.current.notionToken).toBe('secret_newtoken');
  });

  it('handles failed notion token update', () => {
    mockAuth.getSession.mockReturnValue('session-123');
    mockNotion.getToken.mockReturnValue('secret_oldtoken');
    mockNotion.saveToken.mockReturnValue(false);
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      const success = result.current.updateNotionToken('invalid_token');
      expect(success).toBe(false);
    });
    
    expect(mockNotion.saveToken).toHaveBeenCalledWith('invalid_token');
    expect(result.current.notionToken).toBe('secret_oldtoken'); // Should remain unchanged
  });

  it('provides all expected functions and state', () => {
    mockAuth.getSession.mockReturnValue(undefined);
    mockNotion.getToken.mockReturnValue('');
    
    const { result } = renderHook(() => useAuth());
    
    expect(typeof result.current.isAuthenticated).toBe('boolean');
    expect(typeof result.current.notionToken).toBe('string');
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.updateNotionToken).toBe('function');
  });
});