import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 乐队排练事件池（v2）
 * 设计目标：
 * - 主要角色按主修乐器出现（由 `mainInstrumentGate` 控制）
 * - 新相识（`meetNpcIds`）不要太快：绝大多数事件不带 `meetNpcIds`
 * - 通过 `npcPairIntimacyDelta`（隐性）表达团队摩擦/默契，不触发 met
 */
export const BAND_REHEARSAL_EVENT_DEFS: RandomEventDef[] = [
  // -------------------------- 公共事件（不引入新角色） --------------------------
  {
    id: 'band_common_starts_together',
    weight: 8,
    text:
      '排练室的灯一亮，你们下意识把呼吸对齐。明明没人开口，却像同一秒里做了同样的决定。',
    choices: [
      {
        id: 'band_common_starts_together_warmup',
        label: '先做短热身，再进正段',
        effects: {
          sanDelta: 1,
          bondDelta: 2,
          npcPairIntimacyDelta: [
            { npcIdA: 'c1', npcIdB: 'c2', delta: 1 },
            { npcIdA: 'c3', npcIdB: 'c4', delta: 1 },
          ],
        },
      },
      {
        id: 'band_common_starts_together_direct',
        label: '直接开整，先抓状态',
        effects: { sanDelta: -1, bondDelta: 1, mainSkillDelta: 2 },
      },
    ],
  },
  {
    id: 'band_common_messy_but_fixed',
    weight: 6,
    text:
      '中途换段时乱了一拍，但乱的不是你们的心。谁先停下来谁就先把大家拉回节奏。',
    choices: [
      {
        id: 'band_common_messy_but_fixed_repeat',
        label: '原速重来，先修衔接点',
        effects: { sanDelta: -1, mainSkillDelta: 2, bondDelta: 1 },
      },
      {
        id: 'band_common_messy_but_fixed_slow',
        label: '降速重排，确保每个人都跟上',
        effects: { sanDelta: 1, bondDelta: 2, mainSkillDelta: 1 },
      },
    ],
  },
  {
    id: 'band_common_post_rehearsal_hum',
    weight: 5,
    text:
      '排练结束后你们没有立刻散开。有人把“下次从哪里开始”说得很轻，但每一句都落在点上。',
    effects: {
      sanDelta: 1,
      bondDelta: 2,
      academicsDelta: 1,
    },
  },
  {
    id: 'band_common_quiet_after_interrupt',
    weight: 4,
    text:
      '麦克风轻微反馈，你们先沉默两秒才继续。不是谁逞强，是你们都选择了“把问题变小”。',
    effects: {
      sanDelta: 0,
      bondDelta: 1,
      npcPairIntimacyDelta: [{ npcIdA: 'c2', npcIdB: 'c5', delta: 1 }],
    },
  },

  // -------------------------- 主修：vocal（c1） --------------------------
  {
    id: 'band_vocal_c1_stone_tapes',
    weight: 7,
    mainInstrumentGate: ['vocal'],
    meetNpcIds: ['c1'],
    text:
      '高松灯把一小段“可重复的走位”写在卡片边缘。你注意到她手里也握着点什么——像是给自己留的安全垫。',
    effects: {
      sanDelta: -2,
      bondDelta: 1,
      mainSkillDelta: 1,
      characterFavorDelta: [{ characterId: 'c1', delta: 2 }],
    },
  },
  {
    id: 'band_vocal_c1_soft_improv',
    weight: 5,
    mainInstrumentGate: ['vocal'],
    text:
      '她没有把即兴说出口，只是用更轻的尾音告诉你“可以这样”。你跟上之后，紧张像被温柔地按住了。',
    choices: [
      {
        id: 'band_vocal_c1_soft_improv_follow',
        label: '跟她的即兴尾音走',
        effects: {
          sanDelta: -1,
          bondDelta: 1,
          mainSkillDelta: 2,
          characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
        },
      },
      {
        id: 'band_vocal_c1_soft_improv_keep',
        label: '坚持原编排，优先稳定',
        effects: { sanDelta: 1, bondDelta: 1, mainSkillDelta: 1 },
      },
    ],
  },
  {
    id: 'band_vocal_c1_quiet_recover',
    weight: 4,
    mainInstrumentGate: ['vocal'],
    text:
      '你快要把“会不会拖后腿”写在眼睛里时，她先让你把呼吸放平。接下来每一次进入点都更稳了。',
    effects: {
      sanDelta: 2,
      bondDelta: 1,
      characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
      mainSkillDelta: 1,
    },
  },

  // -------------------------- 主修：guitar（c2 + 少量 c4） --------------------------
  {
    id: 'band_guitar_c2_push_forward',
    weight: 8,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c2'],
    text:
      '千早爱音先把尴尬笑散，然后直接把你推到节拍器旁。她说“别想太多，先做一遍再说”。',
    effects: {
      sanDelta: -1,
      bondDelta: 2,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c2', delta: 2 }],
    },
  },
  {
    id: 'band_guitar_c2_not_stuck',
    weight: 6,
    mainInstrumentGate: ['guitar'],
    text:
      '你卡住的那个段落，她不是教你技巧，而是教你“怎么迈过去”。你越顺，她越像放松了下来。',
    choices: [
      {
        id: 'band_guitar_c2_not_stuck_jump',
        label: '按她说的先“迈过去”',
        effects: { bondDelta: 1, mainSkillDelta: 2, characterFavorDelta: [{ characterId: 'c2', delta: 1 }] },
      },
      {
        id: 'band_guitar_c2_not_stuck_split',
        label: '先把难段拆开慢练',
        effects: { sanDelta: 1, mainSkillDelta: 1, characterFavorDelta: [{ characterId: 'c2', delta: 1 }] },
      },
    ],
  },
  {
    id: 'band_guitar_c4_cat_patch',
    weight: 2,
    mainInstrumentGate: ['guitar'],
    meetNpcIds: ['c4'],
    text:
      '要乐奈像突然出现的影子一样，把你们最容易走神的地方贴了一小块便签。你才意识到她从来都在提前“改好后路”。',
    effects: {
      sanDelta: -1,
      bondDelta: 1,
      mainSkillDelta: 1,
      characterFavorDelta: [{ characterId: 'c4', delta: 2 }],
    },
  },
  {
    id: 'band_guitar_c4_detail_safe',
    weight: 4,
    mainInstrumentGate: ['guitar'],
    text:
      '她不多话，只在你最用力的那一下提醒你“先别绷”。于是你们的段落接得更像一条线。',
    effects: {
      sanDelta: 1,
      bondDelta: 1,
      mainSkillDelta: 1,
      characterFavorDelta: [{ characterId: 'c4', delta: 1 }],
    },
  },
  {
    id: 'band_guitar_group_tension_no_meeting',
    weight: 4,
    mainInstrumentGate: ['guitar'],
    text:
      '爱音想升级编排，立希却要先打稳基本盘。你没有站队，而是把分歧拆成两步：先对齐，再升级。',
    effects: {
      sanDelta: -1,
      bondDelta: 1,
      npcPairIntimacyDelta: [{ npcIdA: 'c2', npcIdB: 'c3', delta: 2 }],
    },
  },

  // -------------------------- 主修：drums（c3） --------------------------
  {
    id: 'band_drums_c3_check_and_protect',
    weight: 7,
    mainInstrumentGate: ['drums'],
    meetNpcIds: ['c3'],
    text:
      '椎名立希直接把“下一次怎么做”写成句子塞进你手里。她说话很硬，但每个措辞都像护着高松灯不被牵连。',
    effects: {
      sanDelta: -2,
      bondDelta: 1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c3', delta: 2 }],
    },
  },
  {
    id: 'band_drums_c3_clean_timing',
    weight: 5,
    mainInstrumentGate: ['drums'],
    text:
      '你以为她会继续挑刺，结果她只是让你把节拍咬住。下一遍你听见自己的鼓点在“对齐”。',
    choices: [
      {
        id: 'band_drums_c3_clean_timing_hold',
        label: '咬住节拍，先求整齐',
        effects: { sanDelta: 1, bondDelta: 1, mainSkillDelta: 2, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
      {
        id: 'band_drums_c3_clean_timing_attack',
        label: '在整齐基础上再提攻击性',
        effects: { sanDelta: -2, bondDelta: 1, mainSkillDelta: 3, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
    ],
  },
  {
    id: 'band_drums_c3_teach_scaffolding',
    weight: 4,
    mainInstrumentGate: ['drums'],
    text:
      '她没有给你答案，只给你一个阶梯：先做第一步，再做第二步。你爬上去的时候，她的表情也松了一点。',
    effects: {
      sanDelta: -1,
      bondDelta: 2,
      npcPairIntimacyDelta: [{ npcIdA: 'c3', npcIdB: 'c1', delta: 2 }],
      characterFavorDelta: [{ characterId: 'c3', delta: 1 }],
    },
  },

  // -------------------------- 主修：keyboard（c5） --------------------------
  {
    id: 'band_keyboard_c5_tuning_path',
    weight: 6,
    mainInstrumentGate: ['keyboard'],
    meetNpcIds: ['c5'],
    text:
      '丰川祥子把参数按顺序推到正确区间。她很果决，但你能感觉到她一直在替大家“把脆弱藏好”。',
    effects: {
      sanDelta: -1,
      bondDelta: 1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c5', delta: 2 }],
    },
  },
  {
    id: 'band_keyboard_c5_stable_progress',
    weight: 5,
    mainInstrumentGate: ['keyboard'],
    text:
      '你急着把结果做漂亮时，她提醒你先让系统稳定。稳定之后，连你自己都更愿意往前。',
    choices: [
      {
        id: 'band_keyboard_c5_stable_progress_keep',
        label: '继续稳态推进',
        effects: { sanDelta: 1, bondDelta: 1, mainSkillDelta: 1, characterFavorDelta: [{ characterId: 'c5', delta: 1 }] },
      },
      {
        id: 'band_keyboard_c5_stable_progress_risk',
        label: '尝试更激进的层次变化',
        effects: { sanDelta: -2, bondDelta: 1, mainSkillDelta: 2, characterFavorDelta: [{ characterId: 'c5', delta: 1 }] },
      },
    ],
  },
  {
    id: 'band_common_year2_stage_prep',
    weight: 6,
    condition: { minYear: 2 },
    text:
      '高二后你们开始把“练完就散”改成“练完复盘”。每次复盘都不长，却慢慢把你们绑在同一条线上。',
    effects: {
      sanDelta: -1,
      bondDelta: 2,
      mainSkillDelta: 1,
    },
  },
  {
    id: 'band_common_year3_precision_mode',
    weight: 5,
    condition: { minYear: 3 },
    text:
      '高三的排练没有太多废话。你们只盯最容易出错的三秒，直到它们稳定得像呼吸。',
    effects: {
      sanDelta: -2,
      bondDelta: 2,
      mainSkillDelta: 2,
    },
  },
  {
    id: 'band_vocal_c1_lyric_anchor',
    weight: 4,
    mainInstrumentGate: ['vocal'],
    condition: { minYear: 2 },
    text:
      '灯把一句歌词写在最显眼的位置，提醒你们“为什么要唱这首”。你们的进入点一下变得更有方向。',
    effects: {
      sanDelta: -1,
      bondDelta: 1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c1', delta: 1 }],
    },
  },
  {
    id: 'band_guitar_c2_stage_mock',
    weight: 5,
    mainInstrumentGate: ['guitar'],
    condition: { minYear: 2 },
    text:
      '爱音坚持把排练当成“模拟上台”，连转身和停顿都要走位。你嫌麻烦，但结束时不得不承认确实有效。',
    effects: {
      sanDelta: -1,
      bondDelta: 2,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c2', delta: 1 }],
    },
  },
  {
    id: 'band_drums_c3_hard_reset',
    weight: 4,
    mainInstrumentGate: ['drums'],
    condition: { minYear: 2 },
    text:
      '立希直接喊停，说这遍“不算”，然后从第一小节重来。你们被她逼着重置，反而更快进入状态。',
    effects: {
      sanDelta: -2,
      bondDelta: 2,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c3', delta: 1 }],
    },
  },
  {
    id: 'band_keyboard_c5_layer_balance',
    weight: 4,
    mainInstrumentGate: ['keyboard'],
    condition: { minYear: 2 },
    text:
      '祥子把每层音色往中间拢，让主旋律终于“浮”出来。你们第一次听到完整编排的轮廓。',
    effects: {
      sanDelta: -1,
      bondDelta: 1,
      mainSkillDelta: 2,
      characterFavorDelta: [{ characterId: 'c5', delta: 1 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'band_common_choice_keep_or_change_arrange',
    weight: 4,
    involvedNpcIds: ['c2', 'c3', 'c5'],
    coappearIntimacyDelta: 1,
    bondUnlock: { minBond: 25, maxChance: 0.8 },
    text:
      '你们对当前编排意见分裂：继续打磨现有版本，还是大胆换一版再赌一次？',
    choices: [
      {
        id: 'band_choice_keep',
        label: '继续打磨现有版本',
        effects: { sanDelta: -1, bondDelta: 2, mainSkillDelta: 1 },
      },
      {
        id: 'band_choice_change',
        label: '换新编排，赌一次上限',
        effects: { sanDelta: -3, bondDelta: 1, mainSkillDelta: 3 },
        probabilisticFollowups: [{ chance: 0.35, eventIds: ['forced_conflict_review'] }],
      },
    ],
  },
  {
    id: 'band_common_pair_growth_hidden',
    weight: 3,
    condition: { minYear: 2 },
    text:
      '你注意到原本最容易杠起来的两个人，这次在关键处居然自己对上了眼神。你没说破，只记在心里。',
    effects: {
      sanDelta: 1,
      bondDelta: 1,
      npcPairIntimacyDelta: [{ npcIdA: 'c2', npcIdB: 'c3', delta: 2 }],
    },
  },
  // -------------------------- 乐器排练/演出相关（仅在已加入乐队时出现） --------------------------
  {
    id: 'school_festival_prep',
    weight: 6,
    meetNpcIds: ['c2'],
    involvedNpcIds: ['c1', 'c2', 'c3'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 20, maxChance: 0.9 },
    text:
      '校庆彩排通知占掉周末半天。群里不停 @全体成员，服装、走位、音量条改了三版。你看到「待定」两个字就有点缺氧。',
    condition: { minAbsoluteWeek: 12 },
    choices: [
      {
        id: 'commit',
        label: '认真跟完彩排，顺路记了点舞台经验',
        effects: { sanDelta: -7, mainSkillDelta: 2, academicsDelta: -2 },
        probabilisticFollowups: [{ chance: 0.4, eventIds: ['forced_stage_supply_run'] }],
      },
      {
        id: 'skip_half',
        label: '请假早退一小时，守住自己的练习时间',
        effects: { sanDelta: -3, mainSkillDelta: 3 },
      },
      {
        id: 'bond',
        label: '留下来帮同学搬道具，攒点人情',
        effects: {
          sanDelta: -4,
          npcPairIntimacyDelta: [{ npcIdA: 'c2', npcIdB: 'c3', delta: 3 }],
          npcSpecialtySkillDelta: [{ characterId: 'c2', delta: 1 }],
        },
      },
    ],
  },
  {
    id: 'crossband_rhythm_exchange',
    weight: 4,
    condition: { minYear: 2, minMainSkill: 35 },
    meetNpcIds: ['btr_nijika', 'kon_ritsu', 'gbc_subaru'],
    involvedNpcIds: ['btr_nijika', 'kon_ritsu', 'gbc_subaru'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 30, maxChance: 0.75 },
    text: '体育课分组游戏里，三位同学提出“同一口令三种节奏拍法”。你选择记录分析还是直接参与？',
    choices: [
      {
        id: 'crossband_rhythm_record',
        label: '记录对比，整理成可复用笔记',
        effects: {
          academicsDelta: 2,
          mainSkillDelta: 1,
          characterFavorDelta: [{ characterId: 'btr_nijika', delta: 1 }],
        },
      },
      {
        id: 'crossband_rhythm_play',
        label: '直接参与，边错边改',
        effects: {
          sanDelta: -2,
          mainSkillDelta: 2,
          characterFavorDelta: [{ characterId: 'gbc_subaru', delta: 2 }],
        },
      },
    ],
  },
  {
    id: 'crossband_bass_walk',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['btr_ryo', 'ave_umiri', 'kon_mio'],
    involvedNpcIds: ['btr_ryo', 'ave_umiri', 'kon_mio'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 28, maxChance: 0.75 },
    text: '午饭排队时你们在聊“同一首歌低频为什么听感不同”。你会用理论解释还是用听感比喻？',
    choices: [
      {
        id: 'crossband_bass_theory',
        label: '按和声理论选线条',
        effects: {
          academicsDelta: 2,
          mainSkillDelta: 1,
          characterFavorDelta: [{ characterId: 'kon_mio', delta: 1 }],
        },
      },
      {
        id: 'crossband_bass_ear',
        label: '按听感选线条',
        effects: {
          sanDelta: 1,
          mainSkillDelta: 2,
          characterFavorDelta: [{ characterId: 'btr_ryo', delta: 2 }],
        },
      },
    ],
  },
  {
    id: 'crossband_vocal_retake',
    weight: 4,
    meetNpcIds: ['ave_uika', 'gbc_nina', 'kon_yui'],
    involvedNpcIds: ['ave_uika', 'gbc_nina', 'kon_yui'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 26, maxChance: 0.8 },
    text: '广播站午间录音一段口播重来三次还不顺。你建议“再冲一次”还是“先停五分钟重置”？',
    choices: [
      {
        id: 'crossband_vocal_push',
        label: '再冲一次，趁情绪还在',
        effects: {
          sanDelta: -2,
          mainSkillDelta: 2,
          characterFavorDelta: [{ characterId: 'gbc_nina', delta: 2 }],
        },
      },
      {
        id: 'crossband_vocal_reset',
        label: '先重置，再录关键句',
        effects: {
          sanDelta: 2,
          characterFavorDelta: [{ characterId: 'ave_uika', delta: 1 }],
          bondDelta: 1,
        },
      },
    ],
  },
  {
    id: 'crossband_keyboard_layers',
    weight: 3,
    condition: { minYear: 2, minAcademics: 25 },
    meetNpcIds: ['ave_sakiko', 'kon_tsumugi', 'gbc_tomo'],
    involvedNpcIds: ['ave_sakiko', 'kon_tsumugi', 'gbc_tomo'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 32, maxChance: 0.7 },
    text: '信息课小组在争论展示页配色该先做“空间感”还是“信息衬底”。你支持哪种方案？',
    choices: [
      {
        id: 'crossband_keyboard_space',
        label: '先做空间，让主旋律浮出来',
        effects: {
          mainSkillDelta: 2,
          characterFavorDelta: [{ characterId: 'ave_sakiko', delta: 1 }],
        },
      },
      {
        id: 'crossband_keyboard_support',
        label: '先做衬底，保证整体稳定',
        effects: {
          academicsDelta: 1,
          bondDelta: 1,
          characterFavorDelta: [{ characterId: 'kon_tsumugi', delta: 1 }],
        },
      },
    ],
  },
]

