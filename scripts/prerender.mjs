import { readFile, writeFile, rm, mkdir, copyFile } from 'node:fs/promises'
import { renderToString } from 'vue/server-renderer'
import { createPortfolioApp } from '../.ssr-build/main.js'

const template = await readFile('dist/index.html', 'utf8')
const marker = '<div id="app"></div>'
if (template.split(marker).length !== 2)
  throw new Error('Expected exactly one app root in the client template.')
const html = await renderToString(createPortfolioApp())
if (!html.includes('Interfaces with') || !html.includes('id="contact"')) {
  throw new Error('Prerendered page is missing required content.')
}
await writeFile('dist/index.html', template.replace(marker, `<div id="app">${html}</div>`))
await mkdir('dist/source', { recursive: true })
await copyFile('src/components/CommandDialog.vue', 'dist/source/command-menu.vue.txt')
await rm('.ssr-build', { recursive: true, force: true })
console.log('Prerendered portfolio HTML. Only static files are deployed.')
