/**
 * 随机事件 —— 条件匹配、加权抽签、属性结算
 * （数据列表在 `events.config.ts`，本文件一般不必改）
 */

import type { NpcSnapshot } from '@/game/npc'
import { addMutualIntimacy } from '@/game/npc'
import type {
  RandomEventCondition,
  RandomEventContext,
  RandomEventDef,
  RandomEventEffectInput,
  RandomEventEffectOutput,
  RandomEventEffects,
} from './types'

/** 与主角直接挂钩的互动（好感 / 对 TA 的专精指导等），用于结识判定与事件池过滤 */
export function collectPlayerFacingNpcIds(ev: RandomEventDef): string[] {
  const ids = new Set<string>()
  const take = (eff?: RandomEventEffects) => {
    eff?.characterFavorDelta?.forEach(({ characterId }) => ids.add(characterId))
    eff?.npcSpecialtySkillDelta?.forEach(({ characterId }) => ids.add(characterId))
  }
  take(ev.effects)
  ev.choices?.forEach((c) => take(c.effects))
  ev.condition?.characterFavorMin?.forEach(({ characterId }) => ids.add(characterId))
  return [...ids]
}

export function matchesRandomEventNpcGate(ev: RandomEventDef, ctx: RandomEventContext): boolean {
  const needed = collectPlayerFacingNpcIds(ev)
  if (needed.length === 0) return true
  const allowIntro = new Set(ev.meetNpcIds ?? [])
  for (const id of needed) {
    const ch = ctx.characters.find((c) => c.id === id)
    if (!ch) continue
    if (ch.met) continue
    if (!allowIntro.has(id)) return false
  }
  return true
}

/** 根据本分支实际结算的效果，将发生直接互动的角色记为已相识 */
export function applyMetFromEffects(effects: RandomEventEffects | undefined, characters: NpcSnapshot[]): void {
  if (!effects) return
  for (const { characterId, delta } of effects.characterFavorDelta ?? []) {
    if (delta === 0) continue
    const ch = characters.find((c) => c.id === characterId)
    if (ch) ch.met = true
  }
  for (const { characterId, delta } of effects.npcSpecialtySkillDelta ?? []) {
    if (delta === 0) continue
    const ch = characters.find((c) => c.id === characterId)
    if (ch) ch.met = true
  }
}

export function matchesRandomEventCondition(
  condition: RandomEventCondition | undefined,
  ctx: RandomEventContext,
): boolean {
  if (!condition || Object.keys(condition).length === 0) return true

  const { year, weekInYear, absoluteWeek, san, academics, mainSkill, bandUnlocked, bandMemberCount, bond, characters } =
    ctx

  if (condition.minYear != null && year < condition.minYear) return false
  if (condition.maxYear != null && year > condition.maxYear) return false
  if (condition.minWeekInYear != null && weekInYear < condition.minWeekInYear) return false
  if (condition.maxWeekInYear != null && weekInYear > condition.maxWeekInYear) return false
  if (condition.minAbsoluteWeek != null && absoluteWeek < condition.minAbsoluteWeek) return false
  if (condition.maxAbsoluteWeek != null && absoluteWeek > condition.maxAbsoluteWeek) return false

  if (condition.minSan != null && san < condition.minSan) return false
  if (condition.maxSan != null && san > condition.maxSan) return false
  if (condition.minAcademics != null && academics < condition.minAcademics) return false
  if (condition.maxAcademics != null && academics > condition.maxAcademics) return false
  if (condition.minMainSkill != null && mainSkill < condition.minMainSkill) return false
  if (condition.maxMainSkill != null && mainSkill > condition.maxMainSkill) return false

  if (condition.bandUnlocked != null && condition.bandUnlocked !== bandUnlocked) return false
  if (condition.minBandMemberCount != null && bandMemberCount < condition.minBandMemberCount) return false
  if (condition.minBond != null && bond < condition.minBond) return false
  if (condition.maxBond != null && bond > condition.maxBond) return false

  if (condition.characterFavorMin?.length) {
    for (const { characterId, min } of condition.characterFavorMin) {
      const ch = characters.find((c) => c.id === characterId)
      if (!ch || ch.favorWithPlayer < min) return false
    }
  }

  return true
}

/** 当本周没有任何事件满足条件时使用 */
const FALLBACK_EVENT: RandomEventDef = {
  id: '_fallback',
  weight: 1,
  text: '本周没有特别的事，日子平静地流过课表与铃声。',
}

const isUserEvent = (d: RandomEventDef) => d.id !== '_fallback'

/**
 * 连续抽 `count` 条事件：已抽中的 id 不会再次出现；候选耗尽则用兜底填满剩余次数。
 */
export function pickWeeklyRandomEvents(
  defs: RandomEventDef[],
  ctx: RandomEventContext,
  count: number,
): RandomEventDef[] {
  const picked: RandomEventDef[] = []
  let remaining = defs.filter(
    (d) =>
      matchesRandomEventCondition(d.condition, ctx) &&
      matchesRandomEventNpcGate(d, ctx) &&
      isUserEvent(d),
  )

  for (let i = 0; i < count; i++) {
    if (remaining.length === 0) {
      picked.push(FALLBACK_EVENT)
      continue
    }
    const ev = pickWeeklyRandomEvent(remaining, ctx)
    picked.push(ev)
    remaining = remaining.filter((d) => d.id !== ev.id)
  }
  return picked
}

