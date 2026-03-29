<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchoolGameStore } from '@/stores/schoolGame'
import { INSTRUMENT_LABEL } from '@/game/labels'

const store = useSchoolGameStore()
const { unlockedRosterOpen, characters, npcRandomEventMemories } = storeToRefs(store)

const metRoster = computed(() => {
  const list = characters.value
    .filter((c) => c.met)
    .map((c) => ({
      ...c,
      specialtyLabel: INSTRUMENT_LABEL[c.specialty],
      memories: npcRandomEventMemories.value[c.id] ?? [],
    }))
  list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  return list
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="unlockedRosterOpen"
      class="backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="roster-title"
      @click.self="store.closeUnlockedRoster()"
    >
      <div class="panel">
        <header class="head">
          <h2 id="roster-title" class="title">认识的人</h2>
          <button type="button" class="close" aria-label="关闭" @click="store.closeUnlockedRoster()">×</button>
        </header>
        <div class="body">
          <p class="hint">只在随机事件里真正打过交道的人会计入。未出现的角色仍生活在学校里，只是你还没在事件里对上话。</p>
          <p v-if="metRoster.length === 0" class="empty">还没有在随机事件中认识任何人。多经历几周试试看。</p>
          <ul v-else class="people">
            <li v-for="c in metRoster" :key="c.id" class="card">
              <div class="row top">
                <span class="name">{{ c.name }}</span>
                <span class="favor">好感 {{ c.favorWithPlayer }}</span>
              </div>
              <p class="meta">{{ c.specialtyLabel }} · 专精 {{ c.specialtySkill }}</p>
              <p v-if="c.note" class="note">{{ c.note }}</p>
              <div v-if="c.memories.length" class="events">
                <span class="sub">随机事件里与 TA 相关的互动</span>
                <ul class="evlist">
                  <li v-for="(m, i) in c.memories" :key="`${m.eventId}-${i}`" class="ev">
                    <span class="ev-wk">{{ m.weekLabel }}</span>
                    <span v-if="m.choiceLabel" class="ev-choice">「{{ m.choiceLabel }}」</span>
                    <p class="ev-snippet">{{ m.snippet }}</p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <footer class="foot">
          <button type="button" class="btn" @click="store.closeUnlockedRoster()">关闭</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 46;
  background: var(--backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.panel {
  width: 100%;
  max-width: 28rem;
  max-height: min(88vh, 36rem);
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

.hint {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--text-muted);
}

.empty {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.people {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card {
  padding: 0.65rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
}

.row.top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.35rem;
}

.name {
  font-weight: 600;
  color: var(--text-h);
}

.favor {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.meta {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.note {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: var(--text);
  line-height: 1.4;
}

.events {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.sub {
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.evlist {
  margin: 0.35rem 0 0;
  padding: 0 0 0 0.9rem;
}

.ev {
  margin: 0 0 0.45rem;
  font-size: 0.8rem;
  color: var(--text);
  line-height: 1.45;
}

.ev:last-child {
  margin-bottom: 0;
}

.ev-wk {
  display: block;
  font-size: 0.72rem;
  color: var(--accent);
  font-weight: 600;
}

.ev-choice {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.ev-snippet {
  margin: 0.2rem 0 0;
  white-space: pre-wrap;
  font-size: 0.78rem;
  color: var(--text-muted);
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
