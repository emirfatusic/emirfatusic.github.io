import snapshot from './snapshot.json' with { type: 'json' }
import type { Driver, Recording } from './telemetry.ts'
import { selectLap, parseSamples, validRecording } from './parsing.ts'
import { RecordingCache } from './cache.ts'
import { request } from './transport.ts'
export const catalog: Driver[] = snapshot.catalog
export const defaults = snapshot.recordings as Recording[]
for (const record of defaults) {
  const driver = catalog.find((d) => d.number === record.driver)
  if (!driver || !validRecording(record, driver)) throw new Error('Bundled comparison is invalid.')
}
const cache = new RecordingCache(catalog, defaults)
export async function load(id: number, signal: AbortSignal, refresh = false): Promise<Recording> {
  const driver = catalog.find((d) => d.number === id)
  if (!driver) throw new Error('Choose a driver from this qualifying session.')
  signal.throwIfAborted()
  if (!refresh) {
    const saved = cache.get(id)
    if (saved) return saved
  }
  const base = 'https://api.openf1.org/v1/'
  const laps = new URL(`${base}laps`)
  laps.searchParams.set('session_key', '9161')
  laps.searchParams.set('driver_number', String(id))
  const lap = selectLap(await request(laps.href, signal), driver)
  const samplesUrl = new URL(`${base}car_data`)
  samplesUrl.searchParams.set('session_key', '9161')
  samplesUrl.searchParams.set('driver_number', String(id))
  const utc = (value: number) => new Date(value).toISOString().replace('Z', '')
  samplesUrl.searchParams.set('date>', utc(lap.start))
  samplesUrl.searchParams.set('date<', utc(lap.start + lap.duration * 1000))
  const samples = parseSamples(
    await request(samplesUrl.href, signal),
    driver,
    lap.start,
    lap.duration,
  )
  signal.throwIfAborted()
  const recording: Recording = {
    session: 9161,
    driver: id,
    name: `${driver.firstName} ${driver.lastName}`,
    short: driver.lastName,
    lap: lap.number,
    duration: lap.duration,
    sectors: lap.sectors,
    source: samplesUrl.href,
    retrieved: new Date().toISOString(),
    samples,
  }
  if (!validRecording(recording, driver))
    throw new Error('OpenF1’s recording could not be validated.')
  cache.set(recording)
  return recording
}