export function pickWeeklyRandomEvent(defs: RandomEventDef[], ctx: RandomEventContext): RandomEventDef {
  const eligible = defs.filter(
    (d) => matchesRandomEventCondition(d.condition, ctx) && matchesRandomEventNpcGate(d, ctx),
  )
  const pool = eligible.length > 0 ? eligible : [FALLBACK_EVENT]

  let total = 0
  for (const e of pool) total += Math.max(0, e.weight)
  if (total <= 0) return pool[0]!

  let r = Math.random() * total
  for (const e of pool) {
    const w = Math.max(0, e.weight)
    r -= w
    if (r <= 0) return e
  }
  return pool[pool.length - 1]!
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function fmtDelta(actual: number): string {
  if (actual > 0) return `+${actual}`
  return String(actual)
}

export function resolveRandomEventEffects(
  effects: RandomEventEffects | undefined,
  input: RandomEventEffectInput,
): RandomEventEffectOutput {
  const { sanMax, statMax, bandUnlocked } = input

  let san = input.san
  let academics = input.academics
  let mainSkill = input.mainSkill
  let bond = input.bond

  const newChars: NpcSnapshot[] = input.characters.map((c) => ({
    ...c,
    intimacyWithOthers: { ...c.intimacyWithOthers },
  }))
  const visibleParts: string[] = []
  const hiddenParts: string[] = []

  if (!effects || Object.keys(effects).length === 0) {
    return {
      san,
      academics,
      mainSkill,
      bond,
      characters: newChars,
      summaryLine: null,
      visibleSummaryLine: null,
    }
  }

  if (effects.sanDelta != null && effects.sanDelta !== 0) {
    const before = san
    san = clamp(san + effects.sanDelta, 0, sanMax)
    const actual = san - before
    if (actual !== 0) visibleParts.push(`SAN ${fmtDelta(actual)}`)
  }

  if (effects.academicsDelta != null && effects.academicsDelta !== 0) {
    const before = academics
    academics = clamp(academics + effects.academicsDelta, 0, statMax)
    const actual = academics - before
    if (actual !== 0) visibleParts.push(`学业 ${fmtDelta(actual)}`)
  }

  if (effects.mainSkillDelta != null && effects.mainSkillDelta !== 0) {
    const before = mainSkill
    mainSkill = clamp(mainSkill + effects.mainSkillDelta, 0, statMax)
    const actual = mainSkill - before
    if (actual !== 0) visibleParts.push(`主修技能 ${fmtDelta(actual)}`)
  }

  if (bandUnlocked && effects.bondDelta != null && effects.bondDelta !== 0) {
    const before = bond
    bond = clamp(bond + effects.bondDelta, 0, statMax)
    const actual = bond - before
    if (actual !== 0) visibleParts.push(`羁绊 ${fmtDelta(actual)}`)
  }

  if (effects.characterFavorDelta?.length) {
    for (const { characterId, delta } of effects.characterFavorDelta) {
      if (delta === 0) continue
      const ch = newChars.find((c) => c.id === characterId)
      if (!ch) continue
      const before = ch.favorWithPlayer
      ch.favorWithPlayer = clamp(ch.favorWithPlayer + delta, 0, statMax)
      const actual = ch.favorWithPlayer - before
      if (actual !== 0) visibleParts.push(`${ch.name} 好感 ${fmtDelta(actual)}`)
    }
  }

  if (effects.npcSpecialtySkillDelta?.length) {
    for (const { characterId, delta } of effects.npcSpecialtySkillDelta) {
      if (delta === 0) continue
      const ch = newChars.find((c) => c.id === characterId)
      if (!ch) continue
      const before = ch.specialtySkill
      ch.specialtySkill = clamp(ch.specialtySkill + delta, 0, statMax)
      const actual = ch.specialtySkill - before
      if (actual !== 0) hiddenParts.push(`${ch.name} 专精技能 ${fmtDelta(actual)}`)
    }
  }

  if (effects.npcPairIntimacyDelta?.length) {
    for (const { npcIdA, npcIdB, delta } of effects.npcPairIntimacyDelta) {
      if (delta === 0 || npcIdA === npcIdB) continue
      const a = newChars.find((c) => c.id === npcIdA)
      const b = newChars.find((c) => c.id === npcIdB)
      addMutualIntimacy(newChars, npcIdA, npcIdB, delta, statMax)
      if (a && b) hiddenParts.push(`${a.name}↔${b.name} 亲密度 ${fmtDelta(delta)}`)
    }
  }

  const allParts = [...visibleParts, ...hiddenParts]
  const summaryLine = allParts.length > 0 ? `事件影响：${allParts.join('，')}` : null
  const visibleSummaryLine = visibleParts.length > 0 ? visibleParts.join('，') : null

  return {
    san,
    academics,
    mainSkill,
    bond,
    characters: newChars,
    summaryLine,
    visibleSummaryLine,
  }
}
