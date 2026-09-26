import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUser, supabaseAuth, writeLoginLog } from '@/lib/supabase';

interface AuthResult { access_token: string; expires_in?: number; user: { id: string; email?: string; user_metadata?: { name?: string }; app_metadata?: { role?: string } } }

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const auth = await supabaseAuth<AuthResult>('token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    const user = await getSupabaseUser(auth.access_token);
    await writeLoginLog(user, auth.access_token);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.user_metadata?.name || user.email.split('@')[0], role: user.app_metadata?.role === 'admin' ? 'admin' : 'passenger' },
    });
    response.cookies.set('auth-token', auth.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: auth.expires_in || 3600,
      path: '/',
    });
    return response;
  } catch (error) {
    const status = (error as { status?: number }).status;
    const code = (error as { code?: string }).code;
    if (code === 'PGRST205' || (status === 404 && error instanceof Error && error.message.includes('login event'))) {
      return NextResponse.json({
        error: 'Login record table is not installed yet. Run supabase-auth-migration.sql in the Supabase SQL Editor, then try again.',
      }, { status: 503 });
    }
    if (error instanceof Error && error.message.includes('login event')) {
      console.error('Supabase login-log insert failed:', { status, code });
      return NextResponse.json({ error: 'Could not record your login. Check the login-log table RLS policies in Supabase.' }, { status: 503 });
    }
    const rawMessage = error instanceof Error ? error.message : '';
    if (status === 429 || /rate limit|too many requests/i.test(rawMessage)) {
      return NextResponse.json({
        error: 'Supabase temporarily rate-limited this request. Wait before trying again. If this happened while creating an account, configure custom SMTP for confirmation emails in Supabase Auth settings.',
      }, { status: 429 });
    }
    const message = status === 400 || status === 401
      ? 'Invalid email or password.'
      : rawMessage || 'Login failed.';
    return NextResponse.json({ error: message }, { status: status === 400 || status === 401 ? 401 : 500 });
  }
}
