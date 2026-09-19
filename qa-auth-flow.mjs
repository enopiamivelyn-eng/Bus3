export default async function run(page) {
  const BASE = 'http://localhost:3000';
  const out = {};

  async function visit(path) {
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    return {
      status: res ? res.status() : 0,
      url: page.url().replace(BASE, ''),
      sidebar: await page.locator('.ds-sidebar').count(),
      guestNav: await page.locator('.ds-nav-guest').count(),
      appNav: await page.locator('.ds-nav:not(.ds-nav-guest)').count(),
      loginCardOnLanding: await page.locator('.ds-hero-card').count(),
      cta: await page.locator('.ds-hero-cta').count(),
    };
  }

  // 1. Guest hits the landing page — no sidebar, no embedded login card.
  await page.context().clearCookies();
  await page.goto(BASE + '/');
  await page.evaluate(() => window.localStorage.clear());
  out.guestLanding = await visit('/');

  // 2. A guest trying to reach /home must be bounced to /login.
  out.guestHomeRedirect = await visit('/home');

  // 3. A guest trying a protected page must be bounced too.
  out.guestBookingsRedirect = await visit('/bookings');

  // 4. Log in through the real form on /login.
  await visit('/login');
  await page.fill('#email', 'joybus@example.com');
  await page.fill('#password', 'secret123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/home', { timeout: 15000 }).catch(() => {});
  await page.waitForSelector('.ds-sidebar', { timeout: 15000 }).catch(() => {});

  out.afterLogin = {
    url: page.url().replace(BASE, ''),
    sidebar: await page.locator('.ds-sidebar').count(),
    pagesNav: await page.locator('.ds-nav:not(.ds-nav-guest)').count(),
    greeting: await page.locator('.ds-page-title').first().innerText().catch(() => null),
    sidebarName: await page
      .locator('.ds-sidebar-foot-text strong')
      .innerText()
      .catch(() => null),
  };

  // 5. Session should survive a fresh visit to /home.
  out.authedHome = await visit('/home');
  out.authedBookings = await visit('/bookings');

  // 6. Log out from the sidebar and confirm we are pushed back out.
  const logout = page.locator('.ds-sidebar-logout');
  if (await logout.count()) {
    await logout.first().click();
    await page.waitForTimeout(1200);
    out.afterLogout = {
      url: page.url().replace(BASE, ''),
      sidebar: await page.locator('.ds-sidebar').count(),
    };
    out.homeAfterLogout = await visit('/home');
  }

  return out;
}
