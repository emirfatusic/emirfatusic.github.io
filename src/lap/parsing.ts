import type { Driver, Recording, Sample } from './telemetry.ts'
type Row = Record<string, unknown>
const rows = (input: unknown): Row[] => {
  if (
    !Array.isArray(input) ||
    input.length > 20000 ||
    input.some((r) => !r || typeof r !== 'object' || Array.isArray(r))
  )
    throw new Error('OpenF1 returned an invalid recording.')
  return input as Row[]
}
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const channel = (v: unknown, max: number) => (finite(v) && v >= 0 && v <= max ? v : null)
const identity = (r: Row, driver: Driver) =>
  r.session_key === 9161 && r.driver_number === driver.number
export function selectLap(input: unknown, driver: Driver) {
  const matches = rows(input).filter(
    (r) =>
      identity(r, driver) &&
      r.is_pit_out_lap === false &&
      finite(r.lap_duration) &&
      Math.round(r.lap_duration * 1000) === Math.round(driver.q3Duration * 1000) &&
      typeof r.date_start === 'string' &&
      Number.isFinite(Date.parse(r.date_start)),
  )
  matches.sort((a, b) => Date.parse(String(b.date_start)) - Date.parse(String(a.date_start)))
  const lap = matches[0]
  if (!lap || !finite(lap.lap_number) || !Number.isInteger(lap.lap_number))
    throw new Error('A completed lap matching this driver’s reported Q3 time is unavailable.')
  const sectors = [lap.duration_sector_1, lap.duration_sector_2, lap.duration_sector_3]
  if (
    !sectors.every((v): v is number => finite(v) && v > 0) ||
    Math.abs(sectors.reduce((a, b) => a + b, 0) - driver.q3Duration) > 0.005
  )
    throw new Error('OpenF1’s reported sector times are incomplete or inconsistent.')
  return {
    number: lap.lap_number,
    start: Date.parse(String(lap.date_start)),
    duration: driver.q3Duration,
    sectors,
  }
}
export function parseSamples(
  input: unknown,
  driver: Driver,
  start: number,
  duration: number,
): Sample[] {
  const inputRows = rows(input)
  if (inputRows.some((r) => !identity(r, driver)))
    throw new Error('OpenF1 returned samples for a different driver or session.')
  const samples: Sample[] = inputRows.map((r) => [
    (Date.parse(String(r.date)) - start) / 1000,
    channel(r.speed, 400),
    channel(r.throttle, 100),
    r.brake === 0 || r.brake === 100 ? r.brake : null,
    channel(r.n_gear, 8),
  ])
  if (samples.some((s) => !finite(s[0]) || s[0] < 0 || s[0] > duration))
    throw new Error('OpenF1 returned samples outside the selected lap.')
  samples.sort((a, b) => a[0] - b[0])
  // Ambiguous duplicates cannot be represented as independent measurements.
  if (samples.some((s, i) => i > 0 && s[0] === samples[i - 1][0]))
    throw new Error('OpenF1 returned duplicate sample timestamps.')
  return samples
}
export function validRecording(input: unknown, driver: Driver): input is Recording {
  if (!input || typeof input !== 'object') return false
  const r = input as Recording
  return (
    r.session === 9161 &&
    r.driver === driver.number &&
    r.name === `${driver.firstName} ${driver.lastName}` &&
    r.short === driver.lastName &&
    Number.isInteger(r.lap) &&
    r.lap > 0 &&
    r.duration === driver.q3Duration &&
    Array.isArray(r.sectors) &&
    r.sectors.length === 3 &&
    r.sectors.every((v) => finite(v) && v > 0) &&
    Math.abs(r.sectors.reduce((a, b) => a + b, 0) - r.duration) <= 0.005 &&
    typeof r.source === 'string' &&
    r.source.startsWith('https://api.openf1.org/v1/car_data?') &&
    typeof r.retrieved === 'string' &&
    Number.isFinite(Date.parse(r.retrieved)) &&
    Array.isArray(r.samples) &&
    r.samples.length <= 20000 &&
    r.samples.every(
      (s, i) =>
        Array.isArray(s) &&
        s.length === 5 &&
        finite(s[0]) &&
        s[0] >= 0 &&
        s[0] <= r.duration &&
        (!i || s[0] > r.samples[i - 1][0]) &&
        s
          .slice(1)
          .every((v, j) => v === null || (finite(v) && v >= 0 && v <= [400, 100, 100, 8][j])) &&
        (s[3] === null || s[3] === 0 || s[3] === 100),
    )
  )
}
