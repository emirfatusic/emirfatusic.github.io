import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { catalog, defaults, load } from './data.ts'
import { align, sectorBounds } from './telemetry.ts'
import type { Recording } from './telemetry.ts'
export function useComparison() {
  const ready = ref(false),
    requested = ref<[number, number]>([55, 63])
  const applied = shallowRef<[Recording, Recording]>([defaults[0], defaults[1]])
  const sector = ref(3),
    progress = ref(82),
    pending = ref(false),
    error = ref(''),
    announcement = ref('')
  let generation = 0,
    active: AbortController | null = null
  const aligned = computed(() => applied.value.map(align))
  const trusted = computed(() => aligned.value.every((a) => !a.reason))
  const bounds = computed(() => sectorBounds(applied.value[0], aligned.value[0], sector.value))
  const clamp = () => {
    progress.value = Math.max(bounds.value[0], Math.min(bounds.value[1], progress.value))
  }
  function url(pair = requested.value) {
    const value = new URL(window.location.href)
    value.search = new URLSearchParams({
      a: String(pair[0]),
      b: String(pair[1]),
      sector: String(sector.value),
      progress: String(Math.round(progress.value * 10) / 10),
    }).toString()
    value.hash = ''
    return value
  }
  function history(mode: 'push' | 'replace') {
    if (ready.value) window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url())
  }
  async function compare(pair: [number, number], mode: 'push' | 'none' = 'push', refresh = false) {
    if (pair[0] === pair[1] || pair.some((id) => !catalog.some((d) => d.number === id))) return
    requested.value = pair
    if (mode === 'push') history('push')
    active?.abort()
    active = new AbortController()
    const current = ++generation
    pending.value = true
    error.value = ''
    try {
      const next = await Promise.all(pair.map((id) => load(id, active!.signal, refresh)))
      if (current !== generation) return
      applied.value = next as [Recording, Recording]
      clamp()
      announcement.value = `Comparing ${next[0].name} and ${next[1].name}.`
    } catch (cause) {
      if (current !== generation) return
      error.value =
        cause instanceof Error
          ? cause.message
          : 'The requested comparison could not be loaded. Retry when you’re ready.'
      announcement.value = error.value
    } finally {
      if (current === generation) pending.value = false
    }
  }
  function readUrl() {
    const params = new URLSearchParams(window.location.search)
    const a = Number(params.get('a') || 55),
      b = Number(params.get('b') || 63)
    const valid = a !== b && [a, b].every((id) => catalog.some((d) => d.number === id))
    const s = Number(params.get('sector') ?? 3),
      p = Number(params.get('progress') ?? 82)
    sector.value = Number.isInteger(s) && s >= 0 && s <= 3 ? s : 3
    progress.value = Number.isFinite(p) && p >= 0 && p <= 100 ? p : 82
    void compare(valid ? [a, b] : [55, 63], 'none').then(() => {
      if (!valid) {
        error.value =
          'This link has an unsupported driver pair. Showing the saved Sainz / Russell comparison.'
        history('replace')
      }
    })
  }
  function chooseSector(value: number) {
    sector.value = value
    clamp()
    history('replace')
  }
  function moveCursor(value: number) {
    progress.value = value
    clamp()
    history('replace')
  }
  async function share() {
    const link = url(applied.value.map((r) => r.driver) as [number, number]).href
    try {
      await navigator.clipboard.writeText(link)
      announcement.value = 'Comparison link copied.'
    } catch {
      announcement.value = 'Copy is unavailable. Select and copy the comparison URL below.'
    }
    return link
  }
  onMounted(() => {
    ready.value = true
    readUrl()
    window.addEventListener('popstate', readUrl)
  })
  onUnmounted(() => {
    generation++
    active?.abort()
    window.removeEventListener('popstate', readUrl)
  })
  return {
    ready,
    requested,
    applied,
    aligned,
    trusted,
    sector,
    progress,
    bounds,
    pending,
    error,
    announcement,
    compare,
    chooseSector,
    moveCursor,
    share,
  }
}
