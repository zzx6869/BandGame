export {
  Npc,
  buildNpcRoster,
  syncMutualIntimacy,
  addMutualIntimacy,
  cloneNpcSnapshot,
  cloneNpcSnapshotList,
  type NpcSnapshot,
  type NpcCreateInput,
  type NpcBondSeed,
} from './Npc'

/** 仅 NPC 表时可 `import { NPC_CREATE_ENTRIES } from '@/game/npc/npcs.config'` */
export { NPC_CREATE_ENTRIES } from './npcs.config'
