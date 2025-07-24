import { authenticatePin, fetchDatabases } from '../api';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('authenticatePin', () => {
    it('returns true when authentication succeeds', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const result = await authenticatePin('1234');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: '1234' }),
        credentials: 'include',
      });
    });

    it('returns false when authentication fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      const result = await authenticatePin('9999');

      expect(result).toBe(false);
    });
  });

  describe('fetchDatabases', () => {
    it('returns databases when request succeeds', async () => {
      const mockDatabases = [{ id: '1', name: 'Test Database' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDatabases),
      } as any);

      const result = await fetchDatabases('secret_token123');

      expect(result).toEqual(mockDatabases);
      expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/notion', {
        headers: {
          'X-Notion-Token': 'secret_token123',
        },
        credentials: 'include',
      });
    });

    it('throws error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(fetchDatabases('secret_token123')).rejects.toThrow('Failed to fetch databases');
    });
  });
});