import { readFile, writeFile, rm } from 'node:fs/promises'
import { renderToString } from 'vue/server-renderer'
import { createPortfolioApp, createLapApp } from '../.ssr-build/prerender-entry.js'
const marker = '<div id="app"></div>'
for (const [path, factory, required] of [
  ['dist/index.html', createPortfolioApp, 'id="contact"'],
  ['dist/lab/lap-compare/index.html', createLapApp, 'Carlos Sainz'],
]) {
  const template = await readFile(path, 'utf8')
  if (template.split(marker).length !== 2) throw new Error('Expected exactly one app root: ' + path)
  const html = await renderToString(factory())
  if (!html.includes(required)) throw new Error('Prerendered content missing: ' + path)
  await writeFile(path, template.replace(marker, `<div id="app">${html}</div>`))
}
const { recordings } = JSON.parse(await readFile('src/lap/snapshot.json', 'utf8'))
const rows = ['driver,lap,elapsed_seconds,speed_kmh,throttle_percent,brake_binary,gear']
for (const r of recordings) for (const s of r.samples) rows.push([r.name, r.lap, ...s].join(','))
await writeFile('dist/lab/lap-compare/default-recordings.csv', rows.join('\n') + '\n')
await rm('.ssr-build', { recursive: true, force: true })
console.log(
  'Prerendered portfolio and lap workbench. Static files only; no provider requests at build time.',
)
