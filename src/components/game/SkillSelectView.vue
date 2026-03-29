<script setup lang="ts">
import { useSchoolGameStore } from '@/stores/schoolGame'
import { INSTRUMENT_LABEL } from '@/game/labels'
import type { Instrument } from '@/game/types'

const store = useSchoolGameStore()

const options = (Object.keys(INSTRUMENT_LABEL) as Instrument[]).map((key) => ({
  key,
  label: INSTRUMENT_LABEL[key],
}))
</script>

<template>
  <section class="card">
    <div class="top-actions">
      <button type="button" class="btn ghost" @click="store.exitToMainMenu()">退出本次游戏</button>
    </div>
    <h2 class="title">选择主修方向</h2>
    <p class="hint">对应吉他 / 声乐 / 贝斯 / 鼓 / 键盘中的一项，决定「主修技能」的成长语境。</p>
    <div class="grid">
      <button
        v-for="o in options"
        :key="o.key"
        type="button"
        class="btn tile"
        @click="store.selectInstrument(o.key)"
      >
        {{ o.label }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.card {
  padding: 0.5rem 0 2rem;
}

.top-actions {
  margin-bottom: 0.75rem;
}

.btn.ghost {
  font: inherit;
  cursor: pointer;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-muted);
  padding: 0.45rem 0.75rem;
  font-size: 0.85rem;
}

.btn.ghost:hover {
  border-color: #b91c1c;
  color: #b91c1c;
}

@media (prefers-color-scheme: dark) {
  .btn.ghost:hover {
    border-color: #f87171;
    color: #fca5a5;
  }
}

.title {
  font-size: 1.2rem;
  font-weight: 650;
  margin: 0 0 0.5rem;
  color: var(--text-h);
}

.hint {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: 0.55rem;
}

.btn {
  font: inherit;
  cursor: pointer;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  padding: 0.75rem 0.5rem;
  transition: border-color 0.12s ease, background 0.12s ease;
}

.btn:hover {
  border-color: var(--accent);
  background: var(--panel-hover);
}
</style>
