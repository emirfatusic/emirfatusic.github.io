<script setup lang="ts">
import { computed } from 'vue'
import type { Aligned, Point } from '../telemetry.ts'
const props = defineProps<{ aligned: Aligned[]; bounds: [number, number]; progress: number }>()
const emit = defineEmits<{ pick: [number] }>()
const metrics = [
  { key: 'speed', label: 'Speed', unit: 'km/h · 0–350', max: 350 },
  { key: 'throttle', label: 'Throttle', unit: '% · 0–100', max: 100 },
  { key: 'brake', label: 'Brake', unit: 'Off / On', max: 100 },
] as const
// Cursor changes move only its line; paths depend on recordings and the selected range.
const paths = computed(() =>
  metrics.map((metric) =>
    props.aligned.map((recording) => {
      let path = '',
        connected = false
      for (const p of recording.points) {
        if (p.progress < props.bounds[0] || p.progress > props.bounds[1]) continue
        const value = p[metric.key as keyof Point]
        if (value === null) {
          connected = false
          continue
        }
        const x = (
          ((p.progress - props.bounds[0]) / (props.bounds[1] - props.bounds[0])) *
          1000
        ).toFixed(2)
        const y = (114 - (value / metric.max) * 108).toFixed(2)
        path += !connected ? `M${x} ${y}` : metric.key === 'brake' ? `H${x}V${y}` : `L${x} ${y}`
        connected = true
      }
      return path
    }),
  ),
)
const cursor = computed(
  () => ((props.progress - props.bounds[0]) / (props.bounds[1] - props.bounds[0])) * 1000,
)
function pick(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !(event.buttons & 1)) return
  const area = event.currentTarget as HTMLElement
  if (event.type === 'pointerdown') area.setPointerCapture(event.pointerId)
  const rect = area.getBoundingClientRect()
  emit(
    'pick',
    Math.max(
      props.bounds[0],
      Math.min(
        props.bounds[1],
        props.bounds[0] +
          ((event.clientX - rect.left) / rect.width) * (props.bounds[1] - props.bounds[0]),
      ),
    ),
  )
}
</script>
<template>
  <div v-for="(metric, index) in metrics" :key="metric.key" class="plot" :data-metric="metric.key">
    <div class="plot-header">
      <h3>{{ metric.label }}</h3>
      <span>{{ metric.unit }}</span>
    </div>
    <div class="plot-area" aria-hidden="true" @pointerdown="pick" @pointermove="pick">
      <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
        <path v-for="y in [30, 60, 90]" :key="y" :d="`M0 ${y}H1000`" class="grid-line" />
        <path
          v-for="(path, role) in paths[index]"
          :key="role"
          :d="path"
          class="series"
          :class="{ b: role === 1 }"
        />
        <path :d="`M${cursor} 0V120`" class="plot-cursor" />
      </svg>
    </div>
  </div>
</template>
