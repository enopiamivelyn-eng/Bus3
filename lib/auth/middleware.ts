import { NextRequest } from 'next/server';
import { TokenPayload } from './jwt';
import { getSupabaseUser } from '@/lib/supabase';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: TokenPayload | null; error?: string }> {
  try {
    // Get token from cookie or Authorization header
    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return { user: null, error: 'No authentication token provided' };
    }

    const account = await getSupabaseUser(token);
    return {
      user: {
        userId: account.id,
        email: account.email,
        role: account.app_metadata?.role === 'admin' ? 'admin' : 'passenger',
        exp: Number.MAX_SAFE_INTEGER,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Check if user has required role
 */
export function requireRole(user: TokenPayload | null, requiredRole: string): boolean {
  if (!user) return false;
  return user.role === requiredRole || user.role === 'admin';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: TokenPayload | null): boolean {
  return user?.role === 'admin';
}
