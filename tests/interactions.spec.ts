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
    ['Read the notes', 'notes'],
    ['Get in touch', 'contact'],
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

test('the source command follows its ordinary GitHub link', async ({ page }) => {
  const source =
    'https://github.com/emirfatusic/emirfatusic.github.io/blob/main/src/components/CommandDialog.vue'
  await page.route(source, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>Component source</h1>' }),
  )
  await page.goto('/')
  await page.getByRole('button', { name: 'Open command menu' }).click()
  const link = page.getByRole('dialog').getByRole('link', { name: 'View the source', exact: true })
  await expect(link).toHaveAttribute('href', source)
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(source)
  await expect(page.getByRole('heading', { name: 'Component source' })).toBeVisible()
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
