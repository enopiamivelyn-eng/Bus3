// Diagnose the post-login navigation: did the session establish, and where
// did the router actually end up?
export default async function run(page, ui) {
  const start = await ui.snapshot()
  const emailBox = start.match(/@(e\d+) textbox "EMAIL"/)?.[1]
  const passBox = start.match(/@(e\d+) textbox "PASSWORD"/)?.[1]
  const submit = start.match(/@(e\d+) button "Log in"/)?.[1]

  await ui.fill(emailBox, 'user@test.com')
  await ui.fill(passBox, 'test123')
  await ui.click(submit)
  await page.waitForTimeout(4000)

  const state = await page.evaluate(async () => {
    const me = await fetch('/api/auth/me', { credentials: 'include' })
    return {
      url: location.pathname + location.search,
      meStatus: me.status,
      meBody: (await me.text()).slice(0, 200),
      hasSidebar: !!document.querySelector('.ds-sidebar'),
    }
  })
  return state
}