// Log in properly (click the button, not Enter) and inspect /home.
export default async function run(page, ui) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const snap = await ui.snapshot();
  const refs = [...snap.matchAll(/@(e\d+) textbox/g)].map((m) => m[1]);
  await ui.fill('@' + refs[0], 'user@test.com');
  await ui.fill('@' + refs[1], 'test123');

  const btn = snap.match(/@(e\d+) button "Log in"/)?.[1];
  if (!btn) return { error: 'no login button', snap };
  await ui.click('@' + btn);

  await page.waitForTimeout(8000);

  const info = await page.evaluate(() => ({
    url: location.href,
    cookies: document.cookie,
    heading: document.querySelector('.ds-page-title')?.innerText ?? null,
    cardCount: document.querySelectorAll('.ds-route-card').length,
    cards: [...document.querySelectorAll('.ds-route-card')].map((c) =>
      c.innerText.replace(/\s+/g, ' ').trim()
    ),
    sidebarLinks: [...document.querySelectorAll('.ds-nav-item')].map((a) => a.innerText.trim()),
    authLoading: !!document.querySelector('.ds-auth-loading'),
    mainLen: (document.querySelector('main')?.innerText || '').length,
  }));

  return { ...info, errors };
}