<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { align } from '../telemetry.ts'
import type { Recording } from '../telemetry.ts'
const props = defineProps<{ records: Recording[] }>()
defineEmits<{ close: [] }>()
const heading = ref<HTMLElement | null>(null),
  page = ref(0)
const rows = computed(() =>
  props.records
    .flatMap((r) => {
      const aligned = align(r)
      return r.samples.map((s, index) => ({
        name: r.short,
        sample: s,
        progress: aligned.points[index]?.progress ?? null,
      }))
    })
    .sort((a, b) => a.sample[0] - b.sample[0]),
)
const pages = computed(() => Math.max(1, Math.ceil(rows.value.length / 20)))
const shown = computed(() => rows.value.slice(page.value * 20, (page.value + 1) * 20))
onMounted(() => heading.value?.focus())
</script>
<template>
  <section id="table-panel" class="table-panel" aria-labelledby="table-title">
    <div class="table-panel-header">
      <div>
        <h3 id="table-title" ref="heading" tabindex="-1">Recorded data table</h3>
        <p>All raw samples, ordered by elapsed time within each lap.</p>
      </div>
      <button class="text-button" @click="$emit('close')">Close table</button>
    </div>
    <div class="table-scroll" role="region" aria-label="Telemetry data" tabindex="0">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col">Est. progress</th>
            <th scope="col">Driver</th>
            <th scope="col">Elapsed, s</th>
            <th scope="col">Speed, km/h</th>
            <th scope="col">Throttle, %</th>
            <th scope="col">Brake</th>
            <th scope="col">Gear</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in shown" :key="i">
            <td>{{ row.progress === null ? 'Unavailable' : row.progress.toFixed(1) + '%' }}</td>
            <th scope="row">{{ row.name }}</th>
            <td>{{ row.sample[0].toFixed(3) }}</td>
            <td>{{ row.sample[1] ?? 'Missing' }}</td>
            <td>{{ row.sample[2] ?? 'Missing' }}</td>
            <td>{{ row.sample[3] === null ? 'Missing' : row.sample[3] ? 'On' : 'Off' }}</td>
            <td>{{ row.sample[4] ?? 'Missing' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-pagination">
      <button class="text-button" :disabled="page === 0" @click="page--">Previous</button
      ><span role="status">Page {{ page + 1 }} of {{ pages }} · {{ rows.length }} samples</span
      ><button class="text-button" :disabled="page >= pages - 1" @click="page++">Next</button>
    </div>
  </section>
</template>
