// Capture any client-side exception thrown while /home renders.
export default async function run(page, ui) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('CONSOLE: ' + m.text());
  });

  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const snap = await ui.snapshot();
  const refs = [...snap.matchAll(/@(e\d+) textbox/g)].map((m) => m[1]);
  await ui.fill('@' + refs[0], 'user@test.com');
  await ui.fill('@' + refs[1], 'test123');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(7000);

  // What is the SSR'd HTML the server sent for /home?
  const resp = await page.request.get('http://localhost:3000/home', {
    headers: { cookie: (await page.context().cookies()).map((c) => `${c.name}=${c.value}`).join('; ') },
  });
  const html = await resp.text();

  return {
    url: page.url(),
    errors,
    homeStatus: resp.status(),
    homeHtmlLen: html.length,
    htmlSnippet: html.slice(0, 1200),
  };
}