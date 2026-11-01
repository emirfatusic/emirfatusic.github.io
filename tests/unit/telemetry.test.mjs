import { test } from 'node:test'
import assert from 'node:assert/strict'
import snapshot from '../../src/lap/snapshot.json' with { type: 'json' }
import { align, nearest, sectorBounds } from '../../src/lap/telemetry.ts'
const record = snapshot.recordings[0]
test('recorded timings and estimates remain distinct; alignment preserves raw input', () => {
  const original = JSON.stringify(record)
  assert.equal(
    Math.round(record.sectors.reduce((a, b) => a + b) * 1000),
    Math.round(record.duration * 1000),
  )
  const result = align(record)
  assert.equal(result.reason, null)
  assert.equal(result.points[0].progress, 0)
  assert.equal(result.points.at(-1).progress, 100)
  assert.equal(JSON.stringify(record), original)
  assert.ok(nearest(result.points, 82).progress > 80)
  const [start, end] = sectorBounds(record, result, 3)
  assert.ok(start > 60 && start < 80)
  assert.equal(end, 100)
})
for (const [name, edit] of [
  ['missing speed', (r) => (r.samples[10][1] = null)],
  ['late first sample', (r) => (r.samples = r.samples.slice(10))],
  ['missing end', (r) => (r.samples = r.samples.slice(0, -10))],
  ['material gap', (r) => r.samples.splice(20, 20)],
  ['empty recording', (r) => (r.samples = [])],
])
  test(`withholds unsupported estimated progress for ${name}`, () => {
    const r = structuredClone(record)
    edit(r)
    assert.ok(align(r).reason)
    assert.equal(align(r).points.length, 0)
    assert.equal(r.duration, 90.984)
  })
test('missing throttle preserves reliable speed alignment without fabricating a value', () => {
  const r = structuredClone(record)
  r.samples[10][2] = null
  const result = align(r)
  assert.equal(result.reason, null)
  assert.equal(result.points[10].throttle, null)
  assert.ok(result.points.every((p) => p.brake === 0 || p.brake === 100))
})
