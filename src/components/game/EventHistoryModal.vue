<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSchoolGameStore } from '@/stores/schoolGame'

const store = useSchoolGameStore()
const { historyPanelOpen, narrativeLines } = storeToRefs(store)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="historyPanelOpen"
      class="backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hist-title"
      @click.self="store.closeHistory()"
    >
      <div class="panel">
        <header class="head">
          <h2 id="hist-title" class="title">事件与行动历史</h2>
          <button type="button" class="close" aria-label="关闭" @click="store.closeHistory()">×</button>
        </header>
        <div class="body">
          <p v-if="narrativeLines.length === 0" class="empty">还没有记录。进行行动或进入新周后会出现条目。</p>
          <ul v-else class="list">
            <li v-for="(line, i) in narrativeLines" :key="i" class="item">{{ line }}</li>
          </ul>
        </div>
        <footer class="foot">
          <button type="button" class="btn" @click="store.closeHistory()">关闭</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 45;
  background: var(--backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.panel {
  width: 100%;
  max-width: 26rem;
  max-height: min(85vh, 32rem);
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.title {
  margin: 0;
  font-size: 1rem;
  color: var(--text-h);
}

.close {
  font: inherit;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
  padding: 0 0.25rem;
}

.body {
  padding: 0.75rem 1rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.empty {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.list {
  margin: 0;
  padding: 0 0 0 1rem;
}

.item {
  margin: 0 0 0.5rem;
  line-height: 1.55;
  font-size: 0.9rem;
  color: var(--text);
}

.item:last-child {
  margin-bottom: 0;
}

.foot {
  padding: 0.65rem 1rem;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.btn {
  font: inherit;
  cursor: pointer;
  width: 100%;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--panel-hover);
  color: var(--text);
  padding: 0.5rem 0.75rem;
}

.btn:hover {
  border-color: var(--accent);
}
</style>
