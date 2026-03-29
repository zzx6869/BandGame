import { buildNpcRoster, type NpcSnapshot } from '@/game/npc'
import { NPC_CREATE_ENTRIES } from '@/game/npc/npcs.config'

/** 三年 × 每年周数（模版用，可改） */
export const WEEKS_PER_SCHOOL_YEAR = 40
export const SCHOOL_YEARS = 3

export const INITIAL_SAN = 100
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

export function weeklyRandomEventCount(c: WeeklyRandomEventCountContext): number {
  if (c.year === 1) return 1
  if (c.year === 2) return 2
  return 3
}

/** 与 `npcs.config.ts` 同源；也可在该文件中直接 `import { NPC_CREATE_ENTRIES } from '@/game/npc/npcs.config'` */
export { NPC_CREATE_ENTRIES }

/** 开局 NPC 存档（列表定义在 `src/game/npc/npcs.config.ts`） */
export const INITIAL_NPCS: NpcSnapshot[] = buildNpcRoster(NPC_CREATE_ENTRIES, STAT_MAX)
