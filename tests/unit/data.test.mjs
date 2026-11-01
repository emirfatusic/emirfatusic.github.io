import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectLap, parseSamples, validRecording } from '../../src/lap/parsing.ts'
import { RecordingCache } from '../../src/lap/cache.ts'
import { Scheduler } from '../../src/lap/scheduler.ts'
import { request } from '../../src/lap/transport.ts'
import snapshot from '../../src/lap/snapshot.json' with { type: 'json' }
const driver = snapshot.catalog[0],
  record = snapshot.recordings[0]
const lap = {
  session_key: 9161,
  driver_number: 55,
  is_pit_out_lap: false,
  lap_duration: 90.984,
  lap_number: 19,
  date_start: '2023-09-16T14:26:39.952Z',
  duration_sector_1: 26.717,
  duration_sector_2: 38.499,
  duration_sector_3: 25.768,
}
test('matches reported Q3 milliseconds rather than an unrelated faster lap', () => {
  assert.equal(selectLap([{ ...lap, lap_duration: 90, lap_number: 12 }, lap], driver).number, 19)
  for (const bad of [
    { ...lap, driver_number: 16 },
    { ...lap, session_key: 1 },
    { ...lap, is_pit_out_lap: true },
    { ...lap, duration_sector_1: null },
    { ...lap, duration_sector_3: 20 },
  ])
    assert.throws(() => selectLap([bad], driver))
})
test('provider boundary keeps missing channels and rejects wrong identities, bounds and duplicates', () => {
  const sample = {
    session_key: 9161,
    driver_number: 55,
    date: '2023-09-16T14:26:40.952Z',
    speed: 200,
    throttle: null,
    brake: 40,
    n_gear: 4,
  }
  assert.deepEqual(parseSamples([sample], driver, Date.parse(lap.date_start), lap.lap_duration), [
    [1, 200, null, null, 4],
  ])
  for (const input of [
    [{ ...sample, driver_number: 63 }],
    [{ ...sample, date: 'bad' }],
    [sample, sample],
    {},
    [{ ...sample, date: '2023-09-16T15:00:00Z' }],
  ])
    assert.throws(() => parseSamples(input, driver, Date.parse(lap.date_start), lap.lap_duration))
  assert.equal(validRecording(record, driver), true)
  assert.equal(validRecording({ ...record, duration: 1 }, driver), false)
})
test('cache tolerates blocked/corrupt storage and restores only validated bounded recordings', (t) => {
  t.mock.method(globalThis, 'fetch', globalThis.fetch)
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
    else delete globalThis.localStorage
  })
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem() {
        throw Error('blocked')
      },
      setItem() {
        throw Error('blocked')
      },
    },
  })
  const c = new RecordingCache(snapshot.catalog, [record])
  assert.equal(c.get(55), record)
  c.set(record)
  globalThis.localStorage.getItem = () => 'invalid JSON'
  assert.equal(new RecordingCache(snapshot.catalog, [record]).get(16), undefined)
  globalThis.localStorage.getItem = () => JSON.stringify([{ ...record, driver: 16 }])
  assert.equal(new RecordingCache(snapshot.catalog, [record]).get(16), undefined)
  globalThis.localStorage.getItem = () => JSON.stringify([snapshot.recordings[1]])
  assert.equal(new RecordingCache(snapshot.catalog, [record]).get(63).short, 'Russell')
})
test('scheduler enforces both published windows and cancellation costs no queued slot', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 100000 })
  const s = new Scheduler(),
    signal = new AbortController().signal
  for (let i = 0; i < 3; i++) await s.acquire(signal)
  let done = false
  const fourth = s.acquire(signal).then(() => (done = true))
  await Promise.resolve()
  assert.equal(done, false)
  t.mock.timers.tick(1000)
  await fourth
  assert.equal(done, true)
  for (let group = 0; group < 8; group++) {
    t.mock.timers.tick(1000)
    for (let i = 0; i < 3; i++) await s.acquire(signal)
  }
  t.mock.timers.tick(1000)
  for (let i = 0; i < 2; i++) await s.acquire(signal) // total30
  const canceled = new AbortController(),
    queued = s.acquire(canceled.signal)
  canceled.abort()
  await assert.rejects(queued)
  done = false
  const next = s.acquire(signal).then(() => (done = true))
  t.mock.timers.tick(49999)
  await Promise.resolve()
  assert.equal(done, false)
  t.mock.timers.tick(1)
  await next
})
test('HTTP failure and cooldown are explicit; cancellation remains distinguishable', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 1000000 })
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response('', { status: 429, headers: { 'Retry-After': '2' } }),
  )
  const signal = new AbortController().signal
  await assert.rejects(request('https://api.openf1.org/v1/laps', signal), /request limit/)
  globalThis.fetch = async () => new Response('[]', { status: 200 })
  let done = false
  const second = request('https://api.openf1.org/v1/laps', signal).then(() => (done = true))
  await Promise.resolve()
  assert.equal(done, false)
  t.mock.timers.tick(2000)
  await second
  globalThis.fetch = async () => new Response('', { status: 503 })
  await assert.rejects(request('https://api.openf1.org/v1/laps', signal), /503/)
})

test('repository validates a real third driver, reuses completed results, and keeps them after a failed refresh', async (t) => {
  const { default: fixture } = await import('../fixtures/leclerc-q3.json', {
    with: { type: 'json' },
  })
  const { load } = await import('../../src/lap/data.ts')
  let calls = 0
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls++
    return new Response(
      JSON.stringify(String(url).includes('/laps?') ? [fixture.lap] : fixture.samples),
      { headers: { 'Content-Type': 'application/json' } },
    )
  })
  const signal = new AbortController().signal
  const r = await load(16, signal)
  assert.equal(r.name, 'Charles Leclerc')
  assert.equal(r.samples.length, 337)
  assert.equal(r.lap, 20)
  assert.equal(await load(16, signal), r)
  assert.equal(calls, 2)
  globalThis.fetch = async () => new Response('', { status: 503 })
  await assert.rejects(load(16, signal, true), /503/)
  assert.equal(await load(16, signal), r)
  await assert.rejects(load(999, signal), /Choose a driver/)
})

test(
  'network timeout terminates a stalled provider request and offers retry',
  { timeout: 18000 },
  async (t) => {
    const keepAlive = setInterval(() => {}, 1000)
    t.after(() => clearInterval(keepAlive))
    t.mock.method(
      globalThis,
      'fetch',
      async (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true })
        }),
    )
    await assert.rejects(
      request('https://api.openf1.org/v1/laps', new AbortController().signal),
      /took too long/,
    )
  },
)
