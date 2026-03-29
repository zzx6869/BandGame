<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSchoolGameStore } from '@/stores/schoolGame'
import GameHud from '@/components/game/GameHud.vue'
import IntroView from '@/components/game/IntroView.vue'
import SkillSelectView from '@/components/game/SkillSelectView.vue'
import WeekMainView from '@/components/game/WeekMainView.vue'
import GraduatedView from '@/components/game/GraduatedView.vue'
import RandomEventModal from '@/components/game/RandomEventModal.vue'
import EventHistoryModal from '@/components/game/EventHistoryModal.vue'
import UnlockedRosterModal from '@/components/game/UnlockedRosterModal.vue'
import BandPanel from '@/components/game/BandPanel.vue'

const { phase } = storeToRefs(useSchoolGameStore())
</script>

<template>
  <div class="page">
    <GameHud v-if="phase === 'playing'" />
    <IntroView v-if="phase === 'intro'" />
    <SkillSelectView v-else-if="phase === 'skill_select'" />
    <WeekMainView v-else-if="phase === 'playing'" />
    <GraduatedView v-else-if="phase === 'graduated'" />
    <RandomEventModal />
    <EventHistoryModal />
    <UnlockedRosterModal />
    <BandPanel />
  </div>
</template>

<style scoped>
.page {
  max-width: 40rem;
  margin: 0 auto;
  padding: 0 1.25rem 4rem;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
