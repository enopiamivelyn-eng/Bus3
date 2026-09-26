import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUser } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  try {
    const user = await getSupabaseUser(token);
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.user_metadata?.name || user.email.split('@')[0], role: user.app_metadata?.role === 'admin' ? 'admin' : 'passenger' },
    });
  } catch {
    const response = NextResponse.json({ error: 'Session is invalid or expired.' }, { status: 401 });
    response.cookies.delete('auth-token');
    return response;
  }
}
