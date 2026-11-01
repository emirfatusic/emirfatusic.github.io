import { test, expect } from '@playwright/test'

test('preserves Clear Air colors with dark preferences and browser auto-darkening', async ({
  page,
  browserName,
}, testInfo) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: 'Open command menu' })).toBeEnabled()
  await page.evaluate(async () => {
    await document.fonts.ready
    await document.querySelector<HTMLImageElement>('.hero-scenery img')!.decode()
  })
  const light = await page.screenshot({ fullPage: true, animations: 'disabled' })

  await page.emulateMedia({ colorScheme: 'dark' })
  if (browserName === 'chromium') {
    const session = await page.context().newCDPSession(page)
    // Reproduce Chrome's automatic darkening, not just the OS media preference.
    await session.send('Emulation.setAutoDarkModeOverride', { enabled: true })
  }
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  const dark = await page.screenshot({ fullPage: true, animations: 'disabled' })
  if (!light.equals(dark)) {
    await testInfo.attach('light-render', { body: light, contentType: 'image/png' })
    await testInfo.attach('dark-preference-render', { body: dark, contentType: 'image/png' })
  }
  expect(dark.equals(light), 'The browser must preserve the approved light palette').toBe(true)
})
