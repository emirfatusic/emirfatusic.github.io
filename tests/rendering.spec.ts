import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('delivers useful HTML and navigation without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL!)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Interfaces with')
  await expect(page.getByRole('link', { name: 'Compare the laps', exact: true })).toHaveAttribute(
    'href',
    '/lab/lap-compare/',
  )
  await page
    .getByRole('navigation', { name: 'Explore the portfolio' })
    .getByRole('link', { name: /About Emir/ })
    .click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.getByRole('heading', { name: 'About me.' })).toBeVisible()
  await expect(
    page.locator('#contact').getByRole('link', { name: 'Say hello on LinkedIn' }),
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/emir-fatusic')
  await context.close()
})

test('headlines and command text retain word boundaries and clear link descriptions', async ({
  page,
}) => {
  await page.goto('/')
  const headline = page.getByRole('heading', { level: 1 })
  expect((await headline.textContent())?.replace(/\s+/g, ' ').trim()).toBe(
    'Interfaces with a little more feeling.',
  )
  const panel = page.getByRole('navigation', { name: 'Explore the portfolio' })
  const labLink = panel.getByRole('link', { name: 'Explore the lab', exact: true })
  await expect(labLink).toHaveAccessibleDescription('An interface, up close')
  expect((await labLink.textContent())?.replace(/\s+/g, ' ').trim()).toBe(
    'Explore the lab An interface, up close',
  )
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link'),
  ).toHaveText(['Lab', 'Notes', 'About', 'Contact'])
  await expect(page.locator('#notes').getByRole('heading', { level: 2 })).toHaveText('Notes.')
  await expect(page.getByRole('link', { name: 'Open the lap workbench' })).toHaveAttribute(
    'href',
    '/lab/lap-compare/',
  )
})

test('homepage passes automated accessibility checks', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme })
    await page.goto('/')
    await expect(page.getByRole('button', { name: /Use (light|dark) appearance/ })).toBeEnabled()
    const closed = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(closed.violations).toEqual([])
  }
})

test('remains usable with failed artwork and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/assets/clear-air-*', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const motion = await page.locator('.glass-panel').evaluate((el) => ({
    animation: getComputedStyle(el, '::after').animationName,
    scrolling: getComputedStyle(document.documentElement).scrollBehavior,
  }))
  expect(motion).toEqual({ animation: 'none', scrolling: 'auto' })
  await page
    .getByRole('navigation', { name: 'Explore the portfolio' })
    .getByRole('link', { name: /Explore the lab/ })
    .click()
  await expect(page).toHaveURL(/#lab$/)
  await expect(page.getByRole('link', { name: 'Compare the laps', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('has no horizontal overflow at common widths and a zoom-sized viewport', async ({ page }) => {
  for (const width of [1536, 1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: /Use (light|dark) appearance/ })).toBeEnabled()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `${width}px page width`,
    ).toBe(true)
  }
})

test('all local images and fonts load and no external service is needed', async ({ page }) => {
  const failures: string[] = []
  page.on('requestfailed', (request) => failures.push(request.url()))
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  expect(
    await page
      .locator('.hero-scenery img')
      .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
  ).toBe(true)
  const origins = await page.evaluate(() => [
    ...new Set(performance.getEntriesByType('resource').map((r) => new URL(r.name).origin)),
  ])
  expect(origins).toEqual(['http://127.0.0.1:4173'])
  expect(failures).toEqual([])
})
