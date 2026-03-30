import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 乐队团建事件池（v2）
 * 规则：只应出现“已入队成员”相关事件（由 store 的 band-member 过滤保证）
 */
export const BAND_HANGOUT_EVENT_DEFS: RandomEventDef[] = [
  {
    id: 'hangout_common_meal_table',
    weight: 8,
    text:
      '你们围着一张挤挤的桌子吃晚饭。聊着聊着，原本尴尬的沉默也变成了可以共享的停顿。',
    choices: [
      {
        id: 'hangout_common_meal_table_light',
        label: '聊轻松话题，先让气氛暖起来',
        effects: { sanDelta: 2, bondDelta: 2 },
      },
      {
        id: 'hangout_common_meal_table_nextplan',
        label: '边吃边对齐下次安排',
        effects: { sanDelta: 1, bondDelta: 2, academicsDelta: 1 },
      },
    ],
  },
  {
    id: 'hangout_c1_quiet_support',
    weight: 5,
    text:
      '高松灯在你话说到一半时轻轻接上后半句。你突然没那么害怕“说错了”。',
    choices: [
      {
        id: 'hangout_c1_quiet_support_reply',
        label: '顺着她的话继续说下去',
        effects: { sanDelta: 2, bondDelta: 1, characterFavorDelta: [{ characterId: 'c1', delta: 2 }] },
      },
      {
        id: 'hangout_c1_quiet_support_thanks',
        label: '轻声道谢，换个话题缓冲',
        effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'c1', delta: 2 }], bondDelta: 2 },
      },
    ],
  },
  {
    id: 'hangout_c2_plan_next_live',
    weight: 6,
    text:
      '爱音把手机翻到备忘录，连下次排练到演出的小目标都排好。她笑着说“先写下来才会发生”。',
    choices: [
      {
        id: 'hangout_c2_plan_next_live_detail',
        label: '把目标拆到每周任务',
        effects: { sanDelta: 0, bondDelta: 2, characterFavorDelta: [{ characterId: 'c2', delta: 2 }], academicsDelta: 2 },
      },
      {
        id: 'hangout_c2_plan_next_live_morale',
        label: '先定一个轻松可达的小目标',
        effects: { sanDelta: 2, bondDelta: 2, characterFavorDelta: [{ characterId: 'c2', delta: 1 }] },
      },
    ],
  },
  {
    id: 'hangout_c3_guard_line',
    weight: 5,
    text:
      '立希嘴上嫌你们散漫，手上却把路线和时间都安排好。你意识到她在用最硬的方式保护这个团体。',
    choices: [
      {
        id: 'hangout_c3_guard_line_follow',
        label: '照她安排执行，先稳住团队',
        effects: { sanDelta: 1, bondDelta: 2, characterFavorDelta: [{ characterId: 'c3', delta: 2 }] },
      },
      {
        id: 'hangout_c3_guard_line_adjust',
        label: '提出一处调整，优化节奏',
        effects: { sanDelta: 0, bondDelta: 3, characterFavorDelta: [{ characterId: 'c3', delta: 1 }] },
      },
    ],
  },
  {
    id: 'hangout_c4_cat_break',
    weight: 4,
    text:
      '乐奈忽然把你们带到一条没什么人的小路，像猫一样在前面带路。没有宏大目标，只是大家都松了一口气。',
    effects: {
      sanDelta: 2,
      bondDelta: 1,
      characterFavorDelta: [{ characterId: 'c4', delta: 2 }],
    },
  },
  {
    id: 'hangout_c5_balance_tone',
    weight: 4,
    condition: { minYear: 2 },
    text:
      '祥子把“各说各话”的气氛慢慢调平。你们最后不是谁赢了，而是每个人都能把话说完整。',
    effects: {
      sanDelta: 1,
      bondDelta: 2,
      characterFavorDelta: [{ characterId: 'c5', delta: 2 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'hangout_common_river_walk',
    weight: 6,
    condition: { minYear: 2 },
    text:
      '晚自习后你们绕去河边散步。没人谈大道理，只把这一周的疲惫一点点放进风里。',
    effects: {
      sanDelta: 2,
      bondDelta: 2,
      npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c3', delta: 1 }],
    },
  },
  {
    id: 'hangout_common_bad_joke',
    weight: 5,
    text:
      '有人讲了个很冷的笑话，第一秒没人笑，第二秒却一起笑出声。尴尬被你们当场收编成了默契。',
    choices: [
      {
        id: 'hangout_common_bad_joke_join',
        label: '接梗把气氛推高',
        effects: { sanDelta: 2, bondDelta: 2 },
      },
      {
        id: 'hangout_common_bad_joke_note',
        label: '记下这个梗，留到下次舞台',
        effects: { sanDelta: 1, bondDelta: 1, mainSkillDelta: 1 },
      },
    ],
  },
  {
    id: 'hangout_c1_words_on_napkin',
    weight: 4,
    text:
      '灯在餐巾纸背面写下一句歌词，写完又想藏起来。你接过来看，她才承认“今天其实没有那么糟”。',
    effects: {
      sanDelta: 2,
      bondDelta: 1,
      characterFavorDelta: [{ characterId: 'c1', delta: 2 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'hangout_c2_photo_dump',
    weight: 5,
    text:
      '爱音把今天拍的照片一张张翻给你看，从最丑的一张开始笑。她说“丑也要存着”，因为那才像真实的一天。',
    effects: {
      sanDelta: 1,
      bondDelta: 2,
      characterFavorDelta: [{ characterId: 'c2', delta: 2 }],
    },
  },
  {
    id: 'hangout_c3_route_rebuild',
    weight: 4,
    text:
      '立希拿出一张纸重新排了下周路线。你以为是命令，结果她把最难的一段留给了自己。',
    effects: {
      sanDelta: 1,
      bondDelta: 2,
      characterFavorDelta: [{ characterId: 'c3', delta: 2 }],
      npcPairIntimacyDelta: [{ npcIdA: 'c2', npcIdB: 'c3', delta: 1 }],
    },
  },
  {
    id: 'hangout_c4_matcha_detour',
    weight: 3,
    condition: { minYear: 2 },
    text:
      '乐奈把你们带去一间只卖抹茶的小店。她几乎没说话，却在你们聊到卡壳时精准插进一句，刚好让对话继续。',
    effects: {
      sanDelta: 2,
      bondDelta: 1,
      characterFavorDelta: [{ characterId: 'c4', delta: 2 }],
    },
  },
  {
    id: 'hangout_c5_late_night_score',
    weight: 3,
    condition: { minYear: 2, minBond: 20 },
    text:
      '祥子把团建尾声变成“试一页新谱”的小游戏。她看似严苛，却让每个人都保留了可以犯错的空间。',
    effects: {
      sanDelta: 1,
      bondDelta: 3,
      characterFavorDelta: [{ characterId: 'c5', delta: 2 }],
      npcSpecialtySkillDelta: [{ characterId: 'c5', delta: 1 }],
    },
  },
  {
    id: 'hangout_common_choices_weekend',
    weight: 4,
    text:
      '周末安排出现分歧：要么留出半天休息，要么趁热继续练。你们决定把选择写下来再投票。',
    choices: [
      {
        id: 'hangout_rest_weekend',
        label: '先把状态养好，再冲下一周',
        effects: { sanDelta: 3, bondDelta: 1 },
      },
      {
        id: 'hangout_grind_weekend',
        label: '趁状态还在，继续练习',
        effects: { sanDelta: -2, bondDelta: 2, mainSkillDelta: 2 },
      },
    ],
  },
  // -------------------------- 扩展作品联动（仅在已加入乐队时出现） --------------------------
  {
    id: 'band_first_quarrel',
    weight: 5,
    involvedNpcIds: ['c1', 'c2', 'c3'],
    coappearIntimacyDelta: 1,
    bondUnlock: { minBond: 22, maxChance: 0.75 },
    text:
      '社团活动分工会上，主导顺序和职责边界吵成一团。没人拍桌，但每句话都越来越硬，气氛迅速降温。',
    condition: { minBond: 15 },
    choices: [
      {
        id: 'mediate',
        label: '提议先冷静，把分歧写成清单再讨论',
        effects: { sanDelta: -3, bondDelta: 4 },
      },
      {
        id: 'side',
        label: '不自觉站队，顺着话头继续加码',
        effects: { sanDelta: -6, bondDelta: -4, npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c2', delta: -2 }] },
        followupEventIds: ['forced_conflict_review'],
      },
      {
        id: 'silent',
        label: '暂时沉默，先让会场降温',
        effects: { sanDelta: -4, bondDelta: -1 },
      },
    ],
  },
  {
    id: 'collab_btr_corridor_duo',
    weight: 5,
    meetNpcIds: ['btr_hitori', 'btr_kita'],
    involvedNpcIds: ['btr_hitori', 'btr_kita'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 18, maxChance: 0.8 },
    text: '午休时你在走廊碰到后藤一里和喜多郁代在讨论一段歌单排序。你要直接给建议，还是先听她们把理由说完？',
    choices: [
      {
        id: 'collab_btr_join',
        label: '直接给出你的排序建议',
        effects: {
          sanDelta: 0,
          academicsDelta: 1,
          characterFavorDelta: [
            { characterId: 'btr_hitori', delta: 2 },
            { characterId: 'btr_kita', delta: 2 },
          ],
        },
      },
      {
        id: 'collab_btr_listen',
        label: '先听完她们的想法再补充',
        effects: {
          sanDelta: 1,
          academicsDelta: 1,
          characterFavorDelta: [{ characterId: 'btr_hitori', delta: 1 }],
        },
      },
    ],
  },
  {
    id: 'collab_ave_arrange_conflict',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['ave_sakiko', 'ave_umiri'],
    involvedNpcIds: ['ave_sakiko', 'ave_umiri'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 20, maxChance: 0.75 },
    text: '社团联合展示的海报文案在“冲击力”与“可读性”之间僵住了。你会怎么建议？',
    choices: [
      {
        id: 'collab_ave_tension',
        label: '优先冲击力，先抓住眼球',
        effects: {
          sanDelta: -1,
          academicsDelta: 1,
          characterFavorDelta: [{ characterId: 'ave_sakiko', delta: 2 }],
        },
      },
      {
        id: 'collab_ave_stable',
        label: '优先可读性，保证信息清晰',
        effects: {
          sanDelta: 1,
          bondDelta: 2,
          characterFavorDelta: [{ characterId: 'ave_umiri', delta: 2 }],
        },
      },
    ],
  },
  {
    id: 'collab_gbc_street_live_plan',
    weight: 5,
    meetNpcIds: ['gbc_nina', 'gbc_momoka'],
    involvedNpcIds: ['gbc_nina', 'gbc_momoka'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 16, maxChance: 0.8 },
    text: '校园开放日的班级展示在讨论方案：先做稳妥版本，还是做更有记忆点的新方案？',
    choices: [
      {
        id: 'collab_gbc_safe_song',
        label: '先做稳妥版本，保证完成度',
        effects: {
          sanDelta: 1,
          bondDelta: 2,
          characterFavorDelta: [{ characterId: 'gbc_nina', delta: 1 }],
        },
      },
      {
        id: 'collab_gbc_new_version',
        label: '做新方案，赌一次反馈',
        effects: {
          sanDelta: -2,
          academicsDelta: 1,
          characterFavorDelta: [{ characterId: 'gbc_momoka', delta: 2 }],
        },
      },
    ],
  },
  {
    id: 'collab_kon_teatime_or_practice',
    weight: 5,
    meetNpcIds: ['kon_tsumugi', 'kon_azusa'],
    involvedNpcIds: ['kon_tsumugi', 'kon_azusa'],
    coappearIntimacyDelta: 2,
    bondUnlock: { minBond: 15, maxChance: 0.85 },
    text: '社团值日结束后还有一小时空档：先茶点放松，还是先把作业清掉一部分？',
    choices: [
      {
        id: 'collab_kon_teatime',
        label: '先茶点休整，状态优先',
        effects: {
          sanDelta: 3,
          characterFavorDelta: [{ characterId: 'kon_tsumugi', delta: 2 }],
        },
      },
      {
        id: 'collab_kon_practice',
        label: '先清作业，效率优先',
        effects: {
          sanDelta: -1,
          academicsDelta: 2,
          characterFavorDelta: [{ characterId: 'kon_azusa', delta: 2 }],
        },
      },
    ],
  },
]

