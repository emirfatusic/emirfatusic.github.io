<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dialogCommands, type DialogCommand } from '../content'

const ready = ref(false)
const dialog = ref<HTMLDialogElement | null>(null)
let opener: HTMLElement | null = null
let destination: string | null = null

onMounted(() => {
  ready.value = true
})

function open(event: MouseEvent) {
  if (!dialog.value || dialog.value.open) return
  opener = event.currentTarget as HTMLElement
  destination = null
  dialog.value.showModal()
  dialog.value.querySelector<HTMLAnchorElement>('a')?.focus()
}

function activate(command: DialogCommand, event: MouseEvent) {
  if (!command.href.startsWith('#')) {
    dismiss()
    return
  }
  event.preventDefault()
  destination = command.id
  dialog.value?.close('navigate')
}

function dismiss() {
  destination = null
  dialog.value?.close('dismiss')
}

// Native close restoration happens first. The next frame owns the final focus:
// selection -> destination heading; dismissal -> the exact opener.
function afterClose() {
  const id = destination
  const source = opener
  destination = null
  requestAnimationFrame(() => {
    if (dialog.value?.open) return
    const heading = id ? document.querySelector<HTMLElement>(`#${id}-title`) : null
    if (!heading) {
      source?.focus({ preventScroll: true })
      return
    }
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
    heading.focus({ preventScroll: true })
    heading.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}

function navigate(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    const controls = Array.from(
      dialog.value?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? [],
    )
    const first = controls[0]
    const last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
    return
  }
  const links = Array.from(
    dialog.value?.querySelectorAll<HTMLAnchorElement>('.dialog-command') ?? [],
  )
  if (!links.length) return
  const index = links.indexOf(document.activeElement as HTMLAnchorElement)
  let next: number
  if (event.key === 'ArrowDown') next = (index + 1) % links.length
  else if (event.key === 'ArrowUp')
    next = index < 0 ? links.length - 1 : (index - 1 + links.length) % links.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = links.length - 1
  else return
  event.preventDefault()
  links[next]?.focus()
}
</script>

<template>
  <div class="lab-launcher">
    <button
      class="button button--primary"
      type="button"
      :disabled="!ready"
      aria-haspopup="dialog"
      aria-controls="command-dialog"
      @click="open"
    >
      Open command menu
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </button>
    <p class="lab-hint">Try it with your keyboard. Or just click around.</p>
    <noscript
      >The interactive demo needs JavaScript. All page links and design notes are available without
      it.</noscript
    >
  </div>
  <dialog
    id="command-dialog"
    ref="dialog"
    class="command-dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-instructions"
    @cancel.prevent="dismiss"
    @close="afterClose"
    @keydown="navigate"
  >
    <div class="dialog-header">
      <h3 id="dialog-title">Go somewhere.</h3>
      <button type="button" class="close-button" aria-label="Close command menu" @click="dismiss">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
    <ul class="dialog-commands">
      <li v-for="command in dialogCommands" :key="command.id">
        <a
          class="dialog-command"
          :href="command.href"
          :aria-labelledby="`dialog-${command.id}-label`"
          :aria-describedby="`dialog-${command.id}-description`"
          @click="activate(command, $event)"
          ><svg
            class="command-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path :d="command.icon" /></svg
          ><span class="command-copy"
            ><span :id="`dialog-${command.id}-label`" class="command-title">{{
              command.label
            }}</span
            >{{ ' '
            }}<span :id="`dialog-${command.id}-description`" class="command-description">{{
              command.description
            }}</span></span
          ><svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <path d="M20 5v8a3 3 0 0 1-3 3H4m5-5-5 5 5 5" /></svg
        ></a>
      </li>
    </ul>
    <p id="dialog-instructions" class="dialog-instructions">
      <kbd>↑</kbd><kbd>↓</kbd> or <kbd>Tab</kbd> to navigate
      <span><kbd>Enter</kbd> to go <kbd>Esc</kbd> to close</span>
    </p>
  </dialog>
</template>
