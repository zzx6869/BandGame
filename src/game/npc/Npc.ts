/**
 * =============================================================================
 * NPC 类模版 —— 统一管理可遇见的 NPC
 * =============================================================================
 *
 * 【数据层】`NpcSnapshot`：纯对象，适合放进 Pinia / 存档 / JSON。
 * 【逻辑层】`Npc` 类：包装单个快照，提供读写方法；你也可以直接改 snapshot 字段。
 *
 * 【推荐定义新角色】在 `npcs.config.ts` 里往 `NPC_CREATE_ENTRIES` 数组追加一项，
 * 用 `buildNpcRoster()` 生成初始 `NpcSnapshot[]`。不要在业务里散落重复对象。
 *
 * 每个 NPC 至少包含：
 * - specialty：五选一乐器，**固定**，表示 TA 的定位（吉他/声乐/贝斯/鼓/键盘）。
 * - specialtySkill：TA 在自己专精项上的「技能值」0～statMax（可与主角 mainSkill 类比）。
 * - favorWithPlayer：与**主角**的好感度。
 * - intimacyWithOthers：`Record<其他 NPC 的 id, 亲密度>`，**双向对称**维护（见 `syncMutualIntimacy`）。
 *
 * 亲密度双向：A 对 B 与 B 对 A 应始终保持同一数值；请用提供的工具函数改，避免只改一侧。
 */

import type { Instrument } from '@/game/types'

// ----------------------------------------------------------------------------- 小工具

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** 深拷贝一条 NPC 快照（含亲密度表） */
export function cloneNpcSnapshot(s: NpcSnapshot): NpcSnapshot {
  return {
    ...s,
    intimacyWithOthers: { ...s.intimacyWithOthers },
  }
}

export function cloneNpcSnapshotList(list: NpcSnapshot[]): NpcSnapshot[] {
  return list.map(cloneNpcSnapshot)
}

// ----------------------------------------------------------------------------- 平面数据（存档 / Store）

export type NpcSnapshot = {
  id: string
  name: string
  /** 固定专精乐器（五选一），一般剧情里不改 */
  specialty: Instrument
  /** 在该专精上的技能数值 0～statMax */
  specialtySkill: number
  /** 与主角的好感 */
  favorWithPlayer: number
  /**
   * 与其他 NPC 的亲密度；key 为对方 `id`。
   * 约定：与 `syncMutualIntimacy` / `buildNpcRoster` 配合时保持 A↔B 数值一致。
   */
  intimacyWithOthers: Record<string, number>
  met: boolean
  note?: string
}

// ----------------------------------------------------------------------------- 从 config 批量生成用的「创建项」

export type NpcBondSeed = {
  /** 另一个 NPC 的 id */
  targetId: string
  /** 双向亲密度初始值 */
  value: number
}

/**
 * 在 `config.ts` 里填的每一条模版；`buildNpcRoster` 会展开为完整 `NpcSnapshot[]`。
 */
export type NpcCreateInput = {
  id: string
  name: string
  specialty: Instrument
  /** @default 20 */
  initialSpecialtySkill?: number
  /** @default 0 */
  initialFavorWithPlayer?: number
  /**
   * 与指定 NPC 的初始亲密度（会同时写入双方快照，对称）。
   * 只需从其中一方声明一次即可；若双方都声明同一对且数值不同，后处理的条目会覆盖先处理的。
   */
  initialBonds?: NpcBondSeed[]
  met?: boolean
  note?: string
}

export type InviteRule = {
  minMainSkill?: number
  minBandMemberCount?: number
  requireBandMemberIdsAll?: string[]
  reason: string
}

export type InviteRuleEvalContext = {
  bandMemberIds: string[]
  mainSkill: number
}

export type InviteFavorThresholdRule = {
  /** 队内人数至少达到该值时生效 */
  minBandMemberCount?: number
  /** 必须同时满足：以下角色都已在乐队中才生效 */
  requireBandMemberIdsAll?: string[]
  /** 达到该阈值才允许入队 */
  threshold: number
}

