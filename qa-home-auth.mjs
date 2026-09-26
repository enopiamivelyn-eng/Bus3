// Verify the authenticated shell renders: sign in via the page, then force a
// navigation to /home and inspect what mounts.
export default async function run(page, ui) {
  const start = await ui.snapshot()
  const emailBox = start.match(/@(e\d+) textbox "EMAIL"/)?.[1]
  const passBox = start.match(/@(e\d+) textbox "PASSWORD"/)?.[1]
  const submit = start.match(/@(e\d+) button "Log in"/)?.[1]

  await ui.fill(emailBox, 'user@test.com')
  await ui.fill(passBox, 'test123')
  await ui.click(submit)
  await page.waitForTimeout(3000)

  const afterLogin = await page.evaluate(async () => {
    const me = await fetch('/api/auth/me', { credentials: 'include' })
    return {
      url: location.pathname,
      cookieHasToken: document.cookie.includes('auth-token'),
      meStatus: me.status,
    }
  })

  // Navigate to the protected page directly.
  await page.goto('http://localhost:3000/home', { waitUntil: 'load' })
  await page.waitForTimeout(4000)

  const home = await page.evaluate(() => ({
    url: location.pathname,
    sidebar: !!document.querySelector('.ds-sidebar'),
    sidebarLogo: !!document.querySelector('.ds-sidebar-logo img'),
    hero: !!document.querySelector('.ds-home-hero'),
    heroBg: document.querySelector('.ds-home-hero')
      ? getComputedStyle(document.querySelector('.ds-home-hero'), '::before').backgroundImage
      : null,
    greeting: document.querySelector('.ds-page-title')?.textContent,
    gateSpinner: !!document.querySelector('.ds-auth-loading'),
  }))

  return { afterLogin, home }
}