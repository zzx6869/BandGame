/**
 * =============================================================================
 * NPC 数据配置（只管「有哪些人、初始数值、初始关系」）
 * =============================================================================
 *
 * 人数多的时候只改本文件即可，不必打开主 config。
 * 字段含义见同目录 `Npc.ts` 顶部的 `NpcCreateInput` / `NpcSnapshot` 说明。
 *
 * 注意：
 * - 每人 `id` 全局唯一；`initialBonds.targetId` 必须指向本文件里另一个人的 `id`。
 * - 亲密度在 `initialBonds` 里写一次即可，会在两人之间双向同步。
 * - 默认「尚未认识主角」：`met` 省略时为 false；若在剧情开局就要已认识，可写 `met: true`。
 */

import type { NpcCreateInput } from './Npc'

export const NPC_CREATE_ENTRIES: NpcCreateInput[] = [
  {
    id: 'c1',
    name: '高松灯',
    specialty: 'vocal',
    initialSpecialtySkill: 50,
    initialFavorWithPlayer: 0,
    note: '小企鹅🐧',
    // initialBonds: [{ targetId: 'c2', value: 8 }],
  },
  {
    id: 'c2',
    name: '千早爱音',
    specialty: 'guitar',
    initialSpecialtySkill: 30,
    initialFavorWithPlayer: 0,
    note: 'C和弦高手',
    initialBonds: [{ targetId: 'c3', value: 12 }],
  },
  {
    id: 'c3',
    name: '椎名立希',
    specialty: 'drums',
    initialSpecialtySkill: 70,
    initialFavorWithPlayer: -10,
    note: '鼓手',
  },
  {
    id: 'c4',
    name: '要乐奈',
    specialty: 'guitar',
    initialSpecialtySkill: 70,
    initialFavorWithPlayer: 0,
    note: '猫🐱',
  },
  {
    id: 'c5',
    name: '丰川祥子',
    specialty: 'keyboard',
    initialSpecialtySkill: 80,
    initialFavorWithPlayer: 0,
    note: '键盘大师',
  },
]
