import { Scheduler } from './scheduler.ts'
const scheduler = new Scheduler()
export async function request(url: string, signal: AbortSignal): Promise<unknown> {
  await scheduler.acquire(signal)
  const timeout = AbortSignal.timeout(15000)
  let response: Response
  try {
    response = await fetch(url, {
      signal: AbortSignal.any([signal, timeout]),
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (signal.aborted) throw error
    throw new Error(
      timeout.aborted
        ? 'OpenF1 took too long to respond. Retry when you’re ready.'
        : 'OpenF1 could not be reached. Check your connection and retry.',
    )
  }
  if (response.status === 429) {
    const retry = response.headers.get('Retry-After')
    const delay =
      retry && Number.isFinite(Number(retry))
        ? Number(retry) * 1000
        : retry
          ? Date.parse(retry) - Date.now()
          : 60000
    scheduler.defer(Number.isFinite(delay) ? Math.max(0, delay) : 60000)
    throw new Error('OpenF1’s request limit was reached. Wait a moment, then retry.')
  }
  if (!response.ok)
    throw new Error(
      `OpenF1 is unavailable (HTTP ${response.status}). Retry to load the requested drivers.`,
    )
  try {
    return await response.json()
  } catch {
    throw new Error('OpenF1 returned unreadable data. Retry to request it again.')
  }
}