export type InviteFavorThresholdConfig = {
  /** 默认好感阈值（不满足 byBand 任何规则时使用） */
  default: number
  /** 若满足其中某条规则，则以该条 threshold 覆盖 default（按数组顺序，命中第一条） */
  byBandRules?: InviteFavorThresholdRule[]
}

export type InviteFailureSpeechConfig = {
  favorLow?: string
  /** 好感差距较小（快达标）时优先使用 */
  favorLowNear?: string
  /** 好感差距较大（离达标较远）时优先使用 */
  favorLowFar?: string
  ruleBlocked?: string
  /** 失败原因为技能门槛时优先使用 */
  ruleSkillBlocked?: string
  /** 失败原因为队伍/成员门槛时优先使用 */
  ruleBandBlocked?: string
  fallback?: string
}

/**
 * 根据配置规则校验某角色当前是否满足入队条件，返回失败原因列表（空数组表示全部通过）。
 */
export function evaluateInviteRuleFailures(
  characterId: string,
  rulesMap: Record<string, InviteRule[]>,
  ctx: InviteRuleEvalContext,
): string[] {
  const fails: string[] = []
  const rules = rulesMap[characterId] ?? []
  for (const r of rules) {
    if (r.minMainSkill != null && ctx.mainSkill < r.minMainSkill) fails.push(r.reason)
    if (r.minBandMemberCount != null && ctx.bandMemberIds.length < r.minBandMemberCount) fails.push(r.reason)
    if (r.requireBandMemberIdsAll?.length) {
      const ok = r.requireBandMemberIdsAll.every((id) => ctx.bandMemberIds.includes(id))
      if (!ok) fails.push(r.reason)
    }
  }
  return fails
}

/**
 * 计算某角色当前“邀请入队所需好感阈值”，支持随队伍组成变化。
 *
 * - 先读取角色配置：`default`
 * - 若存在 `byBandRules`，按顺序匹配第一条命中规则并使用其 `threshold`
 */
export function getInviteFavorThreshold(
  characterId: string,
  thresholdsMap: Record<string, InviteFavorThresholdConfig>,
  ctx: { bandMemberIds: string[] },
  fallbackDefault: number,
): number {
  const cfg = thresholdsMap[characterId]
  const base = cfg?.default ?? fallbackDefault
  const rules = cfg?.byBandRules ?? []
  for (const r of rules) {
    if (r.minBandMemberCount != null && ctx.bandMemberIds.length < r.minBandMemberCount) continue
    if (r.requireBandMemberIdsAll?.length) {
      const ok = r.requireBandMemberIdsAll.every((id) => ctx.bandMemberIds.includes(id))
      if (!ok) continue
    }
    return r.threshold
  }
  return base
}

/**
 * 根据失败类型返回角色口吻台词。
 */
export function getInviteFailureSpeech(
  characterId: string,
  speechMap: Record<string, InviteFailureSpeechConfig>,
  ctx: {
    favorFailed: boolean
    ruleFailed: boolean
    favorGap?: number
    ruleFailReasons?: string[]
  },
): string | null {
  const cfg = speechMap[characterId]
  if (!cfg) return null
  if (ctx.favorFailed) {
    const gap = Math.max(0, ctx.favorGap ?? 0)
    if (gap > 12 && cfg.favorLowFar) return cfg.favorLowFar
    if (gap <= 8 && cfg.favorLowNear) return cfg.favorLowNear
    if (cfg.favorLow) return cfg.favorLow
  }
  if (ctx.ruleFailed) {
    const reasons = ctx.ruleFailReasons ?? []
    const bySkill = reasons.some((r) => r.includes('技能') || r.includes('实力') || r.includes('演奏'))
    const byBand = reasons.some((r) => r.includes('成员') || r.includes('队') || r.includes('阵容'))
    if (bySkill && cfg.ruleSkillBlocked) return cfg.ruleSkillBlocked
    if (byBand && cfg.ruleBandBlocked) return cfg.ruleBandBlocked
    if (cfg.ruleBlocked) return cfg.ruleBlocked
  }
  return cfg.fallback ?? null
}

/**
 * 由创建项列表生成完整 roster：补全所有人际亲密度 key，并应用 initialBonds。
 * @param statClamp 与游戏内 STAT_MAX 一致，用于钳制技能 / 好感 / 亲密度
 */
