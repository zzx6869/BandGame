<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchoolGameStore } from '@/stores/schoolGame'
import type { RandomEventChoice } from '@/game/randomEvents'

const store = useSchoolGameStore()
const {
  activeRandomEvent,
  randomEventQueue,
  randomEventsThisWeekTotal,
  randomEventVisibleOutcome,
} = storeToRefs(store)

const progressLabel = computed(() => {
  const total = randomEventsThisWeekTotal.value
  const remaining = randomEventQueue.value.length
  if (!activeRandomEvent.value || total <= 0) return ''
  const index = total - remaining + 1
  return `第 ${index} / ${total} 件`
})

const choices = computed(() => activeRandomEvent.value?.choices ?? [])
const needsChoice = computed(() => choices.value.length > 0)

function onChoose(c: RandomEventChoice) {
  store.resolveActiveRandomEvent(c)
}

function onContinue() {
  store.resolveActiveRandomEvent()
}

function onDismissOutcome() {
  store.dismissRandomEventVisibleOutcome()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="randomEventVisibleOutcome"
      class="backdrop backdrop-outcome"
      role="dialog"
      aria-modal="true"
      aria-labelledby="outcome-title"
    >
      <div class="modal">
        <h2 id="outcome-title" class="modal-title">属性变化</h2>
        <p class="modal-body">{{ randomEventVisibleOutcome }}</p>
        <button type="button" class="btn primary" @click="onDismissOutcome">知道了</button>
      </div>
    </div>
    <div
      v-else-if="activeRandomEvent"
      class="backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ev-title"
    >
      <div class="modal">
        <p v-if="progressLabel" class="progress">{{ progressLabel }}</p>
        <h2 id="ev-title" class="modal-title">本周随机事件</h2>
        <p class="modal-body">{{ activeRandomEvent.text }}</p>

        <div v-if="needsChoice" class="choices" role="group" aria-label="你的选择">
          <button
            v-for="c in choices"
            :key="c.id"
            type="button"
            class="btn choice"
            @click="onChoose(c)"
          >
            {{ c.label }}
          </button>
        </div>
        <button v-else type="button" class="btn primary" @click="onContinue()">继续</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.backdrop-outcome {
  z-index: 55;
}

.modal {
  max-width: 26rem;
  width: 100%;
  max-height: min(90vh, 28rem);
  overflow-y: auto;
  padding: 1.25rem;
  border-radius: 0.6rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.progress {
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.modal-title {
  margin: 0 0 0.65rem;
  font-size: 1rem;
  color: var(--text-h);
}

.modal-body {
  margin: 0 0 1rem;
  line-height: 1.6;
  font-size: 0.95rem;
  color: var(--text);
  white-space: pre-wrap;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn {
  font: inherit;
  cursor: pointer;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--panel-hover);
  color: var(--text);
  padding: 0.55rem 0.85rem;
  text-align: left;
  line-height: 1.45;
}

.btn:hover {
  border-color: var(--accent);
}

.btn.choice {
  font-size: 0.9rem;
}

.btn.primary {
  width: 100%;
  border-color: var(--accent);
  background: var(--accent);
  color: var(--accent-text);
  text-align: center;
}

.btn.primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
</style>
