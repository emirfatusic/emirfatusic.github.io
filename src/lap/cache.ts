import { validRecording } from './parsing.ts'
import type { Driver, Recording } from './telemetry.ts'
const key = 'emir-lap-9161-v1'
export class RecordingCache {
  private records = new Map<number, Recording>()
  private restored = false
  private catalog: Driver[]
  constructor(catalog: Driver[], seeds: Recording[]) {
    this.catalog = catalog
    for (const r of seeds) this.records.set(r.driver, r)
  }
  private restore() {
    if (this.restored) return
    this.restored = true
    try {
      const raw = localStorage.getItem(key)
      if (!raw || raw.length > 2000000) return
      const input: unknown = JSON.parse(raw)
      if (!Array.isArray(input) || input.length > this.catalog.length) return
      for (const r of input) {
        const d = this.catalog.find((d) => d.number === r?.driver)
        if (d && validRecording(r, d)) this.records.set(d.number, r)
      }
    } catch {
      /* Optional browser storage never prevents a comparison. */
    }
  }
  get(driver: number) {
    this.restore()
    return this.records.get(driver)
  }
  set(recording: Recording) {
    this.records.set(recording.driver, recording)
    try {
      localStorage.setItem(key, JSON.stringify([...this.records.values()]))
    } catch {
      /* Keep the completed in-memory result. */
    }
  }
}
