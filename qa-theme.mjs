// Verifies the retheme: sign in, then read the computed colours of the
// design-system surfaces (sidebar, navbar, cards, tints, gold accents).
export default async function run(page, ui) {
  await page.locator('input[type="email"]').fill('admin@bust.ph')
  await page.locator('input[type="password"]').fill('password123')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForTimeout(2000)

  await page.goto('http://localhost:3000/home', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)

  const probe = await page.evaluate(() => {
    const grab = (sel, prop, pseudo) => {
      const el = document.querySelector(sel)
      if (!el) return '<absent>'
      return getComputedStyle(el, pseudo || null)[prop]
    }
    return {
      path: location.pathname,
      appBg: grab('.ds-app', 'backgroundColor'),
      sidebarBg: grab('.ds-sidebar', 'backgroundImage'),
      activeNavBg: grab('.ds-nav-item.is-active', 'backgroundColor'),
      activeNavColor: grab('.ds-nav-item.is-active', 'color'),
      sidebarBrandSub: grab('.ds-sidebar-brand-text span', 'color'),
      navStatIconBox: grab('.ds-nav-stat-icon', 'backgroundColor'),
      statIconBox: grab('.ds-stat-icon', 'backgroundColor'),
      statIconColor: grab('.ds-stat-icon', 'color'),
      homeHeroImg: grab('.ds-home-hero', 'backgroundImage'),
      primaryBtnBg: grab('.ds-btn-primary', 'backgroundColor'),
      cardBorder: grab('.ds-card', 'borderTopColor'),
      spinner: grab('.ds-spinner', 'borderTopColor'),
      // money values should be gold/amber
      routePrice: grab('.ds-route-price', 'color'),
      rowFare: grab('.ds-row-fare', 'color'),
      // legacy sidebar kept for unmigrated pages
      legacySidebarImg: grab('.sidebar', 'backgroundImage'),
      goldBadge: grab('.ds-badge-gold', 'backgroundColor'),
    }
  })

  return probe
}