import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 学习特殊事件池（v2）
 * - 以学业/ SAN 的稳定成长为主
 * - 只在“引入”事件上使用 meetNpcIds，其余只影响主角已 met 的对象
 */
export const STUDY_SPECIAL_EVENT_DEFS: RandomEventDef[] = [
  // -------------------------- 公共学习事件 --------------------------
  {
    id: 'study_common_quiet_focus',
    weight: 10,
    text:
      '你把学习当成一段可重复的呼吸。每翻一页都比前一页更安静。',
    choices: [
      {
        id: 'study_common_quiet_focus_plan',
        label: '按计划推进，稳扎稳打',
        effects: { academicsDelta: 3, sanDelta: 1 },
      },
      {
        id: 'study_common_quiet_focus_push',
        label: '临时加码，多刷两组题',
        effects: { academicsDelta: 4, sanDelta: -1 },
      },
    ],
  },
  {
    id: 'study_common_teacher_note',
    weight: 6,
    text:
      '作业本上多了个“继续”的小字条。你照着做完，反而觉得今天更像成功了一次。',
    choices: [
      {
        id: 'study_common_teacher_note_follow',
        label: '按老师建议补齐薄弱点',
        effects: { academicsDelta: 3, sanDelta: 0 },
      },
      {
        id: 'study_common_teacher_note_keep_rhythm',
        label: '保持节奏，按原计划走',
        effects: { academicsDelta: 2, sanDelta: 1 },
      },
    ],
  },
  {
    id: 'study_common_library_night',
    weight: 4,
    text:
      '图书馆的灯很冷，你却把思绪放进更热的逻辑里。卡住的地方松开了。',
    choices: [
      {
        id: 'study_common_library_night_hard',
        label: '再攻一章难题',
        effects: { academicsDelta: 4, sanDelta: -1 },
      },
      {
        id: 'study_common_library_night_early_stop',
        label: '见好就收，留状态给明天',
        effects: { academicsDelta: 2, sanDelta: 2 },
      },
    ],
  },
  {
    id: 'study_common_group_exchange',
    weight: 5,
    text:
      '你和同学把同一道题拆成两段理解。你负责“为什么”，对方负责“怎么写”，最后两边都变顺。',
    choices: [
      {
        id: 'study_common_group_exchange_explain',
        label: '主动讲解思路，带着大家做',
        effects: { academicsDelta: 3, sanDelta: -1, bondDelta: 1 },
      },
      {
        id: 'study_common_group_exchange_listen',
        label: '先听别人拆题，再补自己的洞',
        effects: { academicsDelta: 2, sanDelta: 1 },
      },
    ],
  },

  // -------------------------- 主修：vocal（c1） --------------------------
  {
    id: 'study_vocal_c1_stone_collect_focus',
    weight: 7,
    mainInstrumentGate: ['vocal'],
    meetNpcIds: ['c1'],
    text:
      '高松灯在你旁边放下一枚不起眼的小东西。她没有劝你别紧张，只是让你把“怕麻烦别人”的心收回到笔尖上。',
    effects: {
      sanDelta: -2,
      academicsDelta: 3,
      characterFavorDelta: [{ characterId: 'c1', delta: 2 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'study_vocal_c1_breathe_and_continue',
    weight: 5,
    mainInstrumentGate: ['vocal'],
    text:
      '你快要写到崩溃，她用极轻的语气提醒你先把呼吸拉回来。你再继续时，答案像自己找到了位置。',
    choices: [
      {
        id: 'study_vocal_c1_breathe_and_continue_pause',
        label: '先做呼吸练习，再继续写',
        effects: { sanDelta: 2, academicsDelta: 1, characterFavorDelta: [{ characterId: 'c1', delta: 1 }] },
      },
      {
        id: 'study_vocal_c1_breathe_and_continue_keep',
        label: '边做题边调整呼吸',
        effects: { sanDelta: 0, academicsDelta: 3, characterFavorDelta: [{ characterId: 'c1', delta: 1 }] },
      },
    ],
  },

  // -------------------------- 主修：guitar（c2 / c4） --------------------------
  {
    id: 'study_guitar_c2_social_question',
    weight: 8,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c2'],
    text:
      '千早爱音把题目推到你面前，像在拉你上场。她问你“为什么”，你解释完反而觉得学业也被点燃了。',
    effects: {
      sanDelta: -1,
      academicsDelta: 3,
      mainSkillDelta: 1,
      characterFavorDelta: [{ characterId: 'c2', delta: 2 }],
    },
  },
  {
    id: 'study_guitar_c2_fast_feedback_loop',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    text:
      '你写完一段就立刻和她对照。她嘴上嫌你慢，实际上每一次纠错都把你带回“更快更对”的轨道。',
    choices: [
      {
        id: 'study_guitar_c2_fast_feedback_loop_speed',
        label: '按爱音节奏快进快改',
        effects: { academicsDelta: 3, sanDelta: -1, characterFavorDelta: [{ characterId: 'c2', delta: 1 }], mainSkillDelta: 1 },
      },
      {
        id: 'study_guitar_c2_fast_feedback_loop_safe',
        label: '放慢一点，确保每步都懂',
        effects: { academicsDelta: 2, sanDelta: 1, characterFavorDelta: [{ characterId: 'c2', delta: 1 }] },
      },
    ],
  },
  {
    id: 'study_guitar_c4_cat_patch_notes',
    weight: 2,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c4'],
    text:
      '要乐奈把你遗漏的例题位置用最小的方式标出来。你惊讶的不是“她知道”，而是“她真的一直在替你守着后路”。',
    effects: {
      sanDelta: -1,
      academicsDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 2 }],
    },
  },
  {
    id: 'study_guitar_c4_quiet_completion',
    weight: 4,
    mainInstrumentGate: ['guitar'],
    text:
      '她不催你，只把你容易分心的点用便签替你盖住。你把这一天的题做完时，心里也更安稳。',
    effects: {
      sanDelta: 1,
      academicsDelta: 3,
      characterFavorDelta: [{ characterId: 'c4', delta: 1 }],
    },
  },

  // -------------------------- 主修：drums（c3） --------------------------
  {
    id: 'study_drums_rikka_checklist',
    weight: 7,
    mainInstrumentGate: ['drums'],
    meetNpcIds: ['c3'],
    text:
      '椎名立希用清单把你的思路切开：哪一步容易漏、哪一步该怎么写。你被她的“标准感”拉回正轨，也更不害怕错。',
    effects: {
      sanDelta: -2,
      academicsDelta: 3,
      characterFavorDelta: [{ characterId: 'c3', delta: 2 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'study_drums_rikka_line_by_line',
    weight: 5,
    mainInstrumentGate: ['drums'],
    text:
      '她不会替你写，但会替你把每一句逻辑变得干净。你感觉自己像被训练成了“不会乱掉的人”。',
    effects: {
      sanDelta: 1,
      academicsDelta: 2,
      characterFavorDelta: [{ characterId: 'c3', delta: 1 }],
    },
  },

  // -------------------------- 主修：keyboard（c5） --------------------------
  {
    id: 'study_keyboard_c5_box_diagrams',
    weight: 7,
    mainInstrumentGate: ['keyboard'],
    meetNpcIds: ['c5'],
    text:
      '丰川祥子把条件画成方格，你一下就看懂了“哪里该怎么用”。她的语气很硬，但你能感觉她在保护你的节奏。',
    effects: {
      academicsDelta: 4,
      sanDelta: 0,
      characterFavorDelta: [{ characterId: 'c5', delta: 2 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'study_keyboard_c5_stubborn_stability',
    weight: 5,
    mainInstrumentGate: ['keyboard'],
    text:
      '你想追求漂亮结果时，她让你先让过程稳定。稳定之后，你的心也不再乱冲。',
    effects: {
      sanDelta: 1,
      academicsDelta: 2,
      characterFavorDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'study_common_exam_week_tunnel',
    weight: 7,
    spawnChanceByStats: [
      { condition: { maxAcademics: 55 }, chance: 0.9 },
      { condition: { minAcademics: 80 }, chance: 0.45 },
    ],
    condition: { minWeekInYear: 14, maxWeekInYear: 20 },
    text:
      '考试周把时间压得很薄。你把计划切成最小单位，一格一格过关。',
    effects: {
      sanDelta: -2,
      academicsDelta: 4,
    },
  },
  {
    id: 'study_common_second_year_load',
    weight: 6,
    condition: { minYear: 2 },
    text:
      '高二的任务量像突然加码。你不再追求一次做完，而是把“可持续”写进了计划。',
    effects: {
      sanDelta: -1,
      academicsDelta: 3,
      mainSkillDelta: 1,
    },
  },
  {
    id: 'study_common_third_year_countdown',
    weight: 5,
    condition: { minYear: 3 },
    text:
      '高三倒计时挂上黑板后，空气都变得更薄。你没有逃，只是把每天都变成一个可完成的小目标。',
    effects: {
      sanDelta: -2,
      academicsDelta: 5,
    },
  },
  {
    id: 'study_vocal_c1_lyric_to_outline',
    weight: 4,
    mainInstrumentGate: ['vocal'],
    condition: { minYear: 2 },
    text:
      '灯把歌词的结构借给你做提纲。你第一次发现“情绪也能服务逻辑”。',
    effects: {
      academicsDelta: 2,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
    },
  },
  {
    id: 'study_guitar_c2_mock_quiz_race',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    condition: { minYear: 2 },
    text:
      '爱音提出“模拟题竞速”，输的人负责复盘。你被她的节奏拖着走，效率却意外变高。',
    effects: {
      sanDelta: -1,
      academicsDelta: 3,
      characterFavorDelta: [{ characterId: 'c2', delta: 1 }],
      npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c2', delta: 1 }],
    },
  },
  {
    id: 'study_drums_c3_precision_revision',
    weight: 4,
    mainInstrumentGate: ['drums'],
    condition: { minYear: 2 },
    text:
      '立希给你做了一套“精修版复查流程”。你按步骤走完，错题像被逐个钉住。',
    effects: {
      sanDelta: -1,
      academicsDelta: 3,
      characterFavorDelta: [{ characterId: 'c3', delta: 1 }],
    },
  },
  {
    id: 'study_keyboard_c5_revision_grid',
    weight: 4,
    mainInstrumentGate: ['keyboard'],
    condition: { minYear: 2 },
    text:
      '祥子把复习内容分成四象限：会的、会一点、不会、容易错。你按格推进，不再被焦虑整片吞掉。',
    effects: {
      sanDelta: 1,
      academicsDelta: 3,
      characterFavorDelta: [{ characterId: 'c5', delta: 1 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'study_common_choices_cram_or_sleep',
    weight: 4,
    text:
      '你看着钟表在“再刷一套题”和“现在去睡”之间犹豫。两种选择都合理，只是代价不同。',
    choices: [
      {
        id: 'study_choice_cram',
        label: '再冲一小时',
        effects: { sanDelta: -3, academicsDelta: 3 },
      },
      {
        id: 'study_choice_sleep',
        label: '现在休息，明天再战',
        effects: { sanDelta: 2, academicsDelta: 1 },
      },
    ],
  },
]

