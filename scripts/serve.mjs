import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { gzipSync } from 'node:zlib'

const root = resolve('dist')
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.csv': 'text/csv; charset=utf-8',
}
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405).end()
      return
    }
    const url = new URL(req.url, 'http://localhost')
    const pathname = decodeURIComponent(url.pathname)
    let file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname))
    if (!file.startsWith(root + sep)) {
      res.writeHead(403).end()
      return
    }
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(308, { Location: url.pathname + '/' + url.search }).end()
        return
      }
      file = resolve(file, 'index.html')
    }
    if (!(await stat(file)).isFile()) {
      res.writeHead(404).end('Not found')
      return
    }
    const body = await readFile(file)
    const compress =
      /\.(html|css|js|svg|json|xml|txt)$/.test(file) &&
      /\bgzip\b/.test(req.headers['accept-encoding'] || '')
    const bytes = compress ? gzipSync(body) : body
    res.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Content-Length': bytes.length,
      'Cache-Control': file.endsWith('.html') ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Accept-Encoding',
      ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
    })
    res.end(req.method === 'HEAD' ? undefined : bytes)
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 400).end('Not found')
  }
})
server.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () =>
  console.log('Portfolio preview: http://127.0.0.1:' + (process.env.PORT || 4173)),
)
