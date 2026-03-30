import type { BandActivityRecord, GamePhase, Instrument, SongEntry } from '@/game/types'
import type { NpcSnapshot } from '@/game/npc'
import type { RandomEventDef } from '@/game/events'

/** 与某角色在随机事件中产生过直接互动时的记录（与 store 导出类型一致） */
export type NpcRandomEventMemory = {
  eventId: string
  weekLabel: string
  snippet: string
  choiceLabel?: string
}

export const SCHOOL_GAME_STORAGE_KEY = 'band-school-game-save'
export const SCHOOL_GAME_SAVE_VERSION = 1

const PHASES: GamePhase[] = ['intro', 'skill_select', 'playing', 'graduated']
const INSTRUMENTS: Instrument[] = ['guitar', 'vocal', 'bass', 'drums', 'keyboard']

export type SchoolGamePersisted = {
  v: number
  phase: GamePhase
  san: number
  sanMax: number
  academics: number
  mainSkill: number
  mainInstrument: Instrument | null
  year: number
  weekInYear: number
  characters: NpcSnapshot[]
  bond: number
  bandMemberIds: string[]
  songs: SongEntry[]
  bandActivityLog: BandActivityRecord[]
  narrativeLines: string[]
  randomEventQueue: RandomEventDef[]
  randomEventsThisWeekTotal: number
  randomEventVisibleOutcome: string | null
  randomEventDeferQueueAdvance: boolean
  randomEventModalTitle?: string
  npcRandomEventMemories: Record<string, NpcRandomEventMemory[]>
  eventLastTriggeredWeek?: Record<string, number>
  restUsedThisWeek: boolean
  meetEventTriggeredThisWeek?: boolean
}

function isGamePhase(x: unknown): x is GamePhase {
  return typeof x === 'string' && (PHASES as string[]).includes(x)
}

function isInstrument(x: unknown): x is Instrument {
  return typeof x === 'string' && (INSTRUMENTS as string[]).includes(x)
}

export function loadSchoolGamePersisted(): SchoolGamePersisted | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(SCHOOL_GAME_STORAGE_KEY)
  if (!raw) return null
  try {
    const p = JSON.parse(raw) as Partial<SchoolGamePersisted>
    if (p.v !== SCHOOL_GAME_SAVE_VERSION || !isGamePhase(p.phase)) return null
    if (typeof p.san !== 'number' || typeof p.sanMax !== 'number') return null
    if (typeof p.academics !== 'number' || typeof p.mainSkill !== 'number') return null
    if (p.mainInstrument != null && !isInstrument(p.mainInstrument)) return null
    if (typeof p.year !== 'number' || typeof p.weekInYear !== 'number') return null
    if (!Array.isArray(p.characters)) return null
    if (typeof p.bond !== 'number') return null
    if (!Array.isArray(p.bandMemberIds)) return null
    if (!Array.isArray(p.songs)) return null
    if (!Array.isArray(p.bandActivityLog)) return null
    if (!Array.isArray(p.narrativeLines)) return null
    if (!Array.isArray(p.randomEventQueue)) return null
    if (typeof p.randomEventsThisWeekTotal !== 'number') return null
    if (p.randomEventVisibleOutcome != null && typeof p.randomEventVisibleOutcome !== 'string') return null
    if (typeof p.randomEventDeferQueueAdvance !== 'boolean') return null
    if (p.randomEventModalTitle != null && typeof p.randomEventModalTitle !== 'string') return null
    if (!p.npcRandomEventMemories || typeof p.npcRandomEventMemories !== 'object') return null
    if (p.eventLastTriggeredWeek != null && typeof p.eventLastTriggeredWeek !== 'object') return null
    if (p.eventLastTriggeredWeek) {
      for (const v of Object.values(p.eventLastTriggeredWeek)) {
        if (typeof v !== 'number') return null
      }
    }
    if (typeof p.restUsedThisWeek !== 'boolean') return null
    if (p.meetEventTriggeredThisWeek != null && typeof p.meetEventTriggeredThisWeek !== 'boolean') return null

    return p as SchoolGamePersisted
  } catch {
    return null
  }
}

export function saveSchoolGamePersisted(data: SchoolGamePersisted): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(SCHOOL_GAME_STORAGE_KEY, JSON.stringify({ ...data, v: SCHOOL_GAME_SAVE_VERSION }))
  } catch {
    /* quota / private mode */
  }
}

export function clearSchoolGamePersisted(): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(SCHOOL_GAME_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
