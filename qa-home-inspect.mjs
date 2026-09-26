// Inspect the /home page after login: what is actually in the DOM?
export default async function run(page, ui) {
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const snap = await ui.snapshot();
  const refs = [...snap.matchAll(/@(e\d+) textbox/g)].map((m) => m[1]);
  await ui.fill('@' + refs[0], 'user@test.com');
  await ui.fill('@' + refs[1], 'test123');
  await page.keyboard.press('Enter');

  await page.waitForTimeout(6000);

  const info = await page.evaluate(() => ({
    url: location.href,
    mainText: (document.querySelector('main')?.innerText || '').slice(0, 600),
    cardCount: document.querySelectorAll('.ds-route-card').length,
    routeGrid: !!document.querySelector('.ds-route-grid'),
    emptyBlock: document.querySelector('.ds-empty')?.innerText?.slice(0, 200) || null,
    loading: !!document.querySelector('.loading'),
    alerts: [...document.querySelectorAll('.ds-alert')].map((a) => a.innerText),
    bodyLen: document.body.innerText.length,
  }));

  return info;
}