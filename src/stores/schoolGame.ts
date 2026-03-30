import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { BandActivityRecord, BandPanelTab, GamePhase, Instrument, SongEntry } from '@/game/types'
import {
  ACTIVITY,
  INITIAL_ACADEMICS,
  INITIAL_MAIN_SKILL,
  INITIAL_NPCS,
  INITIAL_SAN,
  EVENT_COOLDOWN_WEEKS,
  GRADUATION_MONTH,
  INVITE_FAVOR_THRESHOLD,
  MEET_EVENT_TRIGGER_CHANCE,
  monthFromWeekInYear,
  SAN_MAX,
  SCHOOL_YEARS,
  STAT_MAX,
  bandHangoutEventCount,
  bandRehearsalEventCount,
  SPECIAL_EVENT_MAX_COUNT,
  SPECIAL_EVENT_TRIGGER_CHANCE,
  WEEKLY_SAN_RECOVERY,
  weekInMonthFromWeekInYear,
  WEEKS_PER_SCHOOL_YEAR,
  weeklyRandomEventCount,
} from '@/game/config'
import type { NpcSnapshot } from '@/game/npc'
import {
  addMutualIntimacy,
  cloneNpcSnapshotList,
  evaluateInviteRuleFailures,
  getInviteFailureSpeech,
  INVITE_RULES,
  INVITE_FAVOR_THRESHOLDS,
  INVITE_FAILURE_SPEECH,
  getInviteFavorThreshold,
} from '@/game/npc'
import { weekLabel } from '@/game/labels'
import {
  RANDOM_EVENT_DEFS,
  FOLLOWUP_EVENT_BY_ID,
  applyMetFromEffects,
  pickWeeklyRandomEvents,
  resolveRandomEventEffects,
  type RandomEventChoice,
  type RandomEventContext,
  type RandomEventDef,
  type RandomEventEffects,
  type RandomEventProbabilisticFollowup,
  type RandomEventStatCondition,
  type RandomEventStatProbabilityRule,
  type RandomEventStatSnapshot,
  BAND_REHEARSAL_EVENT_DEFS,
  BAND_HANGOUT_EVENT_DEFS,
  CHARACTER_MEET_EVENT_DEFS,
  PRACTICE_SPECIAL_EVENT_DEFS,
  REST_SPECIAL_EVENT_DEFS,
  STUDY_SPECIAL_EVENT_DEFS,
} from '@/game/events'
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

