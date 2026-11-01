<script setup lang="ts">
import { commands } from '../content'
</script>

<template>
  <nav class="glass-panel" aria-label="Explore the portfolio">
    <span class="glass-panel-rim" aria-hidden="true"></span>
    <a
      v-for="command in commands"
      :key="command.id"
      :href="`#${command.id}`"
      :aria-labelledby="`panel-${command.id}-label`"
      :aria-describedby="`panel-${command.id}-description`"
      class="glass-command"
    >
      <svg
        class="command-icon"
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path :d="command.icon" />
      </svg>
      <span class="command-copy"
        ><span :id="`panel-${command.id}-label`" class="command-title">{{ command.label }}</span
        >{{ ' '
        }}<span :id="`panel-${command.id}-description`" class="command-description">{{
          command.description
        }}</span></span
      >
      <span class="command-enter" aria-hidden="true"
        ><svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 5v8a3 3 0 0 1-3 3H4m5-5-5 5 5 5" /></svg
      ></span>
    </a>
  </nav>
</template>
