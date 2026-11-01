import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import fixture from './fixtures/leclerc-q3.json' with { type: 'json' }
import snapshot from '../src/lap/snapshot.json' with { type: 'json' }
const path = '/lab/lap-compare/'
async function open(page: import('@playwright/test').Page, query = '') {
  await page.goto(path + query)
  await expect(page.getByLabel('Reference driver')).toBeEnabled()
}
async function provider(
  page: import('@playwright/test').Page,
  mode: 'ok' | 'missing' | 'partial' | 'error' = 'ok',
  delay = 0,
) {
  await page.route('https://api.openf1.org/v1/**', async (route) => {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
    if (mode === 'error') {
      await route.fulfill({ status: 503, body: '' })
      return
    }
    const url = new URL(route.request().url())
    const id = Number(url.searchParams.get('driver_number'))
    const saved = snapshot.recordings.find((r) => r.driver === id)
    let body: unknown = url.pathname.endsWith('/laps') ? [fixture.lap] : fixture.samples
    if (saved) {
      const start = new URL(saved.source).searchParams.get('date>')! + 'Z'
      body = url.pathname.endsWith('/laps')
        ? [
            {
              session_key: 9161,
              driver_number: id,
              is_pit_out_lap: false,
              lap_duration: saved.duration,
              lap_number: saved.lap,
              date_start: start,
              duration_sector_1: saved.sectors[0],
              duration_sector_2: saved.sectors[1],
              duration_sector_3: saved.sectors[2],
            },
          ]
        : saved.samples.map((s) => ({
            session_key: 9161,
            driver_number: id,
            date: new Date(Date.parse(start) + s[0] * 1000).toISOString(),
            speed: s[1],
            throttle: s[2],
            brake: s[3],
            n_gear: s[4],
          }))
    }
    if (url.pathname.endsWith('/car_data') && mode !== 'ok')
      body = fixture.samples.map((s, i) => ({
        ...s,
        ...(mode === 'missing' && i === 20 ? { speed: null } : {}),
        ...(mode === 'partial' && i > 150 && i < 170 ? { throttle: null } : {}),
      }))
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) })
  })
}

test('default is offline, hydrated, keyboard-operable and exposes every raw sample', async ({
  page,
}) => {
  const errors: string[] = [],
    external: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (/hydration/i.test(m.text())) errors.push(m.text())
  })
  await page.route('https://api.openf1.org/**', (route) => {
    external.push(route.request().url())
    return route.abort()
  })
  await open(page)
  await expect(page.locator('.comparison')).toContainText('1:30.984')
  expect(external).toEqual([])
  await page.getByRole('button', { name: /Sector 2/ }).click()
  await expect(page.getByRole('button', { name: /Sector 2/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  const range = page.getByLabel('Estimated lap progress')
  await range.focus()
  await page.keyboard.press('Home')
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/sector=2/)
  await page.getByRole('button', { name: 'View data table' }).click()
  await expect(page.getByRole('heading', { name: 'Recorded data table' })).toBeFocused()
  let total = 0
  do {
    total += await page.locator('.data-table tbody tr').count()
    if (await page.getByRole('button', { name: 'Next', exact: true }).isDisabled()) break
    await page.getByRole('button', { name: 'Next', exact: true }).click()
  } while (true)
  expect(total).toBe(681)
  await page.getByRole('button', { name: 'Close table' }).click()
  await expect(page.getByRole('button', { name: 'View data table' })).toBeFocused()
  await page.getByRole('button', { name: 'Swap drivers' }).click()
  await expect(page.locator('.driver-name').first()).toHaveText('George Russell')
  await expect(page.locator('.driver-time').nth(1)).toContainText('−0.072')
  await page.reload()
  await expect(page.locator('.driver-name').first()).toHaveText('George Russell')
  expect(errors).toEqual([])
})

test('loads a nondefault driver, restores history and retains applied identity on provider failure', async ({
  page,
}) => {
  await provider(page)
  await open(page)
  await page.getByLabel('Comparison driver').selectOption('16')
  await expect(page.locator('.driver-name').nth(1)).toHaveText('Charles Leclerc')
  await expect(page.locator('.driver-time').nth(1)).toContainText('1:31.063')
  await page.goBack()
  await expect(page.locator('.driver-name').nth(1)).toHaveText('George Russell')
  await page.goForward()
  await expect(page.locator('.driver-name').nth(1)).toHaveText('Charles Leclerc')
  await page.unroute('https://api.openf1.org/v1/**')
  await provider(page, 'error')
  await page.locator('.data-details summary').click()
  await page.getByRole('button', { name: 'Refresh from OpenF1' }).click()
  await expect(page.locator('.load-notice')).toContainText('503')
  await expect(page.locator('.comparison')).toContainText('Charles Leclerc')
  await page.unroute('https://api.openf1.org/v1/**')
  await provider(page)
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(page.locator('.load-notice')).toHaveCount(0)
  await expect(page.locator('.comparison')).toContainText('Charles Leclerc')
})

