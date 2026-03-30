<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useSchoolGameStore } from '@/stores/schoolGame'
import { INSTRUMENT_LABEL } from '@/game/labels'

const store = useSchoolGameStore()
const {
  characters,
  bandMemberIds,
  bandUnlocked,
  restUsedThisWeek,
  inviteFeedbackVisible,
  inviteFeedbackTitle,
  inviteFeedbackSpeech,
  inviteFeedbackReasons,
} = storeToRefs(store)

const roster = computed(() =>
  characters.value
    .filter((c) => c.met)
    .map((c) => ({
      ...c,
      specialtyLabel: INSTRUMENT_LABEL[c.specialty],
      inBand: bandMemberIds.value.includes(c.id),
      canInvite: !bandMemberIds.value.includes(c.id),
    })),
)
</script>

<template>
  <section class="week">
    <div class="toolbar">
      <button type="button" class="btn ghost" @click="store.openHistory()">事件历史</button>
      <button type="button" class="btn ghost" @click="store.openUnlockedRoster()">认识的人</button>
      <button type="button" class="btn ghost danger" @click="store.exitToMainMenu()">退出本次游戏</button>
      <button
        type="button"
        class="btn ghost"
        :disabled="!bandUnlocked"
        :title="!bandUnlocked ? '至少邀请一名队员后解锁' : ''"
        @click="store.openBand('overview')"
      >
        乐队界面
      </button>
      <span v-if="!bandUnlocked" class="tip">邀请 1 人入队后解锁乐队活动</span>
    </div>

    <h3 class="section-title">本周行动（消耗 SAN；休息每周限 1 次）</h3>
    <div class="actions">
      <button type="button" class="btn" @click="store.study()">学习</button>
      <button type="button" class="btn" @click="store.practice()">练习（主修）</button>
      <button
        type="button"
        class="btn"
        :disabled="restUsedThisWeek"
        :title="restUsedThisWeek ? '本周已休息过' : ''"
        @click="store.rest()"
      >
        休息
      </button>
    </div>

    <h3 class="section-title">社交与招募（仅已认识的人）</h3>
    <p v-if="roster.length === 0" class="roster-empty">
      目前还没有在随机事件里认识的人。做完本周随机事件后，可打开「认识的人」查看详情。
    </p>
    <ul v-else class="people">
      <li v-for="c in roster" :key="c.id" class="person">
        <span class="name">{{ c.name }}</span>
        <span class="meta">{{ c.specialtyLabel }} · 技能 {{ c.specialtySkill }}</span>
        <span class="favor">好感 {{ c.favorWithPlayer }}</span>
        <button type="button" class="btn small" @click="store.chatWith(c.id)">对话</button>
        <button
          type="button"
          class="btn small"
          :disabled="c.inBand"
          @click="store.invite(c.id)"
        >
          {{ c.inBand ? '已在队内' : '邀请入队' }}
        </button>
      </li>
    </ul>

    <template v-if="bandUnlocked">
      <h3 class="section-title">乐队活动</h3>
      <div class="actions">
        <button type="button" class="btn" @click="store.bandPractice()">乐队排练</button>
        <button type="button" class="btn" @click="store.bandHangout()">乐队团建</button>
      </div>
    </template>

    <div class="footer">
      <button type="button" class="btn primary wide" @click="store.endWeek()">结束本周</button>
    </div>

    <div v-if="inviteFeedbackVisible" class="modal-mask" @click.self="store.closeInviteFeedback()">
      <article class="modal-card">
        <header class="modal-head">
          <h4>{{ inviteFeedbackTitle }}</h4>
          <button type="button" class="btn small" @click="store.closeInviteFeedback()">关闭</button>
        </header>
        <p class="speech">“{{ inviteFeedbackSpeech }}”</p>
        <ul class="reasons">
          <li v-for="(r, idx) in inviteFeedbackReasons" :key="idx">{{ r }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.week {
  padding-bottom: 2rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.tip {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.roster-empty {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: var(--text-h);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.people {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.person {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.65rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
}

.name {
  font-weight: 600;
  color: var(--text-h);
  min-width: 3rem;
}

.meta {
  font-size: 0.78rem;
  color: var(--text-muted);
  flex: 1 1 100%;
}

@media (min-width: 420px) {
  .meta {
    flex: 1 1 auto;
  }
}

.favor {
  font-size: 0.85rem;
  color: var(--text-muted);
  flex: 1 1 auto;
}

.btn {
  font: inherit;
  cursor: pointer;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  padding: 0.45rem 0.75rem;
  font-size: 0.9rem;
}

.btn:hover:not(:disabled) {
  border-color: var(--accent);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn.small {
  padding: 0.3rem 0.55rem;
  font-size: 0.82rem;
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-text);
}

.btn.primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn.ghost {
  background: var(--bg-elevated);
}

.btn.ghost.danger {
  color: var(--text-muted);
  border-color: var(--border);
}

.btn.ghost.danger:hover:not(:disabled) {
  border-color: #b91c1c;
  color: #b91c1c;
}

@media (prefers-color-scheme: dark) {
  .btn.ghost.danger:hover:not(:disabled) {
    border-color: #f87171;
    color: #fca5a5;
  }
}

.btn.wide {
  width: 100%;
  max-width: 16rem;
  margin-top: 0.25rem;
}

.footer {
  margin-top: 1.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 1rem;
}

.modal-card {
  width: min(36rem, 100%);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  padding: 0.8rem;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.modal-head h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-h);
}

.speech {
  margin: 0.8rem 0 0.5rem;
  color: var(--text);
  line-height: 1.6;
}

.reasons {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--text-muted);
  font-size: 0.86rem;
  line-height: 1.5;
}
</style>
