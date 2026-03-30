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
    id: 'c6',
    name: '长崎素世',
    specialty: 'bass',
    initialSpecialtySkill: 50,
    initialFavorWithPlayer: 0,
    note: '贝斯手',
  },
  // -------------------------- 孤独摇滚（结束乐队 / SICK HACK） --------------------------
  {
    id: 'btr_hitori',
    name: '后藤一里',
    specialty: 'guitar',
    initialSpecialtySkill: 78,
    initialFavorWithPlayer: 0,
    note: '结束乐队 / 吉他',
    initialBonds: [{ targetId: 'btr_nijika', value: 24 }],
  },
  {
    id: 'btr_nijika',
    name: '伊地知虹夏',
    specialty: 'drums',
    initialSpecialtySkill: 72,
    initialFavorWithPlayer: 0,
    note: '结束乐队 / 鼓手',
    initialBonds: [{ targetId: 'btr_ryo', value: 22 }],
  },
  {
    id: 'btr_ryo',
    name: '山田凉',
    specialty: 'bass',
    initialSpecialtySkill: 76,
    initialFavorWithPlayer: 0,
    note: '结束乐队 / 贝斯',
    initialBonds: [{ targetId: 'btr_kita', value: 20 }],
  },
  {
    id: 'btr_kita',
    name: '喜多郁代',
    specialty: 'vocal',
    initialSpecialtySkill: 68,
    initialFavorWithPlayer: 0,
    note: '结束乐队 / 主唱吉他',
  },
  {
    id: 'btr_kikuri',
    name: '广井菊里',
    specialty: 'bass',
    initialSpecialtySkill: 82,
    initialFavorWithPlayer: 0,
    note: 'SICK HACK / 贝斯主唱',
    initialBonds: [{ targetId: 'btr_eliza', value: 26 }],
  },
  {
    id: 'btr_eliza',
    name: '清水伊莱莎',
    specialty: 'guitar',
    initialSpecialtySkill: 73,
    initialFavorWithPlayer: 0,
    note: 'SICK HACK / 吉他',
    initialBonds: [{ targetId: 'btr_shima', value: 20 }],
  },
  {
    id: 'btr_shima',
    name: '岩下志麻',
    specialty: 'drums',
    initialSpecialtySkill: 74,
    initialFavorWithPlayer: 0,
    note: 'SICK HACK / 鼓手',
  },

  // -------------------------- Ave Mujica --------------------------
  {
    id: 'ave_uika',
    name: '祐天寺若麦',
    specialty: 'vocal',
    initialSpecialtySkill: 75,
    initialFavorWithPlayer: 0,
    note: 'Ave Mujica / 主唱',
    initialBonds: [{ targetId: 'ave_sakiko', value: 18 }],
  },
  {
    id: 'ave_sakiko',
    name: '丰川祥子（Ave）',
    specialty: 'keyboard',
    initialSpecialtySkill: 88,
    initialFavorWithPlayer: 0,
    note: 'Ave Mujica / 键盘',
    initialBonds: [{ targetId: 'ave_mutsumi', value: 20 }],
  },
  {
    id: 'ave_umiri',
    name: '八幡海铃',
    specialty: 'bass',
    initialSpecialtySkill: 81,
    initialFavorWithPlayer: 0,
    note: 'Ave Mujica / 贝斯',
  },
  {
    id: 'ave_nyamu',
    name: '三角初华（Nyamu）',
    specialty: 'drums',
    initialSpecialtySkill: 79,
    initialFavorWithPlayer: 0,
    note: 'Ave Mujica / 鼓手',
  },
  {
    id: 'ave_mutsumi',
    name: '若叶睦',
    specialty: 'guitar',
    initialSpecialtySkill: 77,
    initialFavorWithPlayer: 0,
    note: 'Ave Mujica / 吉他',
  },

  // -------------------------- Girls Band Cry --------------------------
  {
    id: 'gbc_nina',
    name: '井芹仁菜',
    specialty: 'vocal',
    initialSpecialtySkill: 70,
    initialFavorWithPlayer: 0,
    note: 'TOGENASHI TOGEARI / 主唱',
    initialBonds: [{ targetId: 'gbc_momoka', value: 23 }],
  },
  {
    id: 'gbc_momoka',
    name: '河原木桃香',
    specialty: 'guitar',
    initialSpecialtySkill: 83,
    initialFavorWithPlayer: 0,
    note: 'TOGENASHI TOGEARI / 吉他',
    initialBonds: [{ targetId: 'gbc_subaru', value: 19 }],
  },
  {
    id: 'gbc_subaru',
    name: '安和昴',
    specialty: 'drums',
    initialSpecialtySkill: 76,
    initialFavorWithPlayer: 0,
    note: 'TOGENASHI TOGEARI / 鼓手',
    initialBonds: [{ targetId: 'gbc_tomo', value: 18 }],
  },
  {
    id: 'gbc_tomo',
    name: '海老冢智',
    specialty: 'keyboard',
    initialSpecialtySkill: 72,
    initialFavorWithPlayer: 0,
    note: 'TOGENASHI TOGEARI / 键盘',
    initialBonds: [{ targetId: 'gbc_rupa', value: 17 }],
  },
  {
    id: 'gbc_rupa',
    name: 'Rupa',
    specialty: 'bass',
    initialSpecialtySkill: 74,
    initialFavorWithPlayer: 0,
    note: 'TOGENASHI TOGEARI / 贝斯',
  },

  // -------------------------- 轻音少女（放课后Tea Time） --------------------------
  {
    id: 'kon_yui',
    name: '平泽唯',
    specialty: 'guitar',
    initialSpecialtySkill: 66,
    initialFavorWithPlayer: 0,
    note: '放课后Tea Time / 吉他主唱',
    initialBonds: [{ targetId: 'kon_ritsu', value: 24 }],
  },
  {
    id: 'kon_mio',
    name: '秋山澪',
    specialty: 'bass',
    initialSpecialtySkill: 79,
    initialFavorWithPlayer: 0,
    note: '放课后Tea Time / 贝斯',
    initialBonds: [{ targetId: 'kon_ritsu', value: 25 }],
  },
  {
    id: 'kon_ritsu',
    name: '田井中律',
    specialty: 'drums',
    initialSpecialtySkill: 73,
    initialFavorWithPlayer: 0,
    note: '放课后Tea Time / 鼓手',
    initialBonds: [{ targetId: 'kon_tsumugi', value: 20 }],
  },
  {
    id: 'kon_tsumugi',
    name: '琴吹紬',
    specialty: 'keyboard',
    initialSpecialtySkill: 81,
    initialFavorWithPlayer: 0,
    note: '放课后Tea Time / 键盘',
    initialBonds: [{ targetId: 'kon_azusa', value: 18 }],
  },
  {
    id: 'kon_azusa',
    name: '中野梓',
    specialty: 'guitar',
    initialSpecialtySkill: 77,
    initialFavorWithPlayer: 0,
    note: '放课后Tea Time / 吉他',
  },
]
