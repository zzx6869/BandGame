export {
  Npc,
  evaluateInviteRuleFailures,
  getInviteFavorThreshold,
  getInviteFailureSpeech,
  buildNpcRoster,
  syncMutualIntimacy,
  addMutualIntimacy,
  cloneNpcSnapshot,
  cloneNpcSnapshotList,
  type NpcSnapshot,
  type NpcCreateInput,
  type NpcBondSeed,
  type InviteRule,
  type InviteRuleEvalContext,
  type InviteFailureSpeechConfig,
} from './Npc'

/** 仅 NPC 表时可 `import { NPC_CREATE_ENTRIES } from '@/game/npc/npcs.config'` */
export { NPC_CREATE_ENTRIES } from './npcs.config'
export { INVITE_RULES } from './inviteRules.config'
export { INVITE_FAVOR_THRESHOLDS } from './inviteRules.config'
export { INVITE_FAILURE_SPEECH } from './inviteRules.config'
