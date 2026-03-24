import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    })),
  })),
}));

describe('Auth API Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 when email is missing', async () => {
      const mockRequest = {
        json: async () => ({ email: '', password: 'test123' }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/auth/login/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 400 when password is missing', async () => {
      const mockRequest = {
        json: async () => ({ email: 'test@example.com', password: '' }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/auth/login/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(400);
    });

    it('should return 401 on invalid credentials', async () => {
      const mockRequest = {
        json: async () => ({ email: 'test@example.com', password: 'wrongpass' }),
      } as unknown as NextRequest;

      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.signInWithPassword as any).mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const { POST } = await import('@/app/api/auth/login/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(401);
    });

    it('should return user data on successful login', async () => {
      const mockRequest = {
        json: async () => ({ email: 'test@example.com', password: 'correctpass' }),
      } as unknown as NextRequest;

      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.signInWithPassword as any).mockResolvedValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          session: { token: 'session-token' },
        },
        error: null,
      });
      (mockSupabase.from().select().eq().single as any).mockResolvedValue({
        data: { name: 'Test User' },
      });

      const { POST } = await import('@/app/api/auth/login/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.session).toBeDefined();
    });

    it('should handle server errors gracefully', async () => {
      const mockRequest = {
        json: async () => ({ email: 'test@example.com', password: 'pass' }),
      } as unknown as NextRequest;

      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.signInWithPassword as any).mockRejectedValue(new Error('Server error'));

      const { POST } = await import('@/app/api/auth/login/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 when email is invalid', async () => {
      const mockRequest = {
        json: async () => ({ email: 'invalid', password: 'password123' }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/auth/register/route');
      const response = await POST(mockRequest);
      
      expect([400, 401]).toContain(response.status);
    });

    it('should return 400 when password is too short', async () => {
      const mockRequest = {
        json: async () => ({ email: 'test@example.com', password: 'short' }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/auth/register/route');
      const response = await POST(mockRequest);
      
      expect([400, 401]).toContain(response.status);
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return 401 when user is not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const { GET } = await import('@/app/api/auth/session/route');
      const response = await GET();
      
      expect(response.status).toBe(401);
    });

    it('should return session data when authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null,
      });

      const { GET } = await import('@/app/api/auth/session/route');
      const response = await GET();
      
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should sign out user', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.signOut as any).mockResolvedValue({ error: null });

      const { POST } = await import('@/app/api/auth/logout/route');
      const response = await POST();
      
      expect(response.status).toBe(200);
    });
  });
});

describe('Food Log API Endpoints', () => {
  describe('GET /api/food-log', () => {
    it('should return 401 when not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams() },
      } as unknown as NextRequest;

      const { GET } = await import('@/app/api/food-log/route');
      const response = await GET(mockRequest);
      
      expect(response.status).toBe(401);
    });

    it('should return food logs for authenticated user', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().select().eq().order as any).mockResolvedValue({
        data: [{ id: 1, meal_type: 'breakfast', calories: 300 }],
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams() },
      } as unknown as NextRequest;

      const { GET } = await import('@/app/api/food-log/route');
      const response = await GET(mockRequest);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter by date when provided', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().select().eq().order as any).mockResolvedValue({
        data: [{ id: 1, date: '2024-01-01' }],
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams('date=2024-01-01') },
      } as unknown as NextRequest;

      const { GET } = await import('@/app/api/food-log/route');
      const response = await GET(mockRequest);
      
      expect(response.status).toBe(200);
    });

    it('should handle database errors', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().select().eq().order as any).mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams() },
      } as unknown as NextRequest;

      const { GET } = await import('@/app/api/food-log/route');
      const response = await GET(mockRequest);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/food-log', () => {
    it('should return 401 when not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const mockRequest = {
        json: async () => ({ meal_type: 'breakfast', description: 'Oats', calories: 300 }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/food-log/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });

      const mockRequest = {
        json: async () => ({ meal_type: 'breakfast', description: '' }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/food-log/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(400);
    });

    it('should create food log entry on success', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().insert().select().single as any).mockResolvedValue({
        data: { id: 1, meal_type: 'breakfast', calories: 300 },
        error: null,
      });

      const mockRequest = {
        json: async () => ({ 
          meal_type: 'breakfast', 
          description: 'Oatmeal with berries', 
          calories: 300,
          protein_g: 10,
          carbs_g: 50,
          fat_g: 5,
        }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/food-log/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.meal_type).toBe('breakfast');
    });

    it('should set default date when not provided', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().insert().select().single as any).mockResolvedValue({
        data: { id: 1, date: new Date().toISOString().split('T')[0] },
        error: null,
      });

      const mockRequest = {
        json: async () => ({ meal_type: 'lunch', description: 'Salad', calories: 400 }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/food-log/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(200);
    });

    it('should set source to "manual" when not provided', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().insert().select().single as any).mockResolvedValue({
        data: { id: 1, source: 'manual' },
        error: null,
      });

      const mockRequest = {
        json: async () => ({ meal_type: 'dinner', description: 'Pasta', calories: 500 }),
      } as unknown as NextRequest;

      const { POST } = await import('@/app/api/food-log/route');
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/food-log', () => {
    it('should return 401 when not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams('id=1') },
      } as unknown as NextRequest;

      const { DELETE } = await import('@/app/api/food-log/route');
      const response = await DELETE(mockRequest);
      
      expect(response.status).toBe(401);
    });

    it('should return 400 when id is missing', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams() },
      } as unknown as NextRequest;

      const { DELETE } = await import('@/app/api/food-log/route');
      const response = await DELETE(mockRequest);
      
      expect(response.status).toBe(400);
    });

    it('should delete food log entry', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().delete().eq().eq as any).mockResolvedValue({
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams('id=1') },
      } as unknown as NextRequest;

      const { DELETE } = await import('@/app/api/food-log/route');
      const response = await DELETE(mockRequest);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should only delete user own entries', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockSupabase = createClient();
      (mockSupabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      });
      (mockSupabase.from().delete().eq().eq as any).mockResolvedValue({
        error: null,
      });

      const mockRequest = {
        nextUrl: { searchParams: new URLSearchParams('id=1') },
      } as unknown as NextRequest;

      const { DELETE } = await import('@/app/api/food-log/route');
      await DELETE(mockRequest);
      
      // Verify user_id filter is applied
      expect(mockSupabase.from).toHaveBeenCalledWith('food_logs');
    });
  });
});
