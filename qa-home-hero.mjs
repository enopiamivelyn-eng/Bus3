export default async function run(page) {
  const BASE = 'http://localhost:3000';
  const failed = [];
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  // Sign in so AuthGate lets us reach /home.
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#email', 'mivelyn@example.com');
  await page.fill('#password', 'secret123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/home', { timeout: 20000 });
  await page.waitForSelector('.ds-home-hero', { timeout: 20000 });
  await page.waitForTimeout(900);

  const info = await page.evaluate(() => {
    const hero = document.querySelector('.ds-home-hero');
    const before = getComputedStyle(hero, '::before');
    const after = getComputedStyle(hero, '::after');
    const h = hero.getBoundingClientRect();
    const title = document.querySelector('.ds-home-hero .ds-page-title');
    const tb = title.getBoundingClientRect();

    // Is the banner actually ABOVE the greeting text?
    return {
      greeting: title.innerText,
      sub: document.querySelector('.ds-home-hero .ds-page-sub').innerText,
      heroBox: {
        top: Math.round(h.top),
        left: Math.round(h.left),
        w: Math.round(h.width),
        h: Math.round(h.height),
      },
      session: {
        top: Math.round(tb.top),
        left: Math.round(tb.left),
      },
      titleAboveHeroTop: tb.top > h.top,
      paddingTop: getComputedStyle(hero).paddingTop,
      borderRadius: getComputedStyle(hero).borderRadius,
      // ::before = the photo, ::after = the gradient
      photo: before.backgroundImage,
      photoSize: before.backgroundSize,
      photoPos: before.backgroundPosition,
      gradient: after.backgroundImage.slice(0, 120),
      titleColor: getComputedStyle(title).color,
      titleShadow: getComputedStyle(title).textShadow,
    };
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: 'c:/Users/Admin/OneDrive/BUST/ticket/qa-home-hero.png',
  });

  return { ...info, httpErrors: failed };
}
