// End-to-end check: sign in with the seeded passenger and confirm the
// authenticated shell (sidebar + home hero banner) actually mounts.
export default async function run(page, ui) {
  const start = await ui.snapshot()
  const emailBox = start.match(/@(e\d+) textbox "EMAIL"/)?.[1]
  const passBox = start.match(/@(e\d+) textbox "PASSWORD"/)?.[1]
  const submit = start.match(/@(e\d+) button "Log in"/)?.[1]

  if (!emailBox || !passBox || !submit) {
    return { error: 'login form fields not found', start }
  }

  await ui.fill(emailBox, 'user@test.com')
  await ui.fill(passBox, 'test123')
  await ui.click(submit)

  // Wait for navigation away from /login to the authenticated home page.
  await page.waitForURL('**/home', { timeout: 15000 })

  const home = await page.evaluate(() => ({
    url: location.pathname,
    sidebar: !!document.querySelector('.ds-sidebar'),
    sidebarLogo: !!document.querySelector('.ds-sidebar-logo img'),
    hero: !!document.querySelector('.ds-home-hero'),
    // The hero is a CSS background-image, so read the computed value.
    heroBg: getComputedStyle(document.querySelector('.ds-home-hero'), '::before')
      .backgroundImage,
    greeting: document.querySelector('.ds-page-title')?.textContent,
  }))
  return home
}