// JWT utilities using Web Crypto API (no external dependencies)

const SECRET_KEY = process.env.JWT_SECRET || 'change-this-secret-in-production-12345678';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Base64url-encode a string.
 *
 * Plain base64 pads with '=' and uses '+'/'/'. A JWT is stored in a cookie
 * (and may appear in a URL), and '=' terminates a cookie value — the '=' in
 * the payload segment made the browser truncate the token, so every request
 * arrived with a token that could never verify and no one could stay signed
 * in. base64url is the encoding JWTs are specified to use and contains none
 * of those characters.
 */
function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Reverse of base64UrlEncode — restores the padding atob() expects. */
function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  return atob(base64 + padding);
}

// Simple JWT implementation using base64url
export async function createToken(payload: Omit<TokenPayload, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
  const fullPayload: TokenPayload = { ...payload, exp };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = await sign(`${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    // Tolerate a URL-encoded cookie value: the browser may hand back '%3D'
    // for padding written by an older token format.
    const [encodedHeader, encodedPayload, signature] = decodeURIComponent(token).split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`);
    if (signature !== expectedSignature) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

async function sign(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(SECRET_KEY);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, dataBuffer);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
