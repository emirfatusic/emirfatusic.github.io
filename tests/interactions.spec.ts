import { test, expect } from '@playwright/test'

test('hydrates without errors and preserves working in-page navigation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' || /hydration/i.test(message.text())) errors.push(message.text())
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Open command menu' })).toBeEnabled()
  const nav = page.getByRole('navigation', { name: 'Explore the portfolio' })
  await nav.getByRole('link', { name: /Read the notes/ }).click()
  await expect(page).toHaveURL(/#notes$/)
  await page.goBack()
  await expect(page).toHaveURL('http://127.0.0.1:4173/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  expect(errors).toEqual([])
})

test('supports navigation keys, focus containment, dismissal and repeated opening', async ({
  page,
}) => {
  await page.goto('/')
  const opener = page.getByRole('button', { name: 'Open command menu' })
  const dialog = page.getByRole('dialog', { name: 'Go somewhere.' })
  await opener.click()
  const links = dialog.getByRole('link')
  await expect(links.nth(0)).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(links.nth(2)).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(links.nth(0)).toBeFocused()
  await page.keyboard.press('End')
  await expect(links.nth(2)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(links.nth(0)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(links.nth(1)).toBeFocused()
  await page.keyboard.press('End')
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Close command menu' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(links.nth(0)).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await opener.click()
  await dialog.getByRole('button', { name: 'Close command menu' }).click()
  await expect(opener).toBeFocused()
  await opener.click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
})

test('each command closes the dialog and focuses the requested heading', async ({ page }) => {
  await page.goto('/')
  for (const [label, id] of [
    ['Explore the lab', 'lab'],
    ['Read the notes', 'notes'],
    ['About Emir', 'about'],
  ]) {
    await page.getByRole('button', { name: 'Open command menu' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('link', { name: new RegExp(label) }).focus()
    await page.keyboard.press('Enter')
    await expect(dialog).not.toBeVisible()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}-title`)).toBeFocused()
  }
})

test('keeps focus safe when rapidly reopening after a close', async ({ page }) => {
  await page.goto('/')
  const opener = page.getByRole('button', { name: 'Open command menu' })
  await opener.click()
  await page.keyboard.press('Escape')
  await opener.click()
  await expect(page.getByRole('dialog').getByRole('link').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
})
