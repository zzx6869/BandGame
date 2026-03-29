<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSchoolGameStore } from '@/stores/schoolGame'
import { INSTRUMENT_LABEL } from '@/game/labels'
import type { Instrument } from '@/game/types'

const store = useSchoolGameStore()
const { san, sanMax, academics, mainSkill, mainInstrument, currentWeekLabel } = storeToRefs(store)

function instLabel(i: Instrument | null) {
  return i ? INSTRUMENT_LABEL[i] : '—'
}
</script>

<template>
  <div class="hud" aria-label="角色状态">
    <div class="hud-inner">
      <div class="hud-item wide">
        <span class="hud-label">学期</span>
        <span class="hud-value">{{ currentWeekLabel }}</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">SAN</span>
        <span class="hud-value">{{ san }} / {{ sanMax }}</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">学业</span>
        <span class="hud-value">{{ academics }}</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">主修</span>
        <span class="hud-value">{{ instLabel(mainInstrument) }} {{ mainSkill }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hud {
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 -1.25rem 1.25rem;
  padding: 0.65rem 1.25rem;
  background: var(--hud-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.hud-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 40rem;
  margin: 0 auto;
}

.hud-item {
  flex: 1 1 auto;
  min-width: 5rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.4rem 0.55rem;
  border-radius: 0.4rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

.hud-item.wide {
  flex: 1 1 100%;
  min-width: 100%;
}

@media (min-width: 480px) {
  .hud-item.wide {
    flex: 2 1 12rem;
    min-width: 8rem;
  }
}

.hud-label {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.hud-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-h);
  font-variant-numeric: tabular-nums;
}
</style>
