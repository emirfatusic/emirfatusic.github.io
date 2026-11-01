import { test, expect } from '@playwright/test'

test('follows device appearance until the visitor chooses an override', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Use dark appearance' })).toBeEnabled()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  // Exercise a visible, painted page: WebKit can defer media events in a background window.
  await page.bringToFront()
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.getByRole('button', { name: 'Use light appearance' })).toBeEnabled()
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(11, 30, 42)')
  await page.getByRole('button', { name: 'Use light appearance' }).click()
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(246, 250, 252)')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Use dark appearance' })).toBeEnabled()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('applies a saved dark choice before the application hydrates', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.addInitScript(() => localStorage.setItem('emir-theme', 'dark'))
  await page.route('**/assets/*.js', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.theme-toggle')).toBeDisabled()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(11, 30, 42)')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0b1e2a')
})

test('supports theme changes when browser storage is blocked', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Object.defineProperty(Storage.prototype, method, {
        value() {
          throw new DOMException('Storage is blocked', 'SecurityError')
        },
      })
    }
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Use light appearance' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Use dark appearance' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(errors).toEqual([])
})

test('renders the dark palette without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto(baseURL!)
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(11, 30, 42)')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(
    page.locator('#contact').getByRole('link', { name: 'Say hello on LinkedIn' }),
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/emir-fatusic')
  await context.close()
})

for (const appearance of ['light', 'dark'] as const) {
  test(`preserves an explicit ${appearance} choice under browser auto-darkening`, async ({
    page,
    browserName,
  }, testInfo) => {
    await page.addInitScript((choice) => localStorage.setItem('emir-theme', choice), appearance)
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByRole('button', { name: /Use (light|dark) appearance/ })).toBeEnabled()
    await page.evaluate(async () => {
      await document.fonts.ready
      await document.querySelector<HTMLImageElement>('.hero-scenery img')!.decode()
    })
    await page.bringToFront()
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    )
    const light = await page.screenshot({ fullPage: true, animations: 'disabled' })
    await page.emulateMedia({ colorScheme: 'dark' })
    if (browserName === 'chromium') {
      const session = await page.context().newCDPSession(page)
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
      await testInfo.attach('explicit-light-render', { body: light, contentType: 'image/png' })
      await testInfo.attach('auto-dark-render', { body: dark, contentType: 'image/png' })
    }
    expect(dark.equals(light), 'Browser darkening must preserve the chosen palette').toBe(true)
  })
}
