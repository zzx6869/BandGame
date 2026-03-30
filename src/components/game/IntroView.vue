<script setup lang="ts">
import { useSchoolGameStore } from '@/stores/schoolGame'

const store = useSchoolGameStore()
</script>

<template>
  <section class="card">
    <h1 class="title">市一中 · 高中三年</h1>
    <p class="lead">
      你是高一新生，带着 SAN、学业与一项主修乐器技能入学。按周推进：消耗 SAN 安排学习、练习、休息与社交；每周会触发随机事件，SAN 也会在周初固定恢复。
    </p>
    <p class="lead">
      与角色培养好感后可邀请入队；至少一名队员后解锁乐队排练、团建等玩法。高一从 9 月入学，时间按 12 个月推进（每月 4 周），高三 6 月第 4 周毕业。
    </p>
    <button type="button" class="btn primary" @click="store.fromIntro()">进入新的高中生活</button>
  </section>
</template>

<style scoped>
.card {
  padding: 0.5rem 0 2rem;
}

.title {
  font-size: 1.35rem;
  font-weight: 650;
  margin: 0 0 1rem;
  color: var(--text-h);
}

.lead {
  margin: 0 0 0.85rem;
  line-height: 1.65;
  font-size: 0.98rem;
  color: var(--text);
}

.btn {
  font: inherit;
  cursor: pointer;
  margin-top: 0.5rem;
  border-radius: 0.45rem;
  border: 1px solid var(--border);
  padding: 0.6rem 1.1rem;
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-text);
}

.btn.primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
</style>
