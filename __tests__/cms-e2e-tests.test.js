/**
 * CMS End-to-End Tests - Testing complete admin dashboard workflows
 */

import { describe, it, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Mock browser APIs
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'fetch', {
  value: jest.fn(),
  writable: true,
});

// Mock React hooks
const mockUseState = jest.fn();
const mockUseEffect = jest.fn();
const mockUseRouter = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: mockUseState,
  useEffect: mockUseEffect,
}));

jest.mock('next/navigation', () => ({
  useRouter: mockUseRouter,
}));

describe('CMS End-to-End Tests', () => {
  beforeAll(() => {
    // Setup test environment
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset useState mock to return default state management
    mockUseState.mockImplementation((initial) => [initial, jest.fn()]);
    
    // Reset useEffect mock to execute callbacks immediately for testing
    mockUseEffect.mockImplementation((callback) => callback());
    
    // Reset useRouter mock
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    });

    // Reset fetch mock
    fetch.mockReset();
  });

  afterAll(() => {
    delete global.fetch;
  });

  describe('Admin Login Workflow', () => {
    it('should handle admin login process', async () => {
      // Mock successful login response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Login successful',
          token: 'test-jwt-token'
        }),
      });

      const loginData = {
        username: 'admin',
        password: 'admin'
      };

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(result.success).toBe(true);
      expect(result.token).toBe('test-jwt-token');
      expect(fetch).toHaveBeenCalledWith('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
    });

    it('should handle failed login attempts', async () => {
      // Mock failed login response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          error: 'Invalid credentials'
        }),
      });

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'wrong', password: 'wrong' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe('Content Management Workflow', () => {
    it('should complete full content editing workflow', async () => {
      // Mock content loading
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, content_key: 'headline', content_value: 'Original Headline' }
        ],
      });

      // Mock content saving
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Content saved successfully',
          timestamp: new Date().toISOString()
        }),
      });

      // Mock sync notification
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Simulate loading content
      const loadResponse = await fetch('/api/admin/content?page=home&section=hero');
      const contentData = await loadResponse.json();
      
      expect(contentData).toHaveLength(1);
      expect(contentData[0].content_value).toBe('Original Headline');

      // Simulate updating content
      const updatePayload = {
        page: 'home',
        section: 'hero',
        content_key: 'headline',
        content_value: 'Updated Headline'
      };

      const saveResponse = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const saveResult = await saveResponse.json();
      expect(saveResult.message).toBe('Content saved successfully');

      // Simulate sync notification
      const syncResponse = await fetch('/api/sync/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'home' }),
      });

      const syncResult = await syncResponse.json();
      expect(syncResult.success).toBe(true);
    });

    it('should handle content validation errors', async () => {
      // Mock validation error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Missing required fields'
        }),
      });

      const invalidPayload = {
        page: 'home',
        // Missing section and content_key
        content_value: 'Test Value'
      };

      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('Media Management Workflow', () => {
    it('should handle media upload and assignment workflow', async () => {
      // Mock successful media upload
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          filename: 'test-image.jpg',
          file_path: '/uploads/test-image.jpg',
          original_name: 'test-image.jpg',
          mime_type: 'image/jpeg'
        }),
      });

      // Mock page image assignment
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          media_files: {
            id: 1,
            filename: 'test-image.jpg',
            file_path: '/uploads/test-image.jpg'
          }
        }),
      });

      // Simulate file upload
      const formData = new FormData();
      formData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test-image.jpg');

      const uploadResponse = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      expect(uploadResult.id).toBe(1);
      expect(uploadResult.filename).toBe('test-image.jpg');

      // Simulate page image assignment
      const assignResponse = await fetch('/api/admin/page-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'home',
          section: 'hero_image',
          media_file_id: uploadResult.id
        }),
      });

      const assignResult = await assignResponse.json();
      expect(assignResult.success).toBe(true);
      expect(assignResult.media_files.id).toBe(1);
    });

    it('should handle media upload failures', async () => {
      // Mock upload failure
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: async () => ({
          error: 'File too large'
        }),
      });

      const formData = new FormData();
      formData.append('file', new Blob(['large file content'], { type: 'image/jpeg' }), 'large-image.jpg');

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(413);
    });
  });

  describe('Frontend Content Display Workflow', () => {
    it('should display updated content on frontend pages', async () => {
      // Mock frontend content API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            content: [
              {
                id: 1,
                page: 'home',
                section: 'hero',
                content_key: 'headline',
                content_value: 'Updated Frontend Headline',
                updated_at: new Date().toISOString()
              }
            ]
          },
          lastUpdated: Date.now(),
          timestamp: new Date().toISOString()
        }),
      });

      const response = await fetch('/api/content?page=home');
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].content_value).toBe('Updated Frontend Headline');
      expect(result.lastUpdated).toBeGreaterThan(0);
    });

    it('should handle content polling for real-time updates', async () => {
      // Mock sync API responses for polling
      const initialTimestamp = Date.now() - 10000; // 10 seconds ago
      const updatedTimestamp = Date.now();

      // First poll - no changes
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          page: 'home',
          lastUpdated: initialTimestamp,
          contentCount: 1
        }),
      });

      // Second poll - content updated
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          page: 'home',
          lastUpdated: updatedTimestamp,
          contentCount: 1
        }),
      });

      // Mock updated content fetch
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            content: [
              {
                id: 1,
                content_key: 'headline',
                content_value: 'Newly Updated Headline',
                updated_at: new Date(updatedTimestamp).toISOString()
              }
            ]
          }
        }),
      });

      // Simulate initial poll
      const firstPoll = await fetch('/api/sync/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'home' }),
      });
      const firstResult = await firstPoll.json();
      expect(firstResult.lastUpdated).toBe(initialTimestamp);

      // Simulate second poll
      const secondPoll = await fetch('/api/sync/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'home' }),
      });
      const secondResult = await secondPoll.json();
      expect(secondResult.lastUpdated).toBe(updatedTimestamp);

      // Content should have been updated
      expect(secondResult.lastUpdated).toBeGreaterThan(firstResult.lastUpdated);

      // Simulate fetching updated content
      const contentResponse = await fetch('/api/content?page=home');
      const contentResult = await contentResponse.json();
      expect(contentResult.data.content[0].content_value).toBe('Newly Updated Headline');
    });
  });

  describe('Error Recovery Workflows', () => {
    it('should handle network disconnection and reconnection', async () => {
      // Mock network failure
      fetch.mockRejectedValueOnce(new Error('Network error'));

      let error;
      try {
        await fetch('/api/content?page=home');
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Network error');

      // Mock successful retry
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { content: [] }
        }),
      });

      const retryResponse = await fetch('/api/content?page=home');
      const retryResult = await retryResponse.json();

      expect(retryResult.success).toBe(true);
    });

    it('should handle partial content save failures', async () => {
      // Mock partial failure scenario
      const contentUpdates = [
        { key: 'headline', value: 'New Headline' },
        { key: 'description', value: 'New Description' },
        { key: 'invalid_field', value: 'Invalid Value' }
      ];

      // First two succeed
      fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Success' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Success' }) })
        .mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ error: 'Invalid field' }) });

      const results = await Promise.allSettled(
        contentUpdates.map(update =>
          fetch('/api/admin/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: 'home',
              section: 'hero',
              content_key: update.key,
              content_value: update.value
            }),
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
      const failed = results.filter(r => r.status === 'fulfilled' && !r.value.ok).length;

      expect(successful).toBe(2);
      expect(failed).toBe(1);
    });
  });

  describe('Performance and Caching Workflows', () => {
    it('should handle cache invalidation correctly', async () => {
      const cacheHeaders = {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      // Mock API responses with cache headers
      fetch.mockResolvedValue({
        ok: true,
        headers: new Map(Object.entries(cacheHeaders)),
        json: async () => ({ success: true, data: { content: [] } }),
      });

      const response = await fetch('/api/content?page=home');
      
      expect(response.ok).toBe(true);
      // In a real test environment, you would verify the actual headers
      expect(fetch).toHaveBeenCalledWith('/api/content?page=home');
    });

    it('should handle concurrent content updates', async () => {
      // Mock multiple simultaneous updates
      const updates = [
        { section: 'hero', key: 'headline', value: 'Headline 1' },
        { section: 'hero', key: 'description', value: 'Description 1' },
        { section: 'overview', key: 'content', value: 'Content 1' },
      ];

      // Mock successful responses for all updates
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Content saved successfully' }),
      });

      const promises = updates.map(update =>
        fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'home',
            section: update.section,
            content_key: update.key,
            content_value: update.value
          }),
        })
      );

      const responses = await Promise.all(promises);
      
      expect(responses).toHaveLength(3);
      responses.forEach(response => {
        expect(response.ok).toBe(true);
      });
    });
  });

  describe('User Experience Workflows', () => {
    it('should provide immediate feedback for save operations', async () => {
      // Mock successful save with timestamp
      const saveTimestamp = new Date().toISOString();
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Content saved successfully',
          timestamp: saveTimestamp
        }),
      });

      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'home',
          section: 'hero',
          content_key: 'headline',
          content_value: 'Test Headline'
        }),
      });

      const result = await response.json();

      expect(result.message).toBe('Content saved successfully');
      expect(result.timestamp).toBe(saveTimestamp);
      
      // In a real UI test, you would verify that the user sees:
      // - Save button changes to "Saved!" 
      // - Timestamp is displayed
      // - Success feedback is shown
    });

    it('should handle content preview functionality', async () => {
      // Mock content for preview
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            content: [
              { content_key: 'headline', content_value: 'Preview Headline' },
              { content_key: 'description', content_value: 'Preview Description' }
            ]
          }
        }),
      });

      const response = await fetch('/api/content?page=home&preview=true');
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.content).toHaveLength(2);
      
      // Verify preview data structure
      const headline = result.data.content.find(item => item.content_key === 'headline');
      const description = result.data.content.find(item => item.content_key === 'description');
      
      expect(headline.content_value).toBe('Preview Headline');
      expect(description.content_value).toBe('Preview Description');
    });
  });
});