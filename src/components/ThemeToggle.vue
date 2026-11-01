<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const ready = ref(false)
const dark = ref(false)
let preference: 'light' | 'dark' | null = null
let media: MediaQueryList | null = null

function apply() {
  dark.value = preference === 'dark' || (preference === null && Boolean(media?.matches))
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark.value ? '#0b1e2a' : '#eaf5f8')
}

function toggle() {
  preference = dark.value ? 'light' : 'dark'
  apply()
  try {
    localStorage.setItem('emir-theme', preference)
  } catch {
    // The choice still works for this visit when browser storage is unavailable.
  }
}

onMounted(() => {
  media = window.matchMedia('(prefers-color-scheme: dark)')
  try {
    const saved = localStorage.getItem('emir-theme')
    if (saved === 'light' || saved === 'dark') preference = saved
  } catch {
    // Follow the device preference when storage cannot be read.
  }
  apply()
  media.addEventListener('change', apply)
  ready.value = true
})

onUnmounted(() => media?.removeEventListener('change', apply))
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :disabled="!ready"
    :aria-label="dark ? 'Use light appearance' : 'Use dark appearance'"
    :title="dark ? 'Use light appearance' : 'Use dark appearance'"
    @click="toggle"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <g v-if="dark">
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"
        />
      </g>
      <path v-else d="M20.8 13.4A9 9 0 0 1 10.6 3.2 9 9 0 1 0 20.8 13.4Z" />
    </svg>
  </button>
</template>
