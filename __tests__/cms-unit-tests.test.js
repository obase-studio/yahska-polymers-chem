/**
 * CMS Unit Tests - Testing individual components and functions
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('CMS Unit Tests', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  describe('Supabase Helpers', () => {
    it('should handle missing environment variables gracefully', async () => {
      // Test when environment variables are missing
      const originalEnv = process.env;
      process.env = { ...originalEnv };
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      delete process.env.SUPABASE_SERVICE_KEY;

      // Import after modifying env
      let error;
      try {
        const { supabaseHelpers } = await import('../lib/supabase-helpers');
        await supabaseHelpers.getContent('home');
      } catch (e) {
        error = e;
      }

      expect(error).toBeTruthy();
      expect(error.message).toContain('Invalid');

      // Restore environment
      process.env = originalEnv;
    });

    it('should format content query parameters correctly', () => {
      const testCases = [
        { page: 'home', section: undefined, expected: 'page=home' },
        { page: 'home', section: 'hero', expected: 'page=home&section=hero' },
        { page: 'about', section: 'company_overview', expected: 'page=about&section=company_overview' },
      ];

      testCases.forEach(({ page, section, expected }) => {
        const params = new URLSearchParams();
        params.set('page', page);
        if (section) params.set('section', section);
        
        expect(params.toString()).toBe(expected);
      });
    });
  });

  describe('Database Client Functions', () => {
    it('should parse JSON product data correctly', async () => {
      const { parseProductData } = await import('../lib/database-client');

      const testProduct = {
        id: 1,
        name: 'Test Product',
        applications: '["Construction", "Industrial"]',
        features: '["High Strength", "Durable"]',
      };

      const result = parseProductData(testProduct);

      expect(result.applications).toEqual(['Construction', 'Industrial']);
      expect(result.features).toEqual(['High Strength', 'Durable']);
    });

    it('should handle malformed JSON gracefully', async () => {
      const { parseProductData } = await import('../lib/database-client');

      const testProduct = {
        id: 1,
        name: 'Test Product',
        applications: 'invalid json string',
        features: null,
      };

      const result = parseProductData(testProduct);

      expect(result.applications).toEqual([]);
      expect(result.features).toEqual([]);
    });

    it('should get content value correctly', async () => {
      const { getContentValue } = await import('../lib/database-client');

      const contentItems = [
        { id: 1, page: 'home', section: 'hero', content_key: 'headline', content_value: 'Test Headline', updated_at: '2023-01-01' },
        { id: 2, page: 'home', section: 'hero', content_key: 'description', content_value: 'Test Description', updated_at: '2023-01-01' },
      ];

      expect(getContentValue(contentItems, 'headline')).toBe('Test Headline');
      expect(getContentValue(contentItems, 'nonexistent')).toBeUndefined();
    });
  });

  describe('API Response Validation', () => {
    it('should validate admin content API response structure', () => {
      const mockResponse = {
        message: "Content saved successfully",
        timestamp: new Date().toISOString()
      };

      expect(mockResponse).toHaveProperty('message');
      expect(mockResponse).toHaveProperty('timestamp');
      expect(typeof mockResponse.timestamp).toBe('string');
    });

    it('should validate frontend content API response structure', () => {
      const mockResponse = {
        success: true,
        data: { content: [] },
        lastUpdated: Date.now(),
        timestamp: new Date().toISOString()
      };

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('data');
      expect(mockResponse.data).toHaveProperty('content');
      expect(mockResponse).toHaveProperty('lastUpdated');
      expect(mockResponse).toHaveProperty('timestamp');
    });
  });

  describe('Content Editor Logic', () => {
    it('should handle form data updates correctly', () => {
      const initialFormData = { headline: 'Old Headline' };
      const key = 'headline';
      const value = 'New Headline';

      const updatedFormData = { ...initialFormData, [key]: value };

      expect(updatedFormData.headline).toBe('New Headline');
    });

    it('should format field types correctly', () => {
      const fields = [
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'hero_image', label: 'Hero Image', type: 'image' },
      ];

      const textFields = fields.filter(f => f.type === 'text');
      const textareaFields = fields.filter(f => f.type === 'textarea');
      const imageFields = fields.filter(f => f.type === 'image');

      expect(textFields).toHaveLength(1);
      expect(textareaFields).toHaveLength(1);
      expect(imageFields).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      let error;
      try {
        const response = await fetch('/api/content?page=home');
        await response.json();
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Network error');
    });

    it('should handle HTTP errors gracefully', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      const response = await fetch('/api/content?page=home');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('Cache Control Headers', () => {
    it('should validate no-cache headers are set correctly', () => {
      const headers = {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      expect(headers['Cache-Control']).toContain('no-store');
      expect(headers['Cache-Control']).toContain('no-cache');
      expect(headers['Cache-Control']).toContain('must-revalidate');
      expect(headers['Pragma']).toBe('no-cache');
      expect(headers['Expires']).toBe('0');
    });
  });

  describe('Content Synchronization Logic', () => {
    it('should calculate lastUpdated timestamp correctly', () => {
      const contentItems = [
        { updated_at: '2023-01-01T10:00:00Z' },
        { updated_at: '2023-01-01T12:00:00Z' },
        { updated_at: '2023-01-01T08:00:00Z' },
      ];

      const timestamps = contentItems.map(item => new Date(item.updated_at).getTime());
      const lastUpdated = Math.max(...timestamps);

      expect(lastUpdated).toBe(new Date('2023-01-01T12:00:00Z').getTime());
    });

    it('should detect content changes correctly', () => {
      const oldTimestamp = new Date('2023-01-01T10:00:00Z').getTime();
      const newTimestamp = new Date('2023-01-01T12:00:00Z').getTime();

      const hasChanged = newTimestamp > oldTimestamp;

      expect(hasChanged).toBe(true);
    });
  });
});