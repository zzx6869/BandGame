export type {
  RandomEventChoice,
  RandomEventCondition,
  RandomEventContext,
  RandomEventDef,
  RandomEventEffectInput,
  RandomEventEffectOutput,
  RandomEventEffects,
} from './types'

export {
  applyMetFromEffects,
  collectPlayerFacingNpcIds,
  matchesRandomEventCondition,
  matchesRandomEventNpcGate,
  pickWeeklyRandomEvent,
  pickWeeklyRandomEvents,
  resolveRandomEventEffects,
} from './engine'

/** 事件列表：仅数据，编辑 `events.config.ts` */
export { RANDOM_EVENT_DEFS } from './events.config'
