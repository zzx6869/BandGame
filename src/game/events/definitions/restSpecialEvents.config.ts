import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 休息特殊事件池（v2）
 * - 主轴：SAN 回暖 + 稳定度（学业/主修小幅跟随）
 * - 控制 met：少量事件负责引入新角色，其余只在已 met 后出现
 */
export const REST_SPECIAL_EVENT_DEFS: RandomEventDef[] = [
  // -------------------------- 公共休息事件 --------------------------
  {
    id: 'rest_common_breathe_slow',
    weight: 10,
    text:
      '你把呼吸放慢一点点。世界没有立刻变好，但你的心跳终于回到可承受的节奏。',
    choices: [
      {
        id: 'rest_common_breathe_slow_only',
        label: '只做呼吸恢复',
        effects: { sanDelta: 3 },
      },
      {
        id: 'rest_common_breathe_slow_with_plan',
        label: '恢复后顺手整理明日计划',
        effects: { sanDelta: 2, academicsDelta: 1 },
      },
    ],
  },
  {
    id: 'rest_common_rain_sound',
    weight: 6,
    text:
      '雨声像节拍器一样持续。你不需要和谁解释，只要把自己放回原位。',
    choices: [
      {
        id: 'rest_common_rain_sound_listen',
        label: '什么都不做，只听雨声',
        effects: { sanDelta: 3 },
      },
      {
        id: 'rest_common_rain_sound_hum',
        label: '跟着雨声轻轻哼练',
        effects: { sanDelta: 1, mainSkillDelta: 2 },
      },
    ],
  },
  {
    id: 'rest_common_walk_after_bell',
    weight: 5,
    text:
      '放学后你慢慢走一圈。你看见别人冲刺，也看见别人停下，于是你学会不跟着焦虑。',
    choices: [
      {
        id: 'rest_common_walk_after_bell_alone',
        label: '一个人慢走沉淀',
        effects: { sanDelta: 2 },
      },
      {
        id: 'rest_common_walk_after_bell_together',
        label: '约同伴一起走一圈',
        effects: { sanDelta: 1, bondDelta: 2 },
      },
    ],
  },
  {
    id: 'rest_common_private_quiet',
    weight: 4,
    text:
      '你把手机收起来，让安静替你完成一部分恢复。等你回神，SAN 比预想更稳了。',
    effects: {
      sanDelta: 3,
    },
  },

  // -------------------------- 主修：vocal（c1） --------------------------
  {
    id: 'rest_vocal_c1_give_stones',
    weight: 7,
    mainInstrumentGate: ['vocal'],
    meetNpcIds: ['c1'],
    text:
      '高松灯把自己收集的东西轻轻交给你。她没说太多，只让你明白“你也可以把不安收起来”。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c1', delta: 2 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'rest_vocal_c1_tender_recover',
    weight: 5,
    mainInstrumentGate: ['vocal'],
    text:
      '你撑着快要崩的那一刻，她先让你把“害怕麻烦”换成“我在努力”。恢复之后你反而更想继续。',
    choices: [
      {
        id: 'rest_vocal_c1_tender_recover_accept',
        label: '接受她的安慰，先恢复',
        effects: { sanDelta: 3, characterFavorDelta: [{ characterId: 'c1', delta: 1 }] },
      },
      {
        id: 'rest_vocal_c1_tender_recover_talk',
        label: '说出焦虑，再一起整理',
        effects: { sanDelta: 2, academicsDelta: 1, characterFavorDelta: [{ characterId: 'c1', delta: 2 }] },
      },
    ],
  },

  // -------------------------- 主修：guitar（c2 + 少量 c4） --------------------------
  {
    id: 'rest_guitar_c2_snack_push',
    weight: 8,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c2'],
    text:
      '千早爱音把零食塞进你手里，还顺便把你拉出“一个人扛”的死角。她说这是补给，也算一份小小的认可。',
    effects: {
      sanDelta: 3,
      characterFavorDelta: [{ characterId: 'c2', delta: 2 }],
      bondDelta: 1,
    },
  },
  {
    id: 'rest_guitar_c2_afterglow',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    text:
      '你终于愿意把情绪放下。她也没有追问，只是在你心里留下“下一次一起”的暗号。',
    choices: [
      {
        id: 'rest_guitar_c2_afterglow_keep_chat',
        label: '继续聊一会儿再回去',
        effects: { sanDelta: 2, characterFavorDelta: [{ characterId: 'c2', delta: 1 }], bondDelta: 1 },
      },
      {
        id: 'rest_guitar_c2_afterglow_back_early',
        label: '趁状态回去早休息',
        effects: { sanDelta: 2, academicsDelta: 1 },
      },
    ],
  },
  {
    id: 'rest_guitar_c4_cat_tea',
    weight: 2,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c4'],
    text:
      '要乐奈带来的热饮像从空气里落下。她只说“别绷太久”，你就真的慢慢松掉了。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 2 }],
    },
  },

  // -------------------------- 主修：drums（c3） --------------------------
  {
    id: 'rest_drums_rikka_recover',
    weight: 7,
    mainInstrumentGate: ['drums'],
    meetNpcIds: ['c3'],
    text:
      '椎名立希不说“辛苦”，她只让你把身体先放松。她在你附近坐下，像给高松灯也给你一起守着。',
    effects: {
      sanDelta: 3,
      characterFavorDelta: [{ characterId: 'c3', delta: 2 }],
      bondDelta: 1,
    },
  },
  {
    id: 'rest_drums_rikka_quiet_order',
    weight: 5,
    mainInstrumentGate: ['drums'],
    text:
      '她用很短的话告诉你下一步怎么做：先恢复，再出发。你照做之后，学习也不那么排斥了。',
    choices: [
      {
        id: 'rest_drums_rikka_quiet_order_follow',
        label: '按她的顺序先恢复后学习',
        effects: { sanDelta: 2, academicsDelta: 1, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
      {
        id: 'rest_drums_rikka_quiet_order_break_only',
        label: '今天只休息，学习延后',
        effects: { sanDelta: 3, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
    ],
  },

  // -------------------------- 主修：keyboard（c5） --------------------------
  {
    id: 'rest_keyboard_c5_stability_lock',
    weight: 7,
    mainInstrumentGate: ['keyboard'],
    meetNpcIds: ['c5'],
    text:
      '丰川祥子让你按“顺序”休息。她不温柔，但她把你最需要的稳定留在了你能抓住的地方。',
    effects: {
      sanDelta: 3,
      characterFavorDelta: [{ characterId: 'c5', delta: 2 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'rest_keyboard_c5_soft_escape',
    weight: 5,
    mainInstrumentGate: ['keyboard'],
    text:
      '你想逃进完美，她先把你拉回“可用的自己”。恢复之后你更能专注接下来的练习。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c5', delta: 1 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'rest_common_year2_evening_rooftop',
    weight: 6,
    condition: { minYear: 2 },
    text:
      '高二的晚风有点凉。你在天台边站着，什么都不做，只让心跳慢下来。',
    effects: {
      sanDelta: 3,
      academicsDelta: 1,
    },
  },
  {
    id: 'rest_common_year3_keep_small',
    weight: 5,
    condition: { minYear: 3 },
    text:
      '高三时你学会把期待变小：今天只完成一件事。做完那件事，疲惫也没那么可怕。',
    effects: {
      sanDelta: 2,
      mainSkillDelta: 1,
      bondDelta: 1,
    },
  },
  {
    id: 'rest_vocal_c1_share_leaf',
    weight: 4,
    mainInstrumentGate: ['vocal'],
    condition: { minYear: 2 },
    text:
      '灯把她夹在书里的叶片给你看，像在展示一段被保存下来的平静。你被这种平静感染，肩膀也松下来。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'rest_guitar_c2_chatty_detour',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    condition: { minYear: 2 },
    text:
      '爱音本来只说“走两步”，结果一路聊到路灯亮。你回过神时，焦虑已经被她拆成了好几段笑声。',
    effects: {
      sanDelta: 3,
      characterFavorDelta: [{ characterId: 'c2', delta: 1 }],
      bondDelta: 1,
    },
  },
  {
    id: 'rest_drums_c3_silent_bench',
    weight: 4,
    mainInstrumentGate: ['drums'],
    condition: { minYear: 2 },
    text:
      '立希在长椅边坐下，没有催你说话。你们安静了很久，却像交换了很多信息。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c3', delta: 1 }],
      npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c3', delta: 1 }],
    },
  },
  {
    id: 'rest_keyboard_c5_warm_water_rule',
    weight: 4,
    mainInstrumentGate: ['keyboard'],
    condition: { minYear: 2 },
    text:
      '祥子把热水推到你手边，说“先活下来再追求完美”。你听着像训话，却刚好被救了一下。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c5', delta: 1 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'rest_common_choices_social_or_alone',
    weight: 4,
    text:
      '今天的休息你想在人群里回血，还是一个人慢慢充电？',
    choices: [
      {
        id: 'rest_choice_social',
        label: '去找人聊天，借热闹回血',
        effects: { sanDelta: 2, bondDelta: 1, academicsDelta: 1 },
      },
      {
        id: 'rest_choice_alone',
        label: '独处散步，把噪音关掉',
        effects: { sanDelta: 3, mainSkillDelta: 1 },
      },
    ],
  },
]

