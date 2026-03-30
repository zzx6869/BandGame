import { buildNpcRoster, type NpcSnapshot } from '@/game/npc'
import { NPC_CREATE_ENTRIES } from '@/game/npc/npcs.config'

/** 一年 12 个月，每月 4 周，因此每学年 48 周 */
export const MONTHS_PER_SCHOOL_YEAR = 12
export const WEEKS_PER_MONTH = 4
/** 学年起始月：9 表示第 1 周是 9 月第 1 周 */
export const SCHOOL_YEAR_START_MONTH = 9
/** 毕业月：高三该月第 4 周结束时毕业 */
export const GRADUATION_MONTH = 6
/** 三年 × 每年周数（模版用，可改） */
export const WEEKS_PER_SCHOOL_YEAR = MONTHS_PER_SCHOOL_YEAR * WEEKS_PER_MONTH
export const SCHOOL_YEARS = 3

export const INITIAL_SAN = 1000000
export const SAN_MAX = 100
export const INITIAL_ACADEMICS = 50
export const INITIAL_MAIN_SKILL = 20
/** 每周固定恢复 SAN（background.txt） */
export const WEEKLY_SAN_RECOVERY = 30

/** 好感达到后可邀请入队 */
export const INVITE_FAVOR_THRESHOLD = 40

export const ACTIVITY = {
  study: { sanCost: 15, academics: 5 },
  practice: { sanCost: 20, skill: 4 },
  rest: { sanGain: 12 },
  chat: { sanCost: 8, favor: 10 },
  invite: { sanCost: 10 },
  bandPractice: { sanCost: 25, bond: 4, songProf: 6 },
  bandHangout: { sanCost: 15, bond: 5 },
} as const

export const STAT_MAX = 100
/** 默认事件冷却：同一事件触发后至少间隔 N 周再出现 */
export const EVENT_COOLDOWN_WEEKS = 8

/**
 * 每周初触发的随机事件条数（可按学年、周次自由改规则）。
 * 同一周内各条事件 **尽量不重复**（同 id 只出现一次）；不够抽时补足兜底事件。
 */
export type WeeklyRandomEventCountContext = {
  year: number
  weekInYear: number
  /** 从入学起第几周，高一第 1 周 = 1 */
  absoluteWeek: number
}

export function monthFromWeekInYear(weekInYear: number): number {
  const monthOffset = Math.floor((Math.max(1, weekInYear) - 1) / WEEKS_PER_MONTH)
  return ((SCHOOL_YEAR_START_MONTH - 1 + monthOffset) % MONTHS_PER_SCHOOL_YEAR) + 1
}

export function weekInMonthFromWeekInYear(weekInYear: number): number {
  return ((Math.max(1, weekInYear) - 1) % WEEKS_PER_MONTH) + 1
}

export function weeklyRandomEventCount(c: WeeklyRandomEventCountContext): number {
  if (c.year === 1) return 1
  if (c.year === 2) return 2
  return 3
}

/**
 * 乐队排练事件条数：每次排练一定会触发其中的若干条。
 * - 可改：更随周次变化、或随羁绊 bond 增长而增加数量
 */
export function bandRehearsalEventCount(_c: WeeklyRandomEventCountContext): number {
  return 2
}

/** 乐队团建事件条数：每次团建固定触发若干条 */
export function bandHangoutEventCount(_c: WeeklyRandomEventCountContext): number {
  return 1
}

/**
 * 学习/练习/休息时触发特殊事件的概率。
 * - 以 Math.random() 抽取，命中后最多触发 `SPECIAL_EVENT_MAX_COUNT` 条
 */
export const SPECIAL_EVENT_TRIGGER_CHANCE = {
  study: 0.25,
  practice: 0.3,
  rest: 0.2,
} as const

export const SPECIAL_EVENT_MAX_COUNT = 1

/** 学习/练习/休息后触发“角色相识事件”的概率（每周至多一次） */
export const MEET_EVENT_TRIGGER_CHANCE = 0.2

/** 与 `npcs.config.ts` 同源；也可在该文件中直接 `import { NPC_CREATE_ENTRIES } from '@/game/npc/npcs.config'` */
export { NPC_CREATE_ENTRIES }

/** 开局 NPC 存档（列表定义在 `src/game/npc/npcs.config.ts`） */
export const INITIAL_NPCS: NpcSnapshot[] = buildNpcRoster(NPC_CREATE_ENTRIES, STAT_MAX)
