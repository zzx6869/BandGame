<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSchoolGameStore } from '@/stores/schoolGame'
import { INSTRUMENT_LABEL } from '@/game/labels'
import type { Instrument } from '@/game/types'

const store = useSchoolGameStore()
const { academics, mainSkill, mainInstrument, bond, bandMemberIds, songs } = storeToRefs(store)

function inst(i: Instrument | null) {
  return i ? INSTRUMENT_LABEL[i] : '—'
}
</script>

<template>
  <section class="card">
    <h1 class="title">毕业</h1>
    <p class="lead">三年里的碎片拼成一段可以复述的故事：学业 {{ academics }}，主修 {{ inst(mainInstrument) }} {{ mainSkill }}。</p>
    <p v-if="bandMemberIds.length" class="lead">
      乐队最终羁绊 {{ bond }}，队员 {{ bandMemberIds.length }} 人，登记曲目 {{ songs.length }} 首。
    </p>
    <p v-else class="lead">你没有组起乐队——也可以是一种结局。</p>
    <button type="button" class="btn primary" @click="store.exitToMainMenu()">返回标题</button>
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
  color: var(--text);
}

.btn {
  font: inherit;
  cursor: pointer;
  margin-top: 0.5rem;
  border-radius: 0.45rem;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-text);
  padding: 0.6rem 1.1rem;
}

.btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
</style>
