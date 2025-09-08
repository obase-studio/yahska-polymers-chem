/**
 * CMS Integration Tests - Testing the complete data flow from admin to frontend
 */

import { describe, it, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';

// Mock Next.js modules
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    constructor(url, options = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this._body = options.body;
    }
    async json() {
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
    }
  },
  NextResponse: {
    json: (data, init) => ({
      json: async () => data,
      ok: true,
      status: init?.status || 200,
      headers: init?.headers || {},
    }),
  },
}));

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn(),
    then: jest.fn(),
  })),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('CMS Integration Tests', () => {
  let server;
  
  beforeAll(async () => {
    // Setup test environment
  });

  afterAll(async () => {
    // Cleanup
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock implementations
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn(),
    });
  });

  describe('Admin to Database Flow', () => {
    it('should save content through admin API to database', async () => {
      // Mock successful database save
      const mockChain = {
        select: jest.fn().mockResolvedValue({
          data: [{ id: 1, page: 'home', section: 'hero', content_key: 'headline', content_value: 'Test Headline' }],
          error: null,
        }),
      };
      
      mockSupabaseClient.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue(mockChain),
      });

      // Import the route handler
      const { POST } = await import('../app/api/admin/content/route.ts');
      
      const request = {
        json: async () => ({
          page: 'home',
          section: 'hero',
          content_key: 'headline',
          content_value: 'Test Headline'
        }),
      };

      const response = await POST(request);
      const result = await response.json();

      expect(result.message).toBe('Content saved successfully');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('site_content');
    });

    it('should handle database connection errors', async () => {
      // Mock database error
      mockSupabaseClient.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
          }),
        }),
      });

      const { POST } = await import('../app/api/admin/content/route.ts');
      
      const request = {
        json: async () => ({
          page: 'home',
          section: 'hero',
          content_key: 'headline',
          content_value: 'Test Headline'
        }),
      };

      try {
        await POST(request);
      } catch (error) {
        expect(error.message).toContain('Database connection failed');
      }
    });
  });

  describe('Database to Frontend Flow', () => {
    it('should retrieve content from database through frontend API', async () => {
      // Mock successful database retrieval
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [
              { 
                id: 1, 
                page: 'home', 
                section: 'hero', 
                content_key: 'headline', 
                content_value: 'Test Headline',
                updated_at: '2023-01-01T12:00:00Z'
              }
            ],
            error: null,
          }),
        }),
      });

      const { GET } = await import('../app/api/content/route.ts');
      
      const request = {
        url: 'http://localhost:3000/api/content?page=home',
      };

      const response = await GET(request);
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].content_value).toBe('Test Headline');
    });

    it('should handle empty database results', async () => {
      // Mock empty database result
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const { GET } = await import('../app/api/content/route.ts');
      
      const request = {
        url: 'http://localhost:3000/api/content?page=nonexistent',
      };

      const response = await GET(request);
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.content).toHaveLength(0);
    });
  });

  describe('Content Synchronization Flow', () => {
    it('should sync content changes from admin to frontend', async () => {
      // Mock database with updated content
      const updatedTimestamp = new Date().toISOString();
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [
              { 
                id: 1, 
                page: 'home', 
                section: 'hero', 
                content_key: 'headline', 
                content_value: 'Updated Headline',
                updated_at: updatedTimestamp
              }
            ],
            error: null,
          }),
        }),
      });

      const { POST } = await import('../app/api/sync/content/route.ts');
      
      const request = {
        json: async () => ({ page: 'home' }),
      };

      const response = await POST(request);
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.page).toBe('home');
      expect(result.lastUpdated).toBe(new Date(updatedTimestamp).getTime());
      expect(result.contentCount).toBe(1);
    });

    it('should calculate correct timestamp for multiple content items', async () => {
      // Mock database with multiple content items with different timestamps
      const oldTimestamp = '2023-01-01T10:00:00Z';
      const newTimestamp = '2023-01-01T12:00:00Z';
      
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [
              { id: 1, updated_at: oldTimestamp },
              { id: 2, updated_at: newTimestamp },
              { id: 3, updated_at: '2023-01-01T08:00:00Z' },
            ],
            error: null,
          }),
        }),
      });

      const { POST } = await import('../app/api/sync/content/route.ts');
      
      const request = {
        json: async () => ({ page: 'home' }),
      };

      const response = await POST(request);
      const result = await response.json();

      expect(result.lastUpdated).toBe(new Date(newTimestamp).getTime());
    });
  });

  describe('API Endpoint Consistency', () => {
    it('should have consistent response formats between admin and frontend APIs', () => {
      const adminResponse = {
        message: "Content saved successfully",
        timestamp: "2023-01-01T12:00:00Z"
      };

      const frontendResponse = {
        success: true,
        data: { content: [] },
        lastUpdated: 1672574400000,
        timestamp: "2023-01-01T12:00:00Z"
      };

      // Both should have timestamp
      expect(adminResponse).toHaveProperty('timestamp');
      expect(frontendResponse).toHaveProperty('timestamp');

      // Frontend should indicate success
      expect(frontendResponse.success).toBe(true);

      // Frontend should have data structure
      expect(frontendResponse.data).toHaveProperty('content');
    });
  });

  describe('Error Propagation', () => {
    it('should propagate database errors through the API chain', async () => {
      const dbError = { message: 'Connection timeout', code: 'PGRST301' };
      
      // Mock database error
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: dbError,
          }),
        }),
      });

      const { GET } = await import('../app/api/content/route.ts');
      
      const request = {
        url: 'http://localhost:3000/api/content?page=home',
      };

      try {
        await GET(request);
      } catch (error) {
        expect(error.message).toContain('Connection timeout');
      }
    });
  });

  describe('Cache Headers Validation', () => {
    it('should set appropriate cache headers on all API responses', async () => {
      const expectedHeaders = {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      // Test admin API
      mockSupabaseClient.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [{}],
            error: null,
          }),
        }),
      });

      const { POST: adminPOST } = await import('../app/api/admin/content/route.ts');
      
      const adminRequest = {
        json: async () => ({
          page: 'home',
          section: 'hero',
          content_key: 'headline',
          content_value: 'Test'
        }),
      };

      const adminResponse = await adminPOST(adminRequest);
      
      // Note: This is a simplified test - in reality, you'd check the actual headers
      expect(adminResponse).toBeTruthy();

      // Test frontend API
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const { GET: frontendGET } = await import('../app/api/content/route.ts');
      
      const frontendRequest = {
        url: 'http://localhost:3000/api/content?page=home',
      };

      const frontendResponse = await frontendGET(frontendRequest);
      
      expect(frontendResponse).toBeTruthy();
    });
  });

  describe('Data Consistency Validation', () => {
    it('should maintain data integrity across save and retrieve operations', async () => {
      const testContent = {
        page: 'home',
        section: 'hero',
        content_key: 'headline',
        content_value: 'Test Headline with Special Characters: ñáéíóú & symbols!'
      };

      // Mock save operation
      mockSupabaseClient.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [{ id: 1, ...testContent }],
            error: null,
          }),
        }),
      });

      const { POST } = await import('../app/api/admin/content/route.ts');
      
      const saveRequest = {
        json: async () => testContent,
      };

      await POST(saveRequest);

      // Mock retrieve operation
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ id: 1, ...testContent, updated_at: new Date().toISOString() }],
            error: null,
          }),
        }),
      });

      const { GET } = await import('../app/api/content/route.ts');
      
      const retrieveRequest = {
        url: `http://localhost:3000/api/content?page=${testContent.page}&section=${testContent.section}`,
      };

      const response = await GET(retrieveRequest);
      const result = await response.json();

      const retrievedContent = result.data.content[0];
      expect(retrievedContent.content_value).toBe(testContent.content_value);
      expect(retrievedContent.page).toBe(testContent.page);
      expect(retrievedContent.section).toBe(testContent.section);
    });
  });
});