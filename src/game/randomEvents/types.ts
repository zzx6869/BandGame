/**
 * 随机事件 —— 类型定义
 *
 * 事件条目只改 `events.config.ts`。
 */

import type { NpcSnapshot } from '@/game/npc'

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
  effects?: RandomEventEffects
}

export type RandomEventDef = {
  id: string
  weight: number
  /** 情景描述（可写长一点，作为决策背景） */
  text: string
  condition?: RandomEventCondition
  /**
   * 事件涉及与主角的互动时，在 `collectPlayerFacingNpcIds` 中出现的角色若尚未认识（met），
   * 仅当 id 在此列出时才可进入本周抽取（表示「本事件中可能初次相识」）。已认识则无限制。
   */
  meetNpcIds?: string[]
  /**
   * 无选项时：点「继续」后应用这里的 `effects`。
   * 有选项时：根上的 `effects` 会被忽略，只结算选中选项。
   */
  effects?: RandomEventEffects
  /** 若设且 length≥1，弹窗显示多个按钮，由玩家选择 */
  choices?: RandomEventChoice[]
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