const EVENT_DEFAULT_COAPPEAR_INTIMACY_DELTA = 1
const BAND_PRACTICE_BASE_INTIMACY_DELTA = 1

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
  /** 当前随机事件队列对应的弹窗标题（用于周事件/排练事件/特殊事件区分） */
  const randomEventModalTitle = ref('本周随机事件')
  /** 有待关闭显性提示后再出队下一条事件 */
  const randomEventDeferQueueAdvance = ref(false)
  /** 每名已互动角色在随机事件中的履历（仅记入与主角直接相关的结算） */
  const npcRandomEventMemories = ref<Record<string, NpcRandomEventMemory[]>>({})
  /** 事件最近触发绝对周（用于冷却，减少重复） */
  const eventLastTriggeredWeek = ref<Record<string, number>>({})
  const unlockedRosterOpen = ref(false)
  const bandPanelOpen = ref(false)
  const bandPanelTab = ref<BandPanelTab>('overview')
  const historyPanelOpen = ref(false)
  const inviteFeedbackVisible = ref(false)
  const inviteFeedbackTitle = ref('')
  const inviteFeedbackSpeech = ref('')
  const inviteFeedbackReasons = ref<string[]>([])
  /** 本周是否已使用过「休息」（每进入新的一周重置） */
  const restUsedThisWeek = ref(false)
  /** 本周是否已经触发过“相识事件”（用于控制新角色出现速度） */
  const meetEventTriggeredThisWeek = ref(false)

  const currentWeekLabel = computed(() => weekLabel(year.value, weekInYear.value))

  const bandUnlocked = computed(() => bandMemberIds.value.length >= 1)

  const activeRandomEvent = computed(() => randomEventQueue.value[0] ?? null)

  function pushLine(text: string) {
    narrativeLines.value = [...narrativeLines.value, text]
  }

  function closeInviteFeedback() {
    inviteFeedbackVisible.value = false
    inviteFeedbackTitle.value = ''
    inviteFeedbackSpeech.value = ''
    inviteFeedbackReasons.value = []
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

  function currentAbsoluteWeek(): number {
    return (year.value - 1) * WEEKS_PER_SCHOOL_YEAR + weekInYear.value
  }

  function currentStatSnapshot(): RandomEventStatSnapshot {
    return {
      san: san.value,
      academics: academics.value,
      mainSkill: mainSkill.value,
    }
  }

  function matchesStatCondition(s: RandomEventStatSnapshot, c: RandomEventStatCondition): boolean {
    if (c.minSan != null && s.san < c.minSan) return false
    if (c.maxSan != null && s.san > c.maxSan) return false
    if (c.minAcademics != null && s.academics < c.minAcademics) return false
    if (c.maxAcademics != null && s.academics > c.maxAcademics) return false
    if (c.minMainSkill != null && s.mainSkill < c.minMainSkill) return false
    if (c.maxMainSkill != null && s.mainSkill > c.maxMainSkill) return false
    return true
  }

  function resolveChanceByStats(
    fallbackChance: number,
    rules: RandomEventStatProbabilityRule[] | undefined,
    s: RandomEventStatSnapshot,
  ): number {
    if (!rules || rules.length === 0) return clamp(fallbackChance, 0, 1)
    const hit = rules.find((r) => matchesStatCondition(s, r.condition))
    return clamp(hit?.chance ?? fallbackChance, 0, 1)
  }

  function autoSpawnChanceByEventId(id: string, s: RandomEventStatSnapshot): number {
    const sanRatio = sanMax.value > 0 ? s.san / sanMax.value : 1
    const acadRatio = STAT_MAX > 0 ? s.academics / STAT_MAX : 1
    const skillRatio = STAT_MAX > 0 ? s.mainSkill / STAT_MAX : 1
    if (id.startsWith('study_')) return clamp(0.35 + 0.55 * (1 - acadRatio) + 0.15 * (1 - sanRatio), 0.08, 0.96)
    if (id.startsWith('practice_')) return clamp(0.35 + 0.55 * (1 - skillRatio) + 0.15 * (1 - sanRatio), 0.08, 0.96)
    if (id.startsWith('rest_')) return clamp(0.3 + 0.65 * (1 - sanRatio), 0.08, 0.98)
    if (id.startsWith('band_') || id.startsWith('hangout_')) {
      return clamp(0.45 + 0.35 * (1 - sanRatio) + 0.2 * (1 - skillRatio), 0.12, 0.95)
    }
    if (id.startsWith('meet_')) return clamp(0.25 + 0.25 * (1 - sanRatio), 0.1, 0.6)
    if (id.startsWith('forced_')) return 1
    return clamp(0.7 + 0.2 * (1 - sanRatio), 0.2, 0.95)
  }

  function passesEventSpawnChance(d: RandomEventDef, s: RandomEventStatSnapshot): boolean {
    const base = d.spawnChance ?? autoSpawnChanceByEventId(d.id, s)
    let chance = resolveChanceByStats(base, d.spawnChanceByStats, s)
    if (d.bondUnlock) {
      const minBond = d.bondUnlock.minBond
      const maxChance = clamp(d.bondUnlock.maxChance ?? 1, 0, 1)
      if (bond.value < minBond) return false
      const t = STAT_MAX > minBond ? (bond.value - minBond) / (STAT_MAX - minBond) : 1
      const unlockedChance = clamp(maxChance * clamp(t, 0, 1), 0, 1)
      chance = Math.min(chance, unlockedChance)
    }
    return Math.random() < chance
  }

  function applyEventCooldown(defs: RandomEventDef[], absoluteWeek: number): RandomEventDef[] {
    return defs.filter((d) => {
      const cooldown = d.cooldownWeeks ?? EVENT_COOLDOWN_WEEKS
      if (cooldown <= 0) return true
      const last = eventLastTriggeredWeek.value[d.id]
      if (last == null) return true
      return absoluteWeek - last >= cooldown
    })
  }

  function collectEventNpcIds(ev: RandomEventDef): string[] {
    const ids = new Set<string>()
    const take = (eff?: RandomEventEffects) => {
      eff?.characterFavorDelta?.forEach(({ characterId }) => ids.add(characterId))
      eff?.npcSpecialtySkillDelta?.forEach(({ characterId }) => ids.add(characterId))
      eff?.npcPairIntimacyDelta?.forEach(({ npcIdA, npcIdB }) => {
        ids.add(npcIdA)
        ids.add(npcIdB)
      })
    }
    take(ev.effects)
    ev.choices?.forEach((c) => take(c.effects))
    ev.condition?.characterFavorMin?.forEach(({ characterId }) => ids.add(characterId))
    ev.meetNpcIds?.forEach((id) => ids.add(id))
    ev.involvedNpcIds?.forEach((id) => ids.add(id))
    return [...ids]
  }

  function applyCoappearIntimacyGain(
    ev: RandomEventDef,
    choice: RandomEventChoice | undefined,
    appliedEffects: RandomEventEffects | undefined,
    roster: NpcSnapshot[],
  ) {
    const delta = ev.coappearIntimacyDelta ?? EVENT_DEFAULT_COAPPEAR_INTIMACY_DELTA
    if (delta <= 0) return
    const ids = new Set<string>()
    ev.involvedNpcIds?.forEach((id) => ids.add(id))
    choice?.involvedNpcIds?.forEach((id) => ids.add(id))
    const take = (eff?: RandomEventEffects) => {
      eff?.characterFavorDelta?.forEach(({ characterId }) => ids.add(characterId))
      eff?.npcSpecialtySkillDelta?.forEach(({ characterId }) => ids.add(characterId))
      eff?.npcPairIntimacyDelta?.forEach(({ npcIdA, npcIdB }) => {
        ids.add(npcIdA)
        ids.add(npcIdB)
      })
    }
    take(appliedEffects)
    const list = [...ids].filter((id) => roster.some((n) => n.id === id))
    if (list.length < 2) return
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        addMutualIntimacy(roster, list[i]!, list[j]!, delta, STAT_MAX)
      }
    }
  }

  function averageBandMemberIntimacy(ids: string[], roster: NpcSnapshot[]): number {
    if (ids.length < 2) return 0
    let sum = 0
    let cnt = 0
    for (let i = 0; i < ids.length; i += 1) {
      const a = roster.find((n) => n.id === ids[i])
      if (!a) continue
      for (let j = i + 1; j < ids.length; j += 1) {
        sum += a.intimacyWithOthers[ids[j]!] ?? 0
        cnt += 1
      }
    }
    return cnt > 0 ? sum / cnt : 0
  }

  function increaseBandMemberIntimacy(ids: string[], delta: number) {
    if (ids.length < 2 || delta <= 0) return
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        addMutualIntimacy(characters.value, ids[i]!, ids[j]!, delta, STAT_MAX)
      }
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
    const cooled = applyEventCooldown(RANDOM_EVENT_DEFS, ctx.absoluteWeek)
    const spawnable = cooled.filter((d) => passesEventSpawnChance(d, currentStatSnapshot()))
    const picks = pickWeeklyRandomEvents(
      spawnable.length > 0 ? spawnable : cooled.length > 0 ? cooled : RANDOM_EVENT_DEFS,
      ctx,
      n,
    )
    randomEventQueue.value = picks
    randomEventsThisWeekTotal.value = picks.length
    randomEventModalTitle.value = '本周随机事件'
    if (picks.length > 0) {
      pushLine(`本周有 ${picks.length} 件意料之外的事找上门，请依次应对。`)
    }
  }

  function enqueueEventQueue(
    defs: RandomEventDef[],
    count: number,
    title: string,
    introLine: string,
    opts?: {
      /** 团队事件：仅允许出现已入队角色相关的事件 */
      onlyBandMembers?: boolean
      /** 相识事件：仅允许选取 still-unmet 的角色 */
      onlyUnmetMeetEvents?: boolean
    },
  ) {
    // 保证同一时间只有一个事件队列（周事件 or 特殊事件 or 排练事件）
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return

    const ctx = buildRandomEventContext()

    // 根据主角初始主修乐器筛选：只允许「公共事件」+「匹配 mainInstrumentGate 的事件」
    const mi = mainInstrument.value
    const picksFromDefs =
      mi == null
        ? defs.filter((d) => !d.mainInstrumentGate)
        : defs.filter((d) => !d.mainInstrumentGate || d.mainInstrumentGate.includes(mi))

    const byInstrument = picksFromDefs.length > 0 ? picksFromDefs : defs.filter((d) => !d.mainInstrumentGate)
    const byBand =
      opts?.onlyBandMembers
        ? byInstrument.filter((d) => {
            const ids = collectEventNpcIds(d)
            if (ids.length === 0) return true
            return ids.every((id) => bandMemberIds.value.includes(id))
          })
        : byInstrument
    const byMeet =
      opts?.onlyUnmetMeetEvents
        ? byBand.filter((d) => {
            const meetIds = d.meetNpcIds ?? []
            if (meetIds.length === 0) return false
            return meetIds.some((id) => {
              const ch = characters.value.find((c) => c.id === id)
              return ch != null && !ch.met
            })
          })
        : byBand

    const safeDefs = byMeet.length > 0 ? byMeet : defs.filter((d) => !d.mainInstrumentGate)
    const cooled = applyEventCooldown(safeDefs.length > 0 ? safeDefs : defs, ctx.absoluteWeek)
    const spawnable = cooled.filter((d) => passesEventSpawnChance(d, currentStatSnapshot()))
    const picks = pickWeeklyRandomEvents(
      spawnable.length > 0 ? spawnable : cooled.length > 0 ? cooled : safeDefs.length > 0 ? safeDefs : defs,
      ctx,
      count,
    )
    randomEventQueue.value = picks
    randomEventsThisWeekTotal.value = picks.length
    randomEventModalTitle.value = title
    if (picks.length > 0) pushLine(introLine)
  }

  function enqueueBandRehearsalEvents() {
    const ctx = buildRandomEventContext()
    const count = bandRehearsalEventCount({
      year: ctx.year,
      weekInYear: ctx.weekInYear,
      absoluteWeek: ctx.absoluteWeek,
    })
    enqueueEventQueue(
      BAND_REHEARSAL_EVENT_DEFS,
      count,
      '乐队排练事件',
      `排练过程中触发了 ${count} 件事件，请依次应对。`,
      { onlyBandMembers: true },
    )
  }

  function enqueueBandHangoutEvents() {
    const ctx = buildRandomEventContext()
    const count = bandHangoutEventCount({
      year: ctx.year,
      weekInYear: ctx.weekInYear,
      absoluteWeek: ctx.absoluteWeek,
    })
    enqueueEventQueue(
      BAND_HANGOUT_EVENT_DEFS,
      count,
      '乐队团建事件',
      `团建过程中触发了 ${count} 件事件，请依次应对。`,
      { onlyBandMembers: true },
    )
  }

  function maybeTriggerSpecialEvent(
    defs: RandomEventDef[],
    chance: number,
    title: string,
    introLine: string,
  ) {
    const s = currentStatSnapshot()
    const sanRatio = sanMax.value > 0 ? s.san / sanMax.value : 1
    const acadRatio = STAT_MAX > 0 ? s.academics / STAT_MAX : 1
    const skillRatio = STAT_MAX > 0 ? s.mainSkill / STAT_MAX : 1
    let adjusted = chance
    if (title.includes('学习')) adjusted += 0.18 * (1 - acadRatio) + 0.08 * (1 - sanRatio)
    if (title.includes('练习')) adjusted += 0.18 * (1 - skillRatio) + 0.08 * (1 - sanRatio)
    if (title.includes('休息')) adjusted += 0.22 * (1 - sanRatio)
    adjusted = clamp(adjusted, 0.05, 0.9)
    if (Math.random() >= adjusted) return
    enqueueEventQueue(defs, SPECIAL_EVENT_MAX_COUNT, title, introLine)
  }

  function maybeTriggerMeetEvent() {
    if (meetEventTriggeredThisWeek.value) return
    if (Math.random() >= MEET_EVENT_TRIGGER_CHANCE) return
    enqueueEventQueue(
      CHARACTER_MEET_EVENT_DEFS,
      1,
      '相识事件',
      '你在日常中与某位角色有了第一次正式交集。',
      { onlyUnmetMeetEvents: true },
    )
    if (randomEventQueue.value.length > 0) {
      meetEventTriggeredThisWeek.value = true
    }
  }

  function queueForcedFollowups(ids: string[] | undefined) {
    if (!ids || ids.length === 0) return
    const defs = ids
      .map((id) => FOLLOWUP_EVENT_BY_ID[id])
      .filter((d): d is RandomEventDef => d != null)
    if (defs.length === 0) return
    const rest = randomEventQueue.value.slice(1)
    randomEventQueue.value = [randomEventQueue.value[0]!, ...defs, ...rest]
  }

  function rollProbabilisticFollowups(
    rules: RandomEventProbabilisticFollowup[] | undefined,
  ): string[] {
    if (!rules || rules.length === 0) return []
    const out: string[] = []
    const s = currentStatSnapshot()
    for (const r of rules) {
      const chance = resolveChanceByStats(r.chance, r.chanceByStats, s)
      if (Math.random() < chance) {
        out.push(...r.eventIds)
      }
    }
    return out
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
    const fixedFollowupIds = needsChoice ? choice!.followupEventIds : ev.followupEventIds
    const randomFollowupIds = rollProbabilisticFollowups(
      needsChoice ? choice!.probabilisticFollowups : ev.probabilisticFollowups,
    )
    const followupIds = [...new Set([...(fixedFollowupIds ?? []), ...randomFollowupIds])]
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
    applyCoappearIntimacyGain(ev, choice, effectsToApply, resolved.characters)

    applyMetFromEffects(effectsToApply, resolved.characters)
    appendNpcRandomMemories(ev, choice, effectsToApply)
    queueForcedFollowups(followupIds)
    eventLastTriggeredWeek.value = {
      ...eventLastTriggeredWeek.value,
      [ev.id]: currentAbsoluteWeek(),
    }

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
      randomEventModalTitle: randomEventModalTitle.value,
      npcRandomEventMemories: { ...npcRandomEventMemories.value },
      eventLastTriggeredWeek: { ...eventLastTriggeredWeek.value },
      restUsedThisWeek: restUsedThisWeek.value,
      meetEventTriggeredThisWeek: meetEventTriggeredThisWeek.value,
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
    randomEventModalTitle.value = p.randomEventModalTitle ?? '本周随机事件'
    npcRandomEventMemories.value = { ...p.npcRandomEventMemories }
    eventLastTriggeredWeek.value = { ...(p.eventLastTriggeredWeek ?? {}) }
    restUsedThisWeek.value = p.restUsedThisWeek
    meetEventTriggeredThisWeek.value = p.meetEventTriggeredThisWeek ?? false
    unlockedRosterOpen.value = false
    bandPanelOpen.value = false
    bandPanelTab.value = 'overview'
    historyPanelOpen.value = false
    closeInviteFeedback()
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
        randomEventModalTitle,
        npcRandomEventMemories,
        eventLastTriggeredWeek,
        restUsedThisWeek,
        meetEventTriggeredThisWeek,
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
    eventLastTriggeredWeek.value = {}
    meetEventTriggeredThisWeek.value = false
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
    randomEventModalTitle.value = '本周随机事件'
    npcRandomEventMemories.value = {}
    eventLastTriggeredWeek.value = {}
    unlockedRosterOpen.value = false
    bandPanelOpen.value = false
    bandPanelTab.value = 'overview'
    historyPanelOpen.value = false
    closeInviteFeedback()
    restUsedThisWeek.value = false
    meetEventTriggeredThisWeek.value = false
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
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    const { sanCost, academics: gain } = ACTIVITY.study
    if (san.value < sanCost) {
      pushLine('SAN 不足，没法集中精力学习。')
      return
    }
    san.value -= sanCost
    academics.value = clamp(academics.value + gain, 0, STAT_MAX)
    pushLine(`你花了些时间啃课本与作业。学业 +${gain}，消耗 SAN ${sanCost}。`)
    maybeTriggerMeetEvent()
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    maybeTriggerSpecialEvent(
      STUDY_SPECIAL_EVENT_DEFS,
      SPECIAL_EVENT_TRIGGER_CHANCE.study,
      '学习中的特别事件',
      `学习过程中触发了 ${SPECIAL_EVENT_MAX_COUNT} 件特别事件，请依次应对。`,
    )
  }

  function practice() {
    if (phase.value !== 'playing') return
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    const { sanCost, skill } = ACTIVITY.practice
    if (san.value < sanCost) {
      pushLine('太累了，练习效果不好，先休息吧。')
      return
    }
    san.value -= sanCost
    mainSkill.value = clamp(mainSkill.value + skill, 0, STAT_MAX)
    pushLine(`你泡在练习里，主修技能 +${skill}，消耗 SAN ${sanCost}。`)
    maybeTriggerMeetEvent()
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    maybeTriggerSpecialEvent(
      PRACTICE_SPECIAL_EVENT_DEFS,
      SPECIAL_EVENT_TRIGGER_CHANCE.practice,
      '练习中的特别事件',
      `练习过程中触发了 ${SPECIAL_EVENT_MAX_COUNT} 件特别事件，请依次应对。`,
    )
  }

  function rest() {
    if (phase.value !== 'playing') return
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    if (restUsedThisWeek.value) {
      pushLine('本周已经休息过了，别太贪睡。')
      return
    }
    const g = ACTIVITY.rest.sanGain
    const before = san.value
    san.value = clamp(san.value + g, 0, sanMax.value)
    restUsedThisWeek.value = true
    pushLine(`你放慢节奏休息，SAN 恢复 ${san.value - before}。`)
    maybeTriggerMeetEvent()
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    maybeTriggerSpecialEvent(
      REST_SPECIAL_EVENT_DEFS,
      SPECIAL_EVENT_TRIGGER_CHANCE.rest,
      '休息时的特别事件',
      `休息过程中触发了 ${SPECIAL_EVENT_MAX_COUNT} 件特别事件，请依次应对。`,
    )
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
    const { sanCost } = ACTIVITY.invite
    if (san.value < sanCost) {
      pushLine('SAN 不足，没有余力正式发出邀请。')
      return
    }
    const failReasons: string[] = []
    const favorThreshold = getInviteFavorThreshold(
      characterId,
      INVITE_FAVOR_THRESHOLDS,
      { bandMemberIds: bandMemberIds.value },
      INVITE_FAVOR_THRESHOLD,
    )
    if (ch.favorWithPlayer < favorThreshold) {
      failReasons.push(`${ch.name} 和你还不够熟（好感需 ≥${favorThreshold}）。`)
    }
    const ruleFailReasons = evaluateInviteRuleFailures(characterId, INVITE_RULES, {
      bandMemberIds: bandMemberIds.value,
      mainSkill: mainSkill.value,
    })
    failReasons.push(...ruleFailReasons)

    if (failReasons.length > 0) {
      pushLine(`你向 ${ch.name} 发出邀请，但对方婉拒了。`)
      failReasons.forEach((r) => pushLine(`- ${r}`))
      const speech =
        getInviteFailureSpeech(characterId, INVITE_FAILURE_SPEECH, {
          favorFailed: ch.favorWithPlayer < favorThreshold,
          favorGap: Math.max(0, favorThreshold - ch.favorWithPlayer),
          ruleFailed: ruleFailReasons.length > 0,
          ruleFailReasons,
        }) ?? `${ch.name} 轻轻摇头，表示现在还不适合加入。`
      inviteFeedbackTitle.value = `${ch.name} 的回应`
      inviteFeedbackSpeech.value = speech
      inviteFeedbackReasons.value = [...failReasons]
      inviteFeedbackVisible.value = true
      return
    }

    // 只有在邀请成功时才扣除 SAN（失败不消耗）。
    san.value -= sanCost
    bandMemberIds.value = [...bandMemberIds.value, characterId]
    addBandLog(`${ch.name} 接受了邀请，乐队阵容 +1。`)
    pushLine(`你向 ${ch.name} 发出邀请，对方点头答应。乐队活动已在界面中解锁。`)
  }

  function bandPractice() {
    if (phase.value !== 'playing' || !bandUnlocked.value) return
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    const { sanCost, bond: b, songProf } = ACTIVITY.bandPractice
    if (san.value < sanCost) {
      pushLine('大家状态都一般，改天再排吧。')
      return
    }
    san.value -= sanCost
    increaseBandMemberIntimacy(bandMemberIds.value, BAND_PRACTICE_BASE_INTIMACY_DELTA)
    const avgIntimacy = averageBandMemberIntimacy(bandMemberIds.value, characters.value)
    const bondBonus = Math.floor(avgIntimacy / 30)
    const gainedBond = b + bondBonus
    bond.value = clamp(bond.value + gainedBond, 0, STAT_MAX)
    if (songs.value.length === 0) {
      songs.value = [{ id: 's1', title: '未命名原创曲', proficiency: songProf }]
      addBandLog(`第一次合排，确定了暂定曲《未命名原创曲》，熟练度 ${songProf}。`)
      pushLine(`乐队第一次合排，羁绊 +${gainedBond}（默契加成 +${bondBonus}），新曲目熟练度起步 ${songProf}。`)
    } else {
      const s = songs.value[0]!
      s.proficiency = clamp(s.proficiency + songProf, 0, STAT_MAX)
      addBandLog(`排练《${s.title}》，熟练度提升至 ${s.proficiency}。`)
      pushLine(`排练了《${s.title}》，羁绊 +${gainedBond}（默契加成 +${bondBonus}），熟练度 +${songProf}。`)
    }

    // 排练时固定触发：从「乐队排练事件池」抽取若干条进入同一个事件弹窗流程。
    enqueueBandRehearsalEvents()
  }

  function bandHangout() {
    if (phase.value !== 'playing' || !bandUnlocked.value) return
    if (randomEventQueue.value.length > 0 || randomEventVisibleOutcome.value) return
    const { sanCost, bond: b } = ACTIVITY.bandHangout
    if (san.value < sanCost) {
      pushLine('这周大家都忙，团建先缓一缓。')
      return
    }
    san.value -= sanCost
    bond.value = clamp(bond.value + b, 0, STAT_MAX)
    addBandLog('团建：聚餐吐槽作业与演出梦，气氛不错。')
    pushLine(`乐队小团建，羁绊 +${b}。`)
    enqueueBandHangoutEvents()
  }

  function endWeek() {
    if (phase.value !== 'playing') return

    const currentMonth = monthFromWeekInYear(weekInYear.value)
    const currentWeekInMonth = weekInMonthFromWeekInYear(weekInYear.value)
    if (
      year.value === SCHOOL_YEARS &&
      currentMonth === GRADUATION_MONTH &&
      currentWeekInMonth === 4
    ) {
      phase.value = 'graduated'
      pushLine('高三 6 月的最后一周落下帷幕。毕业快乐。')
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
    meetEventTriggeredThisWeek.value = false
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
    randomEventModalTitle,
    activeRandomEvent,
    npcRandomEventMemories,
    unlockedRosterOpen,
    bandPanelOpen,
    bandPanelTab,
    historyPanelOpen,
    inviteFeedbackVisible,
    inviteFeedbackTitle,
    inviteFeedbackSpeech,
    inviteFeedbackReasons,
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
    closeInviteFeedback,
    openUnlockedRoster,
    closeUnlockedRoster,
  }
})
