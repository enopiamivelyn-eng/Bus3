// Password hashing utilities
// Note: bcrypt requires native bindings. For simplified demo, we'll use a basic implementation
// In production, use bcrypt or argon2

export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - replace with bcrypt in production
  // This is NOT secure for production use
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'SALT_KEY_CHANGE_IN_PRODUCTION');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}