export function buildNpcRoster(entries: NpcCreateInput[], statClamp = 100): NpcSnapshot[] {
  const ids = entries.map((e) => e.id)
  if (new Set(ids).size !== ids.length) {
    throw new Error('buildNpcRoster: 存在重复 id')
  }

  const snapshots: NpcSnapshot[] = entries.map((e) => {
    const intimacyWithOthers: Record<string, number> = {}
    for (const oid of ids) {
      if (oid === e.id) continue
      intimacyWithOthers[oid] = 0
    }
    return {
      id: e.id,
      name: e.name,
      specialty: e.specialty,
      specialtySkill: clamp(e.initialSpecialtySkill ?? 20, 0, statClamp),
      favorWithPlayer: clamp(e.initialFavorWithPlayer ?? 0, 0, statClamp),
      intimacyWithOthers,
      met: e.met ?? false,
      note: e.note,
    }
  })

  const byId = new Map(snapshots.map((s) => [s.id, s] as const))

  for (const e of entries) {
    if (!e.initialBonds?.length) continue
    const self = byId.get(e.id)
    if (!self) continue
    for (const { targetId, value } of e.initialBonds) {
      if (targetId === e.id) continue
      const v = clamp(value, 0, statClamp)
      self.intimacyWithOthers[targetId] = v
      const other = byId.get(targetId)
      if (other) other.intimacyWithOthers[e.id] = v
    }
  }

  return snapshots
}

// ----------------------------------------------------------------------------- 亲密度对称写入

/**
 * 在**整个 roster** 上把 A↔B 的亲密度设为同一值（若需「增减」请先读出再 set）。
 */
export function syncMutualIntimacy(
  roster: NpcSnapshot[],
  npcIdA: string,
  npcIdB: string,
  value: number,
  statMax: number,
): void {
  if (npcIdA === npcIdB) return
  const a = roster.find((n) => n.id === npcIdA)
  const b = roster.find((n) => n.id === npcIdB)
  if (!a || !b) return
  const v = clamp(value, 0, statMax)
  a.intimacyWithOthers[npcIdB] = v
  b.intimacyWithOthers[npcIdA] = v
}

/**
 * 双向同时加减亲密度（常用于：两人一起出镜的剧情）。
 */
export function addMutualIntimacy(
  roster: NpcSnapshot[],
  npcIdA: string,
  npcIdB: string,
  delta: number,
  statMax: number,
): void {
  if (npcIdA === npcIdB) return
  const a = roster.find((n) => n.id === npcIdA)
  const b = roster.find((n) => n.id === npcIdB)
  if (!a || !b) return
  const next = clamp((a.intimacyWithOthers[npcIdB] ?? 0) + delta, 0, statMax)
  syncMutualIntimacy(roster, npcIdA, npcIdB, next, statMax)
}

// ----------------------------------------------------------------------------- 类：单 NPC 上的便捷方法（可选使用）

export class Npc {
  readonly data: NpcSnapshot

  constructor(data: NpcSnapshot) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }
  get name(): string {
    return this.data.name
  }
  get specialty(): Instrument {
    return this.data.specialty
  }

  /** 查询对另一名 NPC 的亲密度（单向读表，正常应与对方互表一致） */
  intimacyTowards(otherNpcId: string): number {
    if (otherNpcId === this.data.id) return 0
    return this.data.intimacyWithOthers[otherNpcId] ?? 0
  }

  /** 改与主角的好感（就地修改） */
  addFavorWithPlayer(delta: number, statMax: number): void {
    this.data.favorWithPlayer = clamp(this.data.favorWithPlayer + delta, 0, statMax)
  }

  /** 改专精技能（就地修改） */
  addSpecialtySkill(delta: number, statMax: number): void {
    this.data.specialtySkill = clamp(this.data.specialtySkill + delta, 0, statMax)
  }

  /**
   * 用主角（玩家）包装：从 entries 生成 Npc 实例列表。
   */
  static rosterFromSnapshots(snapshots: NpcSnapshot[]): Npc[] {
    return snapshots.map((s) => new Npc(s))
  }

  static fromSnapshot(s: NpcSnapshot): Npc {
    return new Npc(s)
  }
}