test('rapid selection cannot commit a late response under a newer driver', async ({ page }) => {
  await provider(page, 'ok', 350)
  await open(page)
  await page.getByLabel('Comparison driver').selectOption('16')
  await expect(page.locator('.load-notice')).toContainText('Loading')
  await expect(page.locator('.driver-name').nth(1)).toHaveText('George Russell')
  await page.getByLabel('Comparison driver').selectOption('63')
  await expect(page.locator('.load-notice')).toHaveCount(0)
  await page.waitForTimeout(600)
  await expect(page.locator('.driver-name').nth(1)).toHaveText('George Russell')
})

test('missing speed withholds alignment while retaining valid timings and raw samples', async ({
  page,
}) => {
  await provider(page, 'missing')
  await open(page)
  await page.getByLabel('Comparison driver').selectOption('16')
  await expect(page.locator('.telemetry')).toContainText('speed coverage is incomplete')
  await expect(page.locator('.plot')).toHaveCount(0)
  await expect(page.locator('.comparison')).toContainText('1:31.063')
  await expect(page.getByLabel('Estimated lap progress')).toBeDisabled()
  await page.getByRole('button', { name: 'View data table' }).click()
  await expect(page.locator('.table-pagination')).toContainText('678 samples')
})

test('direct route works without JS and CSV matches bundled samples', async ({
  browser,
  baseURL,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto(baseURL + path)
  await expect(page.locator('.comparison')).toContainText('Carlos Sainz')
  await expect(page.getByLabel('Comparison driver')).toBeDisabled()
  await expect(page.locator('.plot')).toHaveCount(3)
  await page.locator('.data-details summary').click()
  const csv = await request.get(path + 'default-recordings.csv')
  expect(csv.ok()).toBe(true)
  expect((await csv.text()).trim().split('\n')).toHaveLength(682)
  const redirect = await request.get('/lab/lap-compare?a=63&b=55')
  expect(redirect.url()).toContain('/lab/lap-compare/?a=63&b=55')
  await context.close()
})

test('invalid links and blocked storage recover without losing comparison identity', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', {
      value() {
        throw new Error('blocked')
      },
    })
    Object.defineProperty(Storage.prototype, 'setItem', {
      value() {
        throw new Error('blocked')
      },
    })
  })
  await open(page, '?a=999&b=999&sector=10&progress=NaN')
  await expect(page.locator('.load-notice')).toContainText('unsupported driver pair')
  await expect(page.locator('.comparison')).toContainText('Carlos Sainz')
  await page.getByRole('button', { name: 'Swap drivers' }).click()
  await expect(page.locator('.driver-name').first()).toHaveText('George Russell')
  await page.getByRole('button', { name: /Use (light|dark) appearance/ }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', /light|dark/)
})

test('light/dark and narrow workbench states pass axe without page overflow', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
    await open(page)
    await page.getByRole('button', { name: 'View data table' }).click()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${colorScheme} ${width}`,
      ).toBe(true)
    }
  }
})

test('saved appearance carries through the portfolio, workbench and a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Use dark appearance' }).click()
  await page.getByRole('link', { name: 'Compare the laps', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Use light appearance' })).toBeEnabled()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('link', { name: 'Back to portfolio' }).click()
  await expect(page.getByRole('button', { name: 'Use light appearance' })).toBeEnabled()
})

for (const appearance of ['light', 'dark'] as const) {
  test(`explicit ${appearance} workbench palette overrides the opposite device preference`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: appearance === 'light' ? 'dark' : 'light' })
    await page.addInitScript((choice) => localStorage.setItem('emir-theme', choice), appearance)
    await open(page)
    const canvas = appearance === 'light' ? 'rgb(246, 250, 252)' : 'rgb(11, 30, 42)'
    await expect(page.locator('.lap-page')).toHaveCSS('background-color', canvas)
    await expect(page.locator('.plot-area').first()).toHaveCSS(
      'background-color',
      appearance === 'light' ? 'rgb(255, 255, 255)' : 'rgb(16, 43, 59)',
    )
    if (browserName === 'chromium') {
      const session = await page.context().newCDPSession(page)
      await session.send('Emulation.setAutoDarkModeOverride', { enabled: true })
      await expect(page.locator('.lap-page')).toHaveCSS('background-color', canvas)
    }
  })
}
