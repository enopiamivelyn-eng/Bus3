// Log in as the seeded passenger and read what the Home route cards actually render.
export default async function run(page, ui) {
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const snap = await ui.snapshot();
  const emailRef = snap.match(/@(e\d+) textbox/)?.[1];
  const emailRefs = [...snap.matchAll(/@(e\d+) textbox/g)].map((m) => m[1]);
  const passRef = emailRefs[1];

  await ui.fill('@' + emailRefs[0], 'user@test.com');
  await ui.fill('@' + passRef, 'test123');

  const loginBtn = snap.match(/@(e\d+) button "Log in"/)?.[1]
    || snap.match(/@(e\d+) button "Sign in"/)?.[1];
  if (loginBtn) await ui.click('@' + loginBtn);
  else await page.keyboard.press('Enter');

  await page.waitForURL('**/home', { timeout: 15000 }).catch(() => { });
  await page.waitForTimeout(3000);

  // Read the route-card text exactly as a user would see it.
  const cardText = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.ds-route-card')];
    return cards.map((c) => c.innerText.replace(/\s+/g, ' ').trim());
  });

  const heading = await page.evaluate(() => {
    const h = document.querySelector('.ds-page-title');
    return h ? h.innerText : null;
  });

  return {
    url: page.url(),
    heading,
    cardCount: cardText.length,
    cards: cardText,
    hasUndefined: cardText.some((t) => /undefined/i.test(t)),
    hasNaN: cardText.some((t) => /NaN/i.test(t)),
  };
}