// Probes the lightgreen tints (#e0f7e9) and gold accents on the app pages.
// Signs in first, then waits for the auth gate to clear on each page.
export default async function run(page, ui) {
  await page.locator('input[type="email"]').fill('admin@bust.ph')
  await page.locator('input[type="password"]').fill('password123')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForTimeout(2500)

  const out = {}
  const tgt = {
    '/home': ['.ds-info-icon', '.ds-stat-icon', '.ds-row-fare'],
    '/routes': ['.ds-route-media', '.ds-route-price', '.ds-route-card'],
    '/bookings': ['.ds-row-fare', '.ds-badge-gold', '.ds-badge-blue'],
    '/profile': ['.ds-profile-banner', '.ds-profile-stat span'],
    '/reports': ['.ds-card', '.ds-table .ds-cell-price'],
    '/payment': ['.ds-pay-total', '.ds-method-icon', '.ds-steps li span'],
  }

  for (const [path, sels] of Object.entries(tgt)) {
    await page.goto('http://localhost:3000' + path, { waitUntil: 'domcontentloaded' })
    // The auth gate paints "Checking your session..." first — wait it out,
    // otherwise every selector below reads as absent.
    await page
      .waitForFunction(
        () => !document.body.innerText.includes('Checking your session'),
        null,
        { timeout: 15000 }
      )
      .catch(() => {})
    await page.waitForTimeout(700)

    out[path] = await page.evaluate((sels) => {
      const r = { _bodyChars: document.body.innerText.length }
      for (const s of sels) {
        const el = document.querySelector(s)
        if (!el) { r[s] = '<absent>'; continue }
        const cs = getComputedStyle(el)
        r[s] = [cs.backgroundColor, cs.color, cs.backgroundImage].filter(
          (v) => v && v !== 'none' && v !== 'rgba(0, 0, 0, 0)'
        ).join(' | ')
      }
      return r
    }, sels)
  }
  return out
}