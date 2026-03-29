import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { BandActivityRecord, BandPanelTab, GamePhase, Instrument, SongEntry } from '@/game/types'
import {
  ACTIVITY,
  INITIAL_ACADEMICS,
  INITIAL_MAIN_SKILL,
  INITIAL_NPCS,
  INITIAL_SAN,
  INVITE_FAVOR_THRESHOLD,
  SAN_MAX,
  SCHOOL_YEARS,
  STAT_MAX,
  WEEKLY_SAN_RECOVERY,
  WEEKS_PER_SCHOOL_YEAR,
  weeklyRandomEventCount,
} from '@/game/config'
import type { NpcSnapshot } from '@/game/npc'
import { cloneNpcSnapshotList } from '@/game/npc'
import { weekLabel } from '@/game/labels'
import {
  RANDOM_EVENT_DEFS,
  applyMetFromEffects,
  pickWeeklyRandomEvents,
  resolveRandomEventEffects,
  type RandomEventChoice,
  type RandomEventContext,
  type RandomEventDef,
  type RandomEventEffects,
} from '@/game/randomEvents'
import {
  clearSchoolGamePersisted,
  loadSchoolGamePersisted,
  saveSchoolGamePersisted,
  SCHOOL_GAME_SAVE_VERSION,
  type NpcRandomEventMemory,
  type SchoolGamePersisted,
} from './schoolGamePersistence'

