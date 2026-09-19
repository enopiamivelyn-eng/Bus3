export default async function run(page) {
  const paths = [
    '/', '/dashboard', '/bookings', '/reservation', '/payment',
    '/routes', '/buses', '/trips', '/users', '/reports',
    '/login', '/signup', '/signin', '/about', '/profile',
    '/book-details', '/reserve', '/forgot-password', '/does-not-exist',
  ];

  const results = [];
  const failures = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') failures.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => failures.push(`pageerror: ${err.message}`));

  for (const path of paths) {
    failures.length = 0;
    const res = await page.goto('http://localhost:3000' + path, {
      waitUntil: 'domcontentloaded',
    });
    const status = res ? res.status() : 0;
    const info = await page.evaluate(() => ({
      title: document.title,
      hasShell: Boolean(document.querySelector('.ds-nav')),
      hasSidebar: Boolean(document.querySelector('.ds-sidebar')),
      hasLegacy: Boolean(document.querySelector('.main-container')),
      legacySidebar: Boolean(document.querySelector('aside.sidebar')),
    }));
    results.push({ path, status, ...info, errors: [...failures] });
  }

  return results;
}
