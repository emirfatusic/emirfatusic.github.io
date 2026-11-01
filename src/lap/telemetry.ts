// Normalized historical domain. Missing values remain null all the way to the view.
export type Sample = [number, number | null, number | null, number | null, number | null]
export type Recording = {
  session: number
  driver: number
  name: string
  short: string
  lap: number
  duration: number
  sectors: number[]
  source: string
  retrieved: string
  samples: Sample[]
}
export type Driver = { number: number; firstName: string; lastName: string; q3Duration: number }
export type Point = {
  time: number
  speed: number | null
  throttle: number | null
  brake: number | null
  gear: number | null
  progress: number
}
export type Aligned = { points: Point[]; reason: string | null }
export function align(recording: Recording): Aligned {
  const samples = recording.samples
  const failure = {
    points: [],
    reason:
      'Estimated progress unavailable: speed coverage is incomplete. Reported times and raw samples remain available.',
  }
  if (samples.length < 2 || samples[0][0] > 1 || recording.duration - samples.at(-1)![0] > 1)
    return failure
  let distance = 0
  const points: Point[] = []
  for (let i = 0; i < samples.length; i++) {
    const [time, speed, throttle, brake, gear] = samples[i]
    if (speed === null || (i && (time - samples[i - 1][0] > 1.5 || time <= samples[i - 1][0])))
      return failure
    if (i) distance += ((speed + samples[i - 1][1]!) / 2 / 3.6) * (time - samples[i - 1][0])
    points.push({ time, speed, throttle, brake, gear, progress: distance })
  }
  if (!Number.isFinite(distance) || distance <= 0) return failure
  return {
    reason: null,
    points: points.map((p) => ({ ...p, progress: (p.progress / distance) * 100 })),
  }
}
export function nearest(points: Point[], progress: number) {
  return points.length
    ? points.reduce((a, b) =>
        Math.abs(a.progress - progress) <= Math.abs(b.progress - progress) ? a : b,
      )
    : null
}
export function sectorBounds(
  recording: Recording,
  aligned: Aligned,
  sector: number,
): [number, number] {
  if (!sector || !aligned.points.length) return [0, 100]
  const start = recording.sectors.slice(0, sector - 1).reduce((a, b) => a + b, 0)
  const end = start + recording.sectors[sector - 1]
  const at = (t: number) =>
    aligned.points.reduce((a, b) => (Math.abs(a.time - t) <= Math.abs(b.time - t) ? a : b)).progress
  return [sector === 1 ? 0 : at(start), sector === 3 ? 100 : at(end)]
}
export const lapTime = (value: number) =>
  `${Math.floor(value / 60)}:${(value % 60).toFixed(3).padStart(6, '0')}`
export const difference = (value: number) =>
  `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(3)} s`
