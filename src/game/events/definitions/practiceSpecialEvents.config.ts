import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 练习特殊事件池（v2）
 * - 主轴：主修技能主成长（mainSkill）
 * - SAN 作为代价/回暖的节奏控制
 * - met 引入控制：只有少数事件带 meetNpcIds
 */
export const PRACTICE_SPECIAL_EVENT_DEFS: RandomEventDef[] = [
  // -------------------------- 公共练习事件 --------------------------
  {
    id: 'practice_common_timing_anchor',
    weight: 9,
    text:
      '你把最基础的节拍练到能“闭着眼也不跑”。然后你才敢往上加花。',
    choices: [
      {
        id: 'practice_common_timing_anchor_slow',
        label: '继续慢速打底',
        effects: { sanDelta: 1, mainSkillDelta: 2 },
      },
      {
        id: 'practice_common_timing_anchor_faster',
        label: '提速试一次上限',
        effects: { sanDelta: -1, mainSkillDelta: 3 },
      },
    ],
  },
  {
    id: 'practice_common_stop_overthinking',
    weight: 6,
    text:
      '你强迫自己在关键段落停半秒。不是逃避，是给下一次留空间。',
    choices: [
      {
        id: 'practice_common_stop_overthinking_break',
        label: '先停半分钟重置手感',
        effects: { sanDelta: 2, mainSkillDelta: 1 },
      },
      {
        id: 'practice_common_stop_overthinking_keep',
        label: '不停手，趁热打通',
        effects: { sanDelta: -1, mainSkillDelta: 2 },
      },
    ],
  },
  {
    id: 'practice_common_micro_adjust',
    weight: 5,
    text:
      '你把“差一点”拆成一连串微调。每个小改动都让整段更像同一条线。',
    choices: [
      {
        id: 'practice_common_micro_adjust_detail',
        label: '继续微调每个细节',
        effects: { sanDelta: -1, mainSkillDelta: 2 },
      },
      {
        id: 'practice_common_micro_adjust_fullrun',
        label: '直接整段跑一遍',
        effects: { sanDelta: -2, mainSkillDelta: 3 },
      },
    ],
  },

  // -------------------------- 主修：vocal（c1） --------------------------
  {
    id: 'practice_vocal_c1_breathe_before_sing',
    weight: 7,
    mainInstrumentGate: ['vocal'],
    meetNpcIds: ['c1'],
    text:
      '高松灯让你先把呼吸练到不会慌。你再开口时，音准像是被她的温柔托住了。',
    effects: {
      sanDelta: -2,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c1', delta: 2 }],
    },
  },
  {
    id: 'practice_vocal_c1_tail_control',
    weight: 5,
    mainInstrumentGate: ['vocal'],
    text:
      '她不大声指挥，只在你尾音最容易飘的时候轻轻校正。你发现“收住”也能更自由。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
    },
  },

  // -------------------------- 主修：guitar（c2 / c4） --------------------------
  {
    id: 'practice_guitar_c2_just_do_it',
    weight: 8,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c2'],
    text:
      '爱音不给你犹豫太久，她把你拉到谱子前“先做一遍”。你做得越顺，她越像在偷笑。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c2', delta: 2 }],
    },
  },
  {
    id: 'practice_guitar_c2_feedback_whack_a_mole',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    text:
      '你哪里卡住她就哪里盯着，但盯的是“下一步”。你逐渐学会把失误当成下一次的提示。',
    choices: [
      {
        id: 'practice_guitar_c2_feedback_whack_a_mole_follow',
        label: '按她标的错点逐个清掉',
        effects: { sanDelta: 0, mainSkillDelta: 2, characterFavorDelta: [{ characterId: 'c2', delta: 1 }] },
      },
      {
        id: 'practice_guitar_c2_feedback_whack_a_mole_trynew',
        label: '先试新段，再回头修错',
        effects: { sanDelta: -1, mainSkillDelta: 3, characterFavorDelta: [{ characterId: 'c2', delta: 1 }] },
      },
    ],
  },
  {
    id: 'practice_guitar_c4_cat_tuning',
    weight: 2,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c4'],
    text:
      '要乐奈把调音器递给你时像从空气里冒出来。她只说一句“别绷太久”，你就不再乱用力。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 2 }],
      npcSpecialtySkillDelta: [{ characterId: 'c4', delta: 1 }],
    },
  },
  {
    id: 'practice_guitar_c4_pick_consistency',
    weight: 4,
    mainInstrumentGate: ['guitar'],
    text:
      '你把拨弦的一致性练出来之后，她才真正点头。那点头像在肯定你的“稳定”，不是你的“快”。',
    effects: {
      sanDelta: 1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 1 }],
    },
  },

  // -------------------------- 主修：drums（c3） --------------------------
  {
    id: 'practice_drums_rikka_strict_speed',
    weight: 7,
    mainInstrumentGate: ['drums'],
    meetNpcIds: ['c3'],
    text:
      '椎名立希把速度调得“刻薄”，但她只盯同一个点：你要咬住节拍。你照做之后，手腕反而不再发抖。',
    effects: {
      sanDelta: -2,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c3', delta: 2 }],
    },
  },
  {
    id: 'practice_drums_rikka_breakdown',
    weight: 5,
    mainInstrumentGate: ['drums'],
    text:
      '她不温柔，但她把问题拆得很干净。你跟着分解一遍，再合上时就顺了。',
    choices: [
      {
        id: 'practice_drums_rikka_breakdown_steps',
        label: '照分解步骤慢慢合上',
        effects: { sanDelta: 1, mainSkillDelta: 2, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
      {
        id: 'practice_drums_rikka_breakdown_hard',
        label: '直接整段硬合，错了再重来',
        effects: { sanDelta: -2, mainSkillDelta: 3, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
    ],
  },

  // -------------------------- 主修：keyboard（c5） --------------------------
  {
    id: 'practice_keyboard_c5_micro_tune',
    weight: 7,
    mainInstrumentGate: ['keyboard'],
    meetNpcIds: ['c5'],
    text:
      '丰川祥子让你只改一个参数。你调着调着就发现：稳定本身就是你想要的“答案”。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c5', delta: 2 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 2 }],
    },
  },
  {
    id: 'practice_keyboard_c5_dont_rush',
    weight: 5,
    mainInstrumentGate: ['keyboard'],
    text:
      '你急着把结果做得漂亮时，她提醒你先把系统稳住。你慢下来之后，音色反而更有力量。',
    choices: [
      {
        id: 'practice_keyboard_c5_dont_rush_stable',
        label: '继续稳态推进',
        effects: { sanDelta: 1, mainSkillDelta: 2, characterFavorDelta: [{ characterId: 'c5', delta: 1 }] },
      },
      {
        id: 'practice_keyboard_c5_dont_rush_peak',
        label: '冒险冲一次峰值参数',
        effects: { sanDelta: -2, mainSkillDelta: 3, characterFavorDelta: [{ characterId: 'c5', delta: 1 }] },
      },
    ],
  },
  {
    id: 'practice_common_year2_plateau',
    weight: 6,
    spawnChanceByStats: [
      { condition: { maxMainSkill: 55 }, chance: 0.88 },
      { condition: { minMainSkill: 80 }, chance: 0.35 },
    ],
    condition: { minYear: 2 },
    text:
      '高二的练习像撞上平台期。你没法一口气突破，只能把每个细节慢慢磨亮。',
    effects: {
      sanDelta: -2,
      mainSkillDelta: 3,
    },
  },
  {
    id: 'practice_common_year3_polish',
    weight: 5,
    condition: { minYear: 3 },
    text:
      '高三的你不再追“惊艳”，而是追“稳定到不会掉”。每一次重复都更像完成版。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 4,
      bondDelta: 1,
    },
  },
  {
    id: 'practice_vocal_c1_fragile_but_forward',
    weight: 4,
    mainInstrumentGate: ['vocal'],
    condition: { minYear: 2 },
    text:
      '灯也会在高音前犹豫，但她总会再试一次。你被她的“脆弱仍向前”感染，嗓子也更敢用力。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
      npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c3', delta: 1 }],
    },
  },
  {
    id: 'practice_guitar_c2_stage_pose',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    condition: { minYear: 2 },
    text:
      '爱音连姿势都要你练：站位、转身、抬手。你本以为花哨，结果发现这真的影响演奏稳定。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c2', delta: 1 }],
      bondDelta: 1,
    },
  },
  {
    id: 'practice_guitar_c4_minimal_words',
    weight: 3,
    mainInstrumentGate: ['guitar'],
    condition: { minYear: 2 },
    text:
      '乐奈几乎不解释，只把你的手指挪到更省力的位置。你照着做，突然明白“少说话也能教会人”。',
    effects: {
      sanDelta: 1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 1 }],
    },
  },
  {
    id: 'practice_drums_c3_burst_then_control',
    weight: 4,
    mainInstrumentGate: ['drums'],
    condition: { minYear: 2 },
    text:
      '立希让你先全力打一遍，再马上压回稳定速度。你第一次感到“控制”比“爆发”更难也更有用。',
    effects: {
      sanDelta: -2,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c3', delta: 1 }],
    },
  },
  {
    id: 'practice_keyboard_c5_layer_build',
    weight: 4,
    mainInstrumentGate: ['keyboard'],
    condition: { minYear: 2 },
    text:
      '祥子让你从单层音色开始逐层叠加。你像搭积木一样把整首歌搭稳。',
    effects: {
      sanDelta: -1,
      mainSkillDelta: 3,
      characterFavorDelta: [{ characterId: 'c5', delta: 1 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'practice_common_choices_push_or_reset',
    weight: 4,
    text:
      '这段怎么练都不顺。你可以硬推到底，也可以停下来从慢速重建。',
    choices: [
      {
        id: 'practice_push',
        label: '硬推一把，先过再说',
        effects: { sanDelta: -3, mainSkillDelta: 3 },
      },
      {
        id: 'practice_reset',
        label: '降速重建，重新打底',
        effects: { sanDelta: -1, mainSkillDelta: 2, academicsDelta: 1 },
      },
    ],
  },
]

