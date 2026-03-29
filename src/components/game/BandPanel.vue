<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useSchoolGameStore } from '@/stores/schoolGame'
import type { BandPanelTab } from '@/game/types'
import type { NpcSnapshot } from '@/game/npc'
import { INSTRUMENT_LABEL } from '@/game/labels'
const store = useSchoolGameStore()
const { bandPanelOpen, bandPanelTab, bond, bandMemberIds, songs, bandActivityLog, characters } =
  storeToRefs(store)

const tabs: { id: BandPanelTab; label: string }[] = [
  { id: 'overview', label: '概览' },
  { id: 'members', label: '成员' },
  { id: 'songs', label: '曲目' },
  { id: 'log', label: '记录' },
  { id: 'actions', label: '活动' },
]

const membersDetail = computed((): NpcSnapshot[] =>
  bandMemberIds.value
    .map((id) => characters.value.find((c) => c.id === id))
    .filter((c): c is NpcSnapshot => c != null),
)

/** 乐队成员两两亲密度（每种关系一行） */
const memberIntimacyLines = computed(() => {
  const ids = [...bandMemberIds.value].sort()
  const byId = new Map(characters.value.map((c) => [c.id, c] as const))
  const lines: string[] = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = byId.get(ids[i]!)
      const b = byId.get(ids[j]!)
      if (!a || !b) continue
      const v = a.intimacyWithOthers[b.id] ?? 0
      lines.push(`${a.name} ↔ ${b.name}：${v}`)
    }
  }
  return lines
})
</script>

<template>
  <Teleport to="body">
    <div v-if="bandPanelOpen" class="backdrop" @click.self="store.closeBand()">
      <div class="panel" role="dialog" aria-modal="true" aria-label="乐队界面">
        <header class="panel-head">
          <h2 class="panel-title">乐队</h2>
          <button type="button" class="close" aria-label="关闭" @click="store.closeBand()">×</button>
        </header>

        <nav class="tabs">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            class="tab"
            :class="{ active: bandPanelTab === t.id }"
            @click="store.bandPanelTab = t.id"
          >
            {{ t.label }}
          </button>
        </nav>

        <div class="panel-body">
          <template v-if="bandPanelTab === 'overview'">
            <p><strong>羁绊</strong>：{{ bond }}（0–100）</p>
            <p><strong>队员数</strong>：{{ bandMemberIds.length }}</p>
            <p class="muted">排练与团建可提升羁绊；熟练度在「曲目」中查看。</p>
          </template>

          <template v-else-if="bandPanelTab === 'members'">
            <ul class="list member-cards">
              <li v-for="m in membersDetail" :key="m.id" class="member-card">
                <strong>{{ m.name }}</strong>
                · {{ INSTRUMENT_LABEL[m.specialty] }} 技能 {{ m.specialtySkill }}
                · 对主角好感 {{ m.favorWithPlayer }}
              </li>
            </ul>
            <p v-if="memberIntimacyLines.length" class="subheading">队内亲密度</p>
            <ul v-if="memberIntimacyLines.length" class="list intimacy">
              <li v-for="(line, idx) in memberIntimacyLines" :key="idx">{{ line }}</li>
            </ul>
            <p v-if="!membersDetail.length" class="muted">暂无队员数据</p>
          </template>

          <template v-else-if="bandPanelTab === 'songs'">
            <ul class="list">
              <li v-for="s in songs" :key="s.id">《{{ s.title }}》熟练度 {{ s.proficiency }}</li>
            </ul>
            <p v-if="!songs.length" class="muted">尚未登记曲目，先在主界面进行「乐队排练」。</p>
          </template>

          <template v-else-if="bandPanelTab === 'log'">
            <ul class="log-list">
              <li v-for="(e, i) in bandActivityLog" :key="i">
                <span class="wk">{{ e.weekLabel }}</span>
                {{ e.text }}
              </li>
            </ul>
            <p v-if="!bandActivityLog.length" class="muted">暂无乐队活动记录</p>
          </template>

          <template v-else-if="bandPanelTab === 'actions'">
            <p class="muted">与主界面相同，便于在面板内操作。</p>
            <div class="row">
              <button type="button" class="btn" @click="store.bandPractice()">乐队排练</button>
              <button type="button" class="btn" @click="store.bandHangout()">乐队团建</button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--backdrop);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

@media (min-width: 560px) {
  .backdrop {
    align-items: center;
    padding: 1rem;
  }
}

.panel {
  width: 100%;
  max-width: 26rem;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
}

@media (min-width: 560px) {
  .panel {
    border-radius: 0.75rem;
  }
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border);
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
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

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
}

.tab {
  font: inherit;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 0.35rem;
  padding: 0.35rem 0.55rem;
  font-size: 0.82rem;
  background: transparent;
  color: var(--text-muted);
}

.tab.active {
  color: var(--text-h);
  border-color: var(--border);
  background: var(--panel-hover);
}

.panel-body {
  padding: 1rem;
  overflow-y: auto;
  line-height: 1.55;
  font-size: 0.92rem;
  color: var(--text);
}

.muted {
  color: var(--text-muted);
  font-size: 0.88rem;
}

.subheading {
  margin: 1rem 0 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
}

.member-cards {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.member-card {
  margin-bottom: 0.45rem;
  line-height: 1.45;
}

.list.intimacy {
  font-size: 0.88rem;
}

.list,
.log-list {
  margin: 0;
  padding-left: 1.1rem;
}

.log-list .wk {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.15rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btn {
  font: inherit;
  cursor: pointer;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--panel-hover);
  color: var(--text);
  padding: 0.45rem 0.75rem;
}

.btn:hover {
  border-color: var(--accent);
  background: var(--panel);
}
</style>
