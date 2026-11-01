import { test, expect } from '@playwright/test'

test('hydrates and preserves native portfolio navigation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (/hydration/i.test(m.text())) errors.push(m.text())
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Use (light|dark) appearance/ })).toBeEnabled()
  await page
    .getByRole('navigation', { name: 'Explore the portfolio' })
    .getByRole('link', { name: /Read the notes/ })
    .click()
  await expect(page).toHaveURL(/#notes$/)
  await page.goBack()
  await expect(page).toHaveURL('http://127.0.0.1:4173/')
  await page.getByRole('link', { name: 'Compare the laps', exact: true }).click()
  await expect(page).toHaveURL(/\/lab\/lap-compare\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lap workbench.')
  await page.getByRole('link', { name: 'Back to portfolio' }).click()
  await expect(page).toHaveURL(/\/#lab$/)
  expect(errors).toEqual([])
})

test('source and contact links retain their public destinations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'View the source', exact: true })).toHaveAttribute(
    'href',
    'https://github.com/emirfatusic/emirfatusic.github.io/tree/main/src/lap',
  )
  await expect(page.locator('#contact').getByRole('link')).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/emir-fatusic',
  )
})
