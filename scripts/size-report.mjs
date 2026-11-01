import { chromium } from '@playwright/test'

// Advisory only: real HTTP encoded-body sizes from the compressed production preview.
const browser = await chromium.launch()
try {
  for (const [label, width, height, target] of [
    ['desktop', 1440, 1000, 750],
    ['mobile', 390, 844, 500],
    ['workbench desktop', 1440, 1000, 750],
    ['workbench mobile', 390, 844, 500],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    await page.goto(
      new URL(
        label.startsWith('workbench') ? '/lab/lap-compare/' : '/',
        process.env.PREVIEW_URL || 'http://127.0.0.1:4173',
      ).href,
      {
        waitUntil: 'networkidle',
      },
    )
    await page.evaluate(() => document.fonts.ready)
    const sizes = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      return [
        { name: 'HTML', bytes: navigation.encodedBodySize },
        ...performance
          .getEntriesByType('resource')
          .map((r) => ({ name: new URL(r.name).pathname, bytes: r.encodedBodySize })),
      ]
    })
    const total = sizes.reduce((sum, r) => sum + r.bytes, 0) / 1024
    console.log(
      `\n${label}: ${total.toFixed(1)} KiB; advisory target ${target} KiB (${total <= target ? 'within target' : 'above target; informational only'})`,
    )
    for (const r of sizes)
      console.log(`  ${(r.bytes / 1024).toFixed(1).padStart(7)} KiB  ${r.name}`)
    await page.close()
  }
} finally {
  await browser.close()
}
