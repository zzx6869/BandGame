import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { Story } from 'inkjs'
import demoStory from '@/ink/demo.ink.json'

export type BandStats = {
  week: number
  stamina: number
  skillPlay: number
  skillWrite: number
  bond: number
}

const defaultStats: BandStats = {
  week: 1,
  stamina: 10,
  skillPlay: 3,
  skillWrite: 2,
  bond: 2,
}

/** Ink 周常 Demo：叙事在 .ink，数值在每次 Continue/选项后同步到 stats（Ink 非响应式，需手动 sync） */
export const useBandStoryStore = defineStore('bandStory', () => {
  const story = shallowRef<Story | null>(null)
  const narrative = ref('')
  const choices = ref<Array<{ text: string; index: number }>>([])
  const ended = ref(false)
  const endingId = ref<string | null>(null)
  const stats = ref<BandStats>({ ...defaultStats })

  function syncStatsFromInk() {
    const s = story.value
    if (!s) {
      stats.value = { ...defaultStats }
      return
    }
    const vs = s.variablesState
    stats.value = {
      week: Number(vs.$('week')),
      stamina: Number(vs.$('stamina')),
      skillPlay: Number(vs.$('skill_play')),
      skillWrite: Number(vs.$('skill_write')),
      bond: Number(vs.$('bond')),
    }
  }

  function stepNarrative() {
    const st = story.value
    if (!st) return

    let text = ''
    while (st.canContinue) {
      text += st.Continue() ?? ''
    }

    const ctags = st.currentTags ?? []
    const end = ctags.find((t) => t.startsWith('ending:'))
    endingId.value = end ? end.slice('ending:'.length) : null

    const noContinue = !st.canContinue
    const noChoices = st.currentChoices.length === 0
    ended.value = noContinue && noChoices

    narrative.value = text.trim()
    choices.value = st.currentChoices.map((c, i) => ({ text: c.text, index: i }))
    syncStatsFromInk()
  }

  function start() {
    const st = new Story(demoStory)
    st.ResetState()
    story.value = st
    ended.value = false
    endingId.value = null
    stepNarrative()
  }

  function choose(choiceIndex: number) {
    story.value?.ChooseChoiceIndex(choiceIndex)
    stepNarrative()
  }

  return { narrative, choices, ended, endingId, stats, start, choose }
})
