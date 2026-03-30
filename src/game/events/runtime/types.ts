/**
 * 随机事件 —— 类型定义
 *
 * 事件条目只改 `events.config.ts`。
 */

import type { NpcSnapshot } from '@/game/npc'
import type { Instrument } from '@/game/types'

/** 提供给条件判断的快照（由 store 在抽取时填充） */
export type RandomEventContext = {
  year: number
  weekInYear: number
  absoluteWeek: number
  san: number
  academics: number
  mainSkill: number
  bandUnlocked: boolean
  bandMemberCount: number
  bond: number
  characters: NpcSnapshot[]
}

/** 条件：字段省略则不校验该项；多字段为 AND */
export type RandomEventCondition = {
  minYear?: number
  maxYear?: number
  minWeekInYear?: number
  maxWeekInYear?: number
  minAbsoluteWeek?: number
  maxAbsoluteWeek?: number
  minSan?: number
  maxSan?: number
  minAcademics?: number
  maxAcademics?: number
  minMainSkill?: number
  maxMainSkill?: number
  bandUnlocked?: boolean
  minBandMemberCount?: number
  minBond?: number
  maxBond?: number
  characterFavorMin?: { characterId: string; min: number }[]
}

/**
 * 数值影响（增量）。可选字段可任意组合。
 *
 * 显性 / 隐性（决定「选择后」是否弹数值提示）：
 * - 显性：SAN、学业、主修、羁绊、与主角的 NPC 好感 —— 会出现在结果弹窗。
 * - 隐性：NPC↔NPC 亲密度、NPC 专精技能 —— 仍结算并写入事件历史全文，但不弹显性窗。
 */
export type RandomEventEffects = {
  sanDelta?: number
  academicsDelta?: number
  mainSkillDelta?: number
  bondDelta?: number
  characterFavorDelta?: { characterId: string; delta: number }[]
  npcPairIntimacyDelta?: { npcIdA: string; npcIdB: string; delta: number }[]
  npcSpecialtySkillDelta?: { characterId: string; delta: number }[]
}

/**
 * 玩家在弹窗中选择的分支。
 * 若事件的 `choices` 非空，**必须**选择一项；仅应用该选项的 `effects`（忽略事件根上的 `effects`）。
 */
export type RandomEventChoice = {
  id: string
  label: string
  /** 本分支涉及的 NPC（用于同场互动亲密度自动提升） */
  involvedNpcIds?: string[]
  effects?: RandomEventEffects
  /** 选中该分支后，强制串联触发的后续事件 id（按顺序入队） */
  followupEventIds?: string[]
  /** 概率触发的后续事件（可配置多组） */
  probabilisticFollowups?: RandomEventProbabilisticFollowup[]
}

export type RandomEventProbabilisticFollowup = {
  /** 命中概率（0~1） */
  chance: number
  /** 命中后按顺序入队的后续事件 */
  eventIds: string[]
  /** 按当前属性动态改写概率（从上到下匹配第一条命中规则） */
  chanceByStats?: RandomEventStatProbabilityRule[]
}

export type RandomEventStatSnapshot = {
  san: number
  academics: number
  mainSkill: number
}

export type RandomEventStatCondition = {
  minSan?: number
  maxSan?: number
  minAcademics?: number
  maxAcademics?: number
  minMainSkill?: number
  maxMainSkill?: number
}

export type RandomEventStatProbabilityRule = {
  condition: RandomEventStatCondition
  chance: number
}

export type RandomEventDef = {
  id: string
  weight: number
  /**
   * 事件冷却周数：同一事件触发后，至少间隔多少“绝对周”才可再次触发。
   * - 省略时使用全局默认值（见 config `EVENT_COOLDOWN_WEEKS`）
   * - 设为 0 可禁用冷却（一般不建议）
   */
  cooldownWeeks?: number
  /** 情景描述（可写长一点，作为决策背景） */
  text: string
  condition?: RandomEventCondition
  /**
   * 主角初始选择的主修乐器门槛：
   * - 填了数组：只有当 `mainInstrument` 落在数组里时，此事件才会被抽到
   * - 不填：视为公共事件，对所有主修乐器都可触发
   */
  mainInstrumentGate?: Instrument[]
  /**
   * 事件涉及与主角的互动时，在 `collectPlayerFacingNpcIds` 中出现的角色若尚未认识（met），
   * 仅当 id 在此列出时才可进入本周抽取（表示「本事件中可能初次相识」）。已认识则无限制。
   */
  meetNpcIds?: string[]
  /** 事件涉及的 NPC（用于同场互动亲密度自动提升） */
  involvedNpcIds?: string[]
  /** 同场多名 NPC 时，自动增加两两亲密度（默认 0，不自动） */
  coappearIntimacyDelta?: number
  /**
   * 无选项时：点「继续」后应用这里的 `effects`。
   * 有选项时：根上的 `effects` 会被忽略，只结算选中选项。
   */
  effects?: RandomEventEffects
  /** 若设且 length≥1，弹窗显示多个按钮，由玩家选择 */
  choices?: RandomEventChoice[]
  /** 无选项事件在结算后触发的后续事件 id（按顺序入队） */
  followupEventIds?: string[]
  /** 无选项事件的概率后续事件 */
  probabilisticFollowups?: RandomEventProbabilisticFollowup[]
  /**
   * 事件本体是否进入候选池的概率（默认 1）。
   * - 可配固定 `spawnChance`
   * - 或按属性动态 `spawnChanceByStats`
   */
  spawnChance?: number
  spawnChanceByStats?: RandomEventStatProbabilityRule[]
  /**
   * 羁绊解锁概率门槛：
   * - bond < minBond 时，此事件概率为 0
   * - bond >= minBond 时，事件概率随羁绊线性提高，最高到 maxChance
   */
  bondUnlock?: {
    minBond: number
    maxChance?: number
  }
}

export type RandomEventEffectInput = {
  san: number
  sanMax: number
  academics: number
  mainSkill: number
  bond: number
  bandUnlocked: boolean
  characters: NpcSnapshot[]
  statMax: number
}

export type RandomEventEffectOutput = {
  san: number
  academics: number
  mainSkill: number
  bond: number
  characters: NpcSnapshot[]
  /** 含隐性，写入事件历史 */
  summaryLine: string | null
  /** 仅显性变化，用于选择后的简短提示弹窗；无则 null */
  visibleSummaryLine: string | null
}
