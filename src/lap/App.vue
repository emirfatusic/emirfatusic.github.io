<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import TracePlots from './components/TracePlots.vue'
import RawDataTable from './components/RawDataTable.vue'
import { catalog } from './data.ts'
import { useComparison } from './useComparison.ts'
import { difference, lapTime, nearest } from './telemetry.ts'
const {
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
} = useComparison()
const tableOpen = ref(false),
  tableButton = ref<HTMLButtonElement | null>(null),
  sharedLink = ref('')
const readings = computed(() => aligned.value.map((a) => nearest(a.points, progress.value)))
const metrics = [
  { key: 'speed', label: 'Speed, km/h' },
  { key: 'throttle', label: 'Throttle, %' },
  { key: 'brake', label: 'Brake' },
  { key: 'gear', label: 'Gear' },
] as const
const delta = computed(() => applied.value[1].duration - applied.value[0].duration)
function select(role: number, event: Event) {
  const pair: [number, number] = [...requested.value]
  pair[role] = Number((event.target as HTMLSelectElement).value)
  void compare(pair)
}
function reading(role: number, key: (typeof metrics)[number]['key']) {
  const value = readings.value[role]?.[key]
  return value == null ? 'Missing' : key === 'brake' ? (value ? 'On' : 'Off') : value
}
async function copyLink() {
  sharedLink.value = await share()
}
async function closeTable() {
  tableOpen.value = false
  await nextTick()
  tableButton.value?.focus()
}
watch(applied, () => {
  tableOpen.value = false
  sharedLink.value = ''
})
</script>
<template>
  <div class="lap-page">
    <a class="skip-link" href="#main">Skip to comparison</a>
    <div class="masthead">
      <header class="site-header wrap">
        <div class="header-left">
          <a class="wordmark" href="/" aria-label="Emir, portfolio">Emir.</a
          ><a class="back-link" href="/#lab"
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="M19 12H5m6-6-6 6 6 6" /></svg
            >Back to portfolio</a
          >
        </div>
        <div class="header-right">
          <a
            class="source-link"
            href="https://github.com/emirfatusic/emirfatusic.github.io/tree/main/src/lap"
            >View source</a
          ><ThemeToggle />
        </div>
      </header>
      <div class="page-intro wrap">
        <div>
          <h1>Lap <em>workbench.</em></h1>
          <p>Two qualifying laps. A closer look at the difference.</p>
        </div>
        <div class="source-note">Historical data from OpenF1</div>
      </div>
    </div>
    <main id="main" class="wrap" tabindex="-1">
      <form class="selectors" aria-label="Comparison selection" @submit.prevent>
        <div class="field session-field">
          <label for="session">Session</label>
          <div class="select-wrap">
            <select id="session">
              <option>Singapore 2023 · Qualifying</option></select
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        <div v-for="role in [0, 1]" :key="role" class="field driver-field">
          <label :for="`driver-${role}`">{{
            role ? 'Comparison driver' : 'Reference driver'
          }}</label>
          <div class="select-wrap">
            <select
              :id="`driver-${role}`"
              :value="requested[role]"
              :disabled="!ready"
              @change="select(role, $event)"
            >
              <option
                v-for="driver in catalog"
                :key="driver.number"
                :value="driver.number"
                :disabled="driver.number === requested[1 - role]"
              >
                {{ driver.firstName }} {{ driver.lastName }}
              </option></select
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        <button
          class="icon-button swap-button"
          type="button"
          :disabled="!ready"
          aria-label="Swap drivers"
          @click="compare([requested[1], requested[0]])"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
          </svg>
        </button>
      </form>
      <div v-if="pending || error" class="load-notice" role="status">
        <div>
          <strong>{{ pending ? 'Loading the requested comparison…' : error }}</strong>
          <p>
            Displayed below: {{ applied[0].name }} / {{ applied[1].name }}.
            {{
              pending
                ? 'Keeping these recorded laps visible while OpenF1 responds.'
                : 'These recorded laps are still available.'
            }}
          </p>
        </div>
        <button v-if="!pending" class="text-button" @click="compare(requested, 'none', true)">
          Retry
        </button>
      </div>
      <section aria-labelledby="comparison-title">
        <h2 id="comparison-title" class="sr-only">Compared laps</h2>
        <div class="comparison">
          <div v-for="(record, role) in applied" :key="role" class="driver">
            <div>
              <div class="driver-name">
                <span class="series-mark" :class="{ b: role === 1 }" aria-hidden="true"></span
                >{{ record.name }}
              </div>
              <p class="driver-sub">Q3 · Lap {{ record.lap }}</p>
            </div>
            <div class="driver-time">
              {{ lapTime(record.duration)
              }}<small>{{ role ? difference(delta) + ' to reference' : 'Reference lap' }}</small>
            </div>
          </div>
        </div>
        <p class="finding">
          <strong
            >{{ delta >= 0 ? applied[0].short : applied[1].short }} is
            {{ Math.abs(delta).toFixed(3) }} s quicker overall.</strong
          >
          Reported timing leads; the traces offer context, not a causal explanation.
        </p>
      </section>
      <section aria-labelledby="sectors-heading">
        <div class="section-heading">
          <div>
            <h2 id="sectors-heading">Where the time differs.</h2>
            <p>Select a sector to focus the traces.</p>
          </div>
          <button class="reset-button" :disabled="!ready" @click="chooseSector(0)">
            Show full lap
          </button>
        </div>
        <div class="sectors" role="group" aria-label="Focus a sector">
          <button
            v-for="n in [1, 2, 3]"
            :key="n"
            class="sector"
            :aria-pressed="sector === n"
            :disabled="!ready"
            @click="chooseSector(n)"
          >
            <span class="sector-title"
              >Sector {{ n
              }}<svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <path d="m5 12 4 4L19 6" /></svg></span
            ><span class="sector-difference"
              ><strong
                >{{
                  Math.abs(applied[1].sectors[n - 1] - applied[0].sectors[n - 1]).toFixed(3)
                }}
                s</strong
              ><span>{{
                applied[0].sectors[n - 1] === applied[1].sectors[n - 1]
                  ? 'Equal'
                  : (applied[1].sectors[n - 1] > applied[0].sectors[n - 1]
                      ? applied[0].short
                      : applied[1].short) + ' faster'
              }}</span></span
            ><span class="sector-times"
              ><span v-for="(record, role) in applied" :key="role"
                ><i class="series-mark" :class="{ b: role === 1 }" aria-hidden="true"></i
                ><span class="sr-only">{{ record.short }} </span
                >{{ record.sectors[n - 1].toFixed(3) }}</span
              ></span
            >
          </button>
        </div>
      </section>
      <div class="analysis">
        <section class="telemetry" aria-labelledby="telemetry-heading">
          <div class="telemetry-heading">
            <h2 id="telemetry-heading">Recorded traces</h2>
            <div class="legend">
              <span v-for="(record, role) in applied" :key="role"
                ><i class="series-mark" :class="{ b: role === 1 }" aria-hidden="true"></i
                >{{ record.short }}</span
              >
            </div>
          </div>
          <template v-if="trusted"
            ><TracePlots
              :aligned="aligned"
              :bounds="bounds"
              :progress="progress"
              @pick="moveCursor"
            />
            <div class="axis" aria-hidden="true">
              <span>{{ Math.round(bounds[0]) }}%</span
              ><span>{{ Math.round((bounds[0] + bounds[1]) / 2) }}%</span
              ><span>{{ Math.round(bounds[1]) }}%</span>
            </div></template
          >
          <p v-else class="load-notice">{{ aligned.find((a) => a.reason)?.reason }}</p>
          <label class="cursor-label" for="cursor"
            ><span>Estimated lap progress</span
            ><output for="cursor">{{ progress.toFixed(1).replace('.0', '') }}%</output></label
          ><input
            id="cursor"
            type="range"
            :min="bounds[0]"
            :max="bounds[1]"
            step="0.5"
            :value="progress"
            :aria-valuetext="progress.toFixed(1) + ' percent estimated lap progress'"
            aria-describedby="trace-note"
            :disabled="!ready || !trusted"
            @input="moveCursor(Number(($event.target as HTMLInputElement).value))"
          />
          <p id="trace-note" class="trace-note">
            Progress is estimated from sampled speed. Readings use the nearest recorded sample, not
            an exact on-track position. Missing channels remain gaps.
          </p>
        </section>
        <aside class="inspector" aria-labelledby="inspector-title">
          <h3 id="inspector-title">Readings near {{ progress.toFixed(1).replace('.0', '') }}%</h3>
          <p>Nearest recorded samples</p>
          <table class="readings">
            <thead>
              <tr>
                <th scope="col">Reading</th>
                <th v-for="record in applied" :key="record.driver" scope="col">
                  {{ record.short }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="metric in metrics" :key="metric.key">
                <th scope="row">{{ metric.label }}</th>
                <td v-for="role in [0, 1]" :key="role">{{ reading(role, metric.key) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="inspector-actions">
            <button
              ref="tableButton"
              class="text-button"
              :disabled="!ready"
              :aria-expanded="tableOpen"
              aria-controls="table-panel"
              @click="tableOpen ? closeTable() : (tableOpen = true)"
            >
              View data table</button
            ><button class="share-button" :disabled="!ready" @click="copyLink">
              Copy comparison link
            </button>
          </div>
          <label v-if="sharedLink" class="share-result"
            >Comparison URL<input
              readonly
              :value="sharedLink"
              @focus="($event.target as HTMLInputElement).select()"
          /></label>
        </aside>
      </div>
      <RawDataTable
        v-if="tableOpen"
        :key="applied.map((r) => r.driver).join('-')"
        :records="applied"
        @close="closeTable"
      />
      <noscript
        ><p class="trace-note">
          The saved comparison is available above. Enable JavaScript to choose drivers and inspect
          samples.
        </p></noscript
      >
      <details class="data-details">
        <summary>About this comparison</summary>
        <p>
          Singapore qualifying, 16 September 2023. Each completed lap matches its driver’s reported
          Q3 time in OpenF1’s session results.
        </p>
        <ul>
          <li v-for="record in applied" :key="record.driver">
            <a :href="record.source"
              >{{ record.name }} · lap {{ record.lap }} · {{ record.samples.length }} samples</a
            >. Retrieved {{ record.retrieved.slice(0, 10) }}.
          </li>
          <li>
            Lap and sector times are reported values. Progress integrates sampled speed and
            normalizes each trace. It is not measured track distance. Coverage guards withhold
            unreliable alignment.
          </li>
          <li>
            Brake indicates on or off, not pressure. Telemetry sampled at approximately 3.7 Hz
            cannot establish the cause of millisecond differences.
          </li>
          <li>
            The default pair is bundled. Other Q3 drivers load from the free historical API;
            completed recordings may be saved in this browser. No live feed or account is used.
          </li>
        </ul>
        <p>
          <a href="https://openf1.org/docs/">OpenF1 documentation</a> ·
          <a href="/lab/lap-compare/default-recordings.csv" download
            >Download saved Sainz / Russell CSV</a
          >
        </p>
        <button
          class="text-button"
          :disabled="!ready || pending"
          @click="compare(requested, 'none', true)"
        >
          Refresh from OpenF1
        </button>
      </details>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </main>
    <footer class="footer wrap">
      <span>Data from <a href="https://openf1.org/">OpenF1</a> · Unofficial historical data</span
      ><a href="https://github.com/emirfatusic/emirfatusic.github.io/tree/main/src/lap"
        >View the source<svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M7 17 17 7M7 7h10v10" /></svg
      ></a>
    </footer>
  </div>
</template>