export type { NpcRandomEventMemory } from './schoolGamePersistence'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export const useSchoolGameStore = defineStore('schoolGame', () => {
  const phase = ref<GamePhase>('intro')
  const san = ref(INITIAL_SAN)
  const sanMax = ref(SAN_MAX)
  const academics = ref(INITIAL_ACADEMICS)
  const mainSkill = ref(INITIAL_MAIN_SKILL)
  const mainInstrument = ref<Instrument | null>(null)

  const year = ref(1)
  const weekInYear = ref(1)

  const characters = ref<NpcSnapshot[]>(cloneNpcSnapshotList(INITIAL_NPCS))

  const bond = ref(0)
  const bandMemberIds = ref<string[]>([])
  const songs = ref<SongEntry[]>([])
  const bandActivityLog = ref<BandActivityRecord[]>([])

  const narrativeLines = ref<string[]>([])
  /** 本周尚未处理完的随机事件（队首即当前弹窗） */
  const randomEventQueue = ref<RandomEventDef[]>([])
  /** 进入本周队列时的总数，用于弹窗「第 i / n 件」 */
  const randomEventsThisWeekTotal = ref(0)
  /** 选择后需展示的显性数值变化（无则不出层） */
  const randomEventVisibleOutcome = ref<string | null>(null)
  /** 有待关闭显性提示后再出队下一条事件 */
  const randomEventDeferQueueAdvance = ref(false)
  /** 每名已互动角色在随机事件中的履历（仅记入与主角直接相关的结算） */
  const npcRandomEventMemories = ref<Record<string, NpcRandomEventMemory[]>>({})
  const unlockedRosterOpen = ref(false)
  const bandPanelOpen = ref(false)
  const bandPanelTab = ref<BandPanelTab>('overview')
  const historyPanelOpen = ref(false)
  /** 本周是否已使用过「休息」（每进入新的一周重置） */
  const restUsedThisWeek = ref(false)

  const currentWeekLabel = computed(() => weekLabel(year.value, weekInYear.value))

  const bandUnlocked = computed(() => bandMemberIds.value.length >= 1)

  const activeRandomEvent = computed(() => randomEventQueue.value[0] ?? null)

  function pushLine(text: string) {
    narrativeLines.value = [...narrativeLines.value, text]
  }

  function appendNpcRandomMemories(
    ev: RandomEventDef,
    choice: RandomEventChoice | undefined,
    effects: RandomEventEffects | undefined,
  ) {
    if (!effects) return
    const touched = new Set<string>()
    for (const { characterId, delta } of effects.characterFavorDelta ?? []) {
      if (delta !== 0) touched.add(characterId)
    }
    for (const { characterId, delta } of effects.npcSpecialtySkillDelta ?? []) {
      if (delta !== 0) touched.add(characterId)
    }
    if (touched.size === 0) return
    const snippet = ev.text.length > 72 ? `${ev.text.slice(0, 72)}…` : ev.text
    const entryBase = {
      eventId: ev.id,
      weekLabel: currentWeekLabel.value,
      snippet,
      choiceLabel: choice?.label,
    }
    const next = { ...npcRandomEventMemories.value }
    for (const id of touched) {
      next[id] = [...(next[id] ?? []), { ...entryBase }]
    }
    npcRandomEventMemories.value = next
  }

  function buildRandomEventContext(): RandomEventContext {
    const y = year.value
    const w = weekInYear.value
    return {
      year: y,
      weekInYear: w,
      absoluteWeek: (y - 1) * WEEKS_PER_SCHOOL_YEAR + w,
      san: san.value,
      academics: academics.value,
      mainSkill: mainSkill.value,
      bandUnlocked: bandMemberIds.value.length >= 1,
      bandMemberCount: bandMemberIds.value.length,
      bond: bond.value,
      characters: characters.value,
    }
  }

  /**
   * 每周初：按 `weeklyRandomEventCount` 抽取多条事件入队；数值在玩家于弹窗中做选择后才结算（见 `resolveActiveRandomEvent`）。
   */
  function enqueueWeeklyRandomEvents() {
    const ctx = buildRandomEventContext()
    const n = weeklyRandomEventCount({
      year: ctx.year,
      weekInYear: ctx.weekInYear,
      absoluteWeek: ctx.absoluteWeek,
    })
    const picks = pickWeeklyRandomEvents(RANDOM_EVENT_DEFS, ctx, n)
    randomEventQueue.value = picks
    randomEventsThisWeekTotal.value = picks.length
    if (picks.length > 0) {
      pushLine(`本周有 ${picks.length} 件意料之外的事找上门，请依次应对。`)
    }
  }

  /** 应用当前队首事件；若有 `choices` 必须传入选中项 */
  function resolveActiveRandomEvent(choice?: RandomEventChoice) {
    const ev = randomEventQueue.value[0]
    if (!ev) return

    const branchCount = ev.choices?.length ?? 0
    const needsChoice = branchCount > 0
    if (needsChoice && !choice) return

    pushLine(`[随机事件 · ${ev.id}] ${ev.text}`)
    if (choice) pushLine(`你的选择：${choice.label}`)

    const effectsToApply = needsChoice ? choice!.effects : ev.effects
    const resolved = resolveRandomEventEffects(effectsToApply, {
      san: san.value,
      sanMax: sanMax.value,
      academics: academics.value,
      mainSkill: mainSkill.value,
      bond: bond.value,
      bandUnlocked: bandMemberIds.value.length >= 1,
      characters: characters.value,
      statMax: STAT_MAX,
    })

    applyMetFromEffects(effectsToApply, resolved.characters)
    appendNpcRandomMemories(ev, choice, effectsToApply)

    san.value = resolved.san
    academics.value = resolved.academics
    mainSkill.value = resolved.mainSkill
    bond.value = resolved.bond
    characters.value = resolved.characters
    if (resolved.summaryLine) pushLine(resolved.summaryLine)

    if (resolved.visibleSummaryLine) {
      randomEventVisibleOutcome.value = resolved.visibleSummaryLine
      randomEventDeferQueueAdvance.value = true
    } else {
      randomEventQueue.value = randomEventQueue.value.slice(1)
      randomEventDeferQueueAdvance.value = false
    }
  }

  /** 关闭「显性变化」提示后，若本事件尚未出队则出队 */
  function dismissRandomEventVisibleOutcome() {
    randomEventVisibleOutcome.value = null
    if (randomEventDeferQueueAdvance.value) {
      randomEventDeferQueueAdvance.value = false
      randomEventQueue.value = randomEventQueue.value.slice(1)
    }
  }

  function openHistory() {
    historyPanelOpen.value = true
  }

  function closeHistory() {
    historyPanelOpen.value = false
  }

  function openUnlockedRoster() {
    unlockedRosterOpen.value = true
  }

  function closeUnlockedRoster() {
    unlockedRosterOpen.value = false
  }

  function buildPersisted(): SchoolGamePersisted {
    return {
      v: SCHOOL_GAME_SAVE_VERSION,
      phase: phase.value,
      san: san.value,
      sanMax: sanMax.value,
      academics: academics.value,
      mainSkill: mainSkill.value,
      mainInstrument: mainInstrument.value,
      year: year.value,
      weekInYear: weekInYear.value,
      characters: characters.value,
      bond: bond.value,
      bandMemberIds: bandMemberIds.value,
      songs: songs.value.map((s) => ({ ...s })),
      bandActivityLog: bandActivityLog.value.map((e) => ({ ...e })),
      narrativeLines: [...narrativeLines.value],
      randomEventQueue: randomEventQueue.value,
      randomEventsThisWeekTotal: randomEventsThisWeekTotal.value,
      randomEventVisibleOutcome: randomEventVisibleOutcome.value,
      randomEventDeferQueueAdvance: randomEventDeferQueueAdvance.value,
      npcRandomEventMemories: { ...npcRandomEventMemories.value },
      restUsedThisWeek: restUsedThisWeek.value,
    }
  }

  function applyPersisted(p: SchoolGamePersisted) {
    phase.value = p.phase
    san.value = p.san
    sanMax.value = p.sanMax
    academics.value = p.academics
    mainSkill.value = p.mainSkill
    mainInstrument.value = p.mainInstrument
    year.value = p.year
    weekInYear.value = p.weekInYear
    characters.value = cloneNpcSnapshotList(p.characters)
    bond.value = p.bond
    bandMemberIds.value = [...p.bandMemberIds]
    songs.value = p.songs.map((s) => ({ ...s }))
    bandActivityLog.value = p.bandActivityLog.map((e) => ({ ...e }))
    narrativeLines.value = [...p.narrativeLines]
    randomEventQueue.value = p.randomEventQueue
    randomEventsThisWeekTotal.value = p.randomEventsThisWeekTotal
    randomEventVisibleOutcome.value = p.randomEventVisibleOutcome
    randomEventDeferQueueAdvance.value = p.randomEventDeferQueueAdvance
    npcRandomEventMemories.value = { ...p.npcRandomEventMemories }
    restUsedThisWeek.value = p.restUsedThisWeek
    unlockedRosterOpen.value = false
    bandPanelOpen.value = false
    bandPanelTab.value = 'overview'
    historyPanelOpen.value = false
  }

  let suppressPersist = false
  let persistTimer: ReturnType<typeof setTimeout> | null = null

  function schedulePersist() {
    if (suppressPersist || typeof window === 'undefined') return
    if (phase.value === 'intro') {
      if (persistTimer) {
        clearTimeout(persistTimer)
        persistTimer = null
      }
      clearSchoolGamePersisted()
      return
    }
    if (persistTimer) clearTimeout(persistTimer)
    persistTimer = setTimeout(() => {
      persistTimer = null
      saveSchoolGamePersisted(buildPersisted())
    }, 120)
  }

  function flushPersist() {
    if (suppressPersist || typeof window === 'undefined') return
    if (phase.value === 'intro') {
      if (persistTimer) {
        clearTimeout(persistTimer)
        persistTimer = null
      }
      clearSchoolGamePersisted()
      return
    }
    if (persistTimer) {
      clearTimeout(persistTimer)
      persistTimer = null
    }
    saveSchoolGamePersisted(buildPersisted())
  }

  const saved = loadSchoolGamePersisted()
  if (saved && saved.phase !== 'intro') {
    suppressPersist = true
    applyPersisted(saved)
    suppressPersist = false
  }

  if (typeof window !== 'undefined') {
    watch(
      [
        phase,
        san,
        sanMax,
        academics,
        mainSkill,
        mainInstrument,
        year,
        weekInYear,
        characters,
        bond,
        bandMemberIds,
        songs,
        bandActivityLog,
        narrativeLines,
        randomEventQueue,
        randomEventsThisWeekTotal,
        randomEventVisibleOutcome,
        randomEventDeferQueueAdvance,
        npcRandomEventMemories,
        restUsedThisWeek,
      ],
      schedulePersist,
      { deep: true },
    )
    window.addEventListener('beforeunload', flushPersist)
  }

  /** 清除存档并回到标题（主页面）；与「返回标题」相同效果 */
  function exitToMainMenu() {
    resetGame()
  }

  function beginPlaying() {
    phase.value = 'playing'
    year.value = 1
    weekInYear.value = 1
    restUsedThisWeek.value = false
    narrativeLines.value = []
    npcRandomEventMemories.value = {}
    pushLine('你走进市一中，高中生活开始了。本周你可以安排消耗 SAN 的活动；「休息」每周限一次。完成后点击「结束本周」进入下一周。')
    pushLine('（每周开始时 SAN 固定恢复，并触发若干随机事件需你做选择——记录可在「事件历史」查看。）')
    enqueueWeeklyRandomEvents()
  }

  function selectInstrument(inst: Instrument) {
    mainInstrument.value = inst
    beginPlaying()
  }

  function fromIntro() {
    phase.value = 'skill_select'
  }

  function resetGame() {
    suppressPersist = true
    if (persistTimer) {
      clearTimeout(persistTimer)
      persistTimer = null
    }
    clearSchoolGamePersisted()
    phase.value = 'intro'
    san.value = INITIAL_SAN
    academics.value = INITIAL_ACADEMICS
    mainSkill.value = INITIAL_MAIN_SKILL
    mainInstrument.value = null
    year.value = 1
    weekInYear.value = 1
    characters.value = cloneNpcSnapshotList(INITIAL_NPCS)
    bond.value = 0
    bandMemberIds.value = []
    songs.value = []
    bandActivityLog.value = []
    narrativeLines.value = []
    randomEventQueue.value = []
    randomEventsThisWeekTotal.value = 0
    randomEventVisibleOutcome.value = null
    randomEventDeferQueueAdvance.value = false
    npcRandomEventMemories.value = {}
    unlockedRosterOpen.value = false
    bandPanelOpen.value = false
    bandPanelTab.value = 'overview'
    historyPanelOpen.value = false
    restUsedThisWeek.value = false
    suppressPersist = false
  }

  function addBandLog(text: string) {
    bandActivityLog.value = [
      ...bandActivityLog.value,
      { weekLabel: currentWeekLabel.value, text },
    ]
  }

  function study() {
    if (phase.value !== 'playing') return
    const { sanCost, academics: gain } = ACTIVITY.study
    if (san.value < sanCost) {
      pushLine('SAN 不足，没法集中精力学习。')
      return
    }
    san.value -= sanCost
    academics.value = clamp(academics.value + gain, 0, STAT_MAX)
    pushLine(`你花了些时间啃课本与作业。学业 +${gain}，消耗 SAN ${sanCost}。`)
  }

  function practice() {
    if (phase.value !== 'playing') return
    const { sanCost, skill } = ACTIVITY.practice
    if (san.value < sanCost) {
      pushLine('太累了，练习效果不好，先休息吧。')
      return
    }
    san.value -= sanCost
    mainSkill.value = clamp(mainSkill.value + skill, 0, STAT_MAX)
    pushLine(`你泡在练习里，主修技能 +${skill}，消耗 SAN ${sanCost}。`)
  }

  function rest() {
    if (phase.value !== 'playing') return
    if (restUsedThisWeek.value) {
      pushLine('本周已经休息过了，别太贪睡。')
      return
    }
    const g = ACTIVITY.rest.sanGain
    const before = san.value
    san.value = clamp(san.value + g, 0, sanMax.value)
    restUsedThisWeek.value = true
    pushLine(`你放慢节奏休息，SAN 恢复 ${san.value - before}。`)
  }

  function chatWith(characterId: string) {
    if (phase.value !== 'playing') return
    const { sanCost, favor } = ACTIVITY.chat
    if (san.value < sanCost) {
      pushLine('有点累，改天再聊吧。')
      return
    }
    const ch = characters.value.find((c) => c.id === characterId)
    if (!ch || !ch.met) return
    san.value -= sanCost
    ch.favorWithPlayer = clamp(ch.favorWithPlayer + favor, 0, STAT_MAX)
    pushLine(`你和 ${ch.name} 聊了一会儿，好感 +${favor}，消耗 SAN ${sanCost}。`)
  }

  function invite(characterId: string) {
    if (phase.value !== 'playing') return
    if (bandMemberIds.value.includes(characterId)) {
      pushLine('对方已经在乐队里了。')
      return
    }
    const ch = characters.value.find((c) => c.id === characterId)
    if (!ch || !ch.met) return
    if (ch.favorWithPlayer < INVITE_FAVOR_THRESHOLD) {
      pushLine(`${ch.name} 和你还不够熟，再培养一下好感吧。（需 ≥${INVITE_FAVOR_THRESHOLD}）`)
      return
    }
    const { sanCost } = ACTIVITY.invite
    if (san.value < sanCost) {
      pushLine('SAN 不足，没有余力正式发出邀请。')
      return
    }
    san.value -= sanCost
    bandMemberIds.value = [...bandMemberIds.value, characterId]
    addBandLog(`${ch.name} 接受了邀请，乐队阵容 +1。`)
    pushLine(`你向 ${ch.name} 发出邀请，对方点头答应。乐队活动已在界面中解锁。`)
  }

  function bandPractice() {
    if (phase.value !== 'playing' || !bandUnlocked.value) return
    const { sanCost, bond: b, songProf } = ACTIVITY.bandPractice
    if (san.value < sanCost) {
      pushLine('大家状态都一般，改天再排吧。')
      return
    }
    san.value -= sanCost
    bond.value = clamp(bond.value + b, 0, STAT_MAX)
    if (songs.value.length === 0) {
      songs.value = [{ id: 's1', title: '未命名原创曲', proficiency: songProf }]
      addBandLog(`第一次合排，确定了暂定曲《未命名原创曲》，熟练度 ${songProf}。`)
      pushLine(`乐队第一次合排，羁绊 +${b}，新曲目熟练度起步 ${songProf}。`)
    } else {
      const s = songs.value[0]!
      s.proficiency = clamp(s.proficiency + songProf, 0, STAT_MAX)
      addBandLog(`排练《${s.title}》，熟练度提升至 ${s.proficiency}。`)
      pushLine(`排练了《${s.title}》，羁绊 +${b}，熟练度 +${songProf}。`)
    }
  }

  function bandHangout() {
    if (phase.value !== 'playing' || !bandUnlocked.value) return
    const { sanCost, bond: b } = ACTIVITY.bandHangout
    if (san.value < sanCost) {
      pushLine('这周大家都忙，团建先缓一缓。')
      return
    }
    san.value -= sanCost
    bond.value = clamp(bond.value + b, 0, STAT_MAX)
    addBandLog('团建：聚餐吐槽作业与演出梦，气氛不错。')
    pushLine(`乐队小团建，羁绊 +${b}。`)
  }

  function endWeek() {
    if (phase.value !== 'playing') return

    if (year.value === SCHOOL_YEARS && weekInYear.value === WEEKS_PER_SCHOOL_YEAR) {
      phase.value = 'graduated'
      pushLine('高三最后一周落下帷幕。毕业快乐。')
      return
    }

    weekInYear.value += 1
    if (weekInYear.value > WEEKS_PER_SCHOOL_YEAR) {
      weekInYear.value = 1
      year.value += 1
    }

    if (year.value > SCHOOL_YEARS) {
      phase.value = 'graduated'
      pushLine('高中三年结束。')
      return
    }

    restUsedThisWeek.value = false
    san.value = clamp(san.value + WEEKLY_SAN_RECOVERY, 0, sanMax.value)
    pushLine(`—— ${weekLabel(year.value, weekInYear.value)} ——`)
    pushLine(`周初恢复 SAN +${WEEKLY_SAN_RECOVERY}（不超过上限 ${sanMax.value}）。`)
    enqueueWeeklyRandomEvents()
  }

  function openBand(tab: BandPanelTab = 'overview') {
    bandPanelTab.value = tab
    bandPanelOpen.value = true
  }

  function closeBand() {
    bandPanelOpen.value = false
  }

  return {
    phase,
    san,
    sanMax,
    academics,
    mainSkill,
    mainInstrument,
    year,
    weekInYear,
    characters,
    bond,
    bandMemberIds,
    songs,
    bandActivityLog,
    narrativeLines,
    randomEventQueue,
    randomEventsThisWeekTotal,
    randomEventVisibleOutcome,
    activeRandomEvent,
    npcRandomEventMemories,
    unlockedRosterOpen,
    bandPanelOpen,
    bandPanelTab,
    historyPanelOpen,
    restUsedThisWeek,
    currentWeekLabel,
    bandUnlocked,
    fromIntro,
    selectInstrument,
    resetGame,
    exitToMainMenu,
    study,
    practice,
    rest,
    chatWith,
    invite,
    bandPractice,
    bandHangout,
    endWeek,
    resolveActiveRandomEvent,
    dismissRandomEventVisibleOutcome,
    enqueueWeeklyRandomEvents,
    openBand,
    closeBand,
    openHistory,
    closeHistory,
    openUnlockedRoster,
    closeUnlockedRoster,
  }
})
