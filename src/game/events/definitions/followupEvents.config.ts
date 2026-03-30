import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 连锁/强制后续事件池：
 * - 不参与随机抽取
 * - 仅通过 `followupEventIds` 串联触发
 */
export const FOLLOWUP_EVENT_DEFS: RandomEventDef[] = [
  {
    id: 'forced_buy_medicine',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '回家后你开始打喷嚏，第二天喉咙也发紧。你只好去药店买药，顺便把这次“逞强”记进了教训清单。',
    choices: [
      {
        id: 'buy_full_package',
        label: '按疗程买齐药，今晚早点睡',
        effects: { sanDelta: -1, academicsDelta: -1 },
        followupEventIds: ['forced_recovering_day'],
      },
      {
        id: 'buy_minimum',
        label: '只买最便宜的一盒，硬扛',
        effects: { sanDelta: -2, academicsDelta: 0 },
        probabilisticFollowups: [{ chance: 0.6, eventIds: ['forced_relapse_fever'] }],
      },
    ],
  },
  {
    id: 'forced_recovering_day',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '你按时吃药和休息，第二天状态虽然还没满格，但至少没继续恶化。你知道这次算是把风险压住了。',
    choices: [
      {
        id: 'recovering_day_rest_first',
        label: '继续按恢复节奏走',
        effects: { sanDelta: 2, academicsDelta: 0 },
      },
      {
        id: 'recovering_day_catchup',
        label: '状态稍稳后补一点进度',
        effects: { sanDelta: 1, academicsDelta: 1 },
      },
    ],
  },
  {
    id: 'forced_relapse_fever',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '半夜你被低烧弄醒，早晨出门前只剩“继续扛”或“请假调整”两个选项。',
    choices: [
      {
        id: 'relapse_take_half_day_off',
        label: '请半天假，把身体拉回来',
        effects: { sanDelta: 1, academicsDelta: -2 },
        followupEventIds: ['forced_recovering_day'],
      },
      {
        id: 'relapse_force_school',
        label: '硬着头皮去学校',
        effects: { sanDelta: -3, academicsDelta: -1 },
        probabilisticFollowups: [{ chance: 0.45, eventIds: ['forced_clinic_warning'] }],
      },
    ],
  },
  {
    id: 'forced_clinic_warning',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '校医看了你一眼就皱眉，叮嘱你别再把“逞强”当效率。你嘴上应着，心里却知道这句话说得很准。',
    effects: {
      sanDelta: 1,
      academicsDelta: -1,
    },
  },
  {
    id: 'forced_post_quiz_headache',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '小测后你脑袋像被拧紧。题是做完了，但专注力像被一次性消耗掉。',
    choices: [
      {
        id: 'headache_rest',
        label: '回家先休息，明天再补',
        effects: { sanDelta: 2, academicsDelta: -1 },
      },
      {
        id: 'headache_keep_grinding',
        label: '继续硬刷题，别浪费惯性',
        effects: { sanDelta: -2, academicsDelta: 1 },
        probabilisticFollowups: [{ chance: 0.4, eventIds: ['forced_late_night_drift'] }],
      },
    ],
  },
  {
    id: 'forced_late_night_drift',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '深夜你盯着同一页内容很久，才发现已经走神。你突然明白：并不是每次多撑半小时都算进步。',
    choices: [
      {
        id: 'late_night_drift_sleep',
        label: '立刻停下去睡，止损',
        effects: { sanDelta: 1, academicsDelta: 0 },
      },
      {
        id: 'late_night_drift_keep',
        label: '再撑二十分钟收尾',
        effects: { sanDelta: -2, academicsDelta: 1 },
      },
    ],
  },
  {
    id: 'forced_conflict_review',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '冲突后你把大家的分歧写成三行：事实、情绪、下一步。写完以后，至少你知道该从哪一句先开口。',
    choices: [
      {
        id: 'review_call_meeting',
        label: '主动提议开一个短会，把分歧说清',
        effects: { sanDelta: -1, bondDelta: 2 },
      },
      {
        id: 'review_avoid_topic',
        label: '先假装没事，等它自己过去',
        effects: { sanDelta: 1, bondDelta: -2 },
        probabilisticFollowups: [{ chance: 0.55, eventIds: ['forced_silent_rehearsal'] }],
      },
    ],
  },
  {
    id: 'forced_silent_rehearsal',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '下一次排练里没人明说问题，但每个人都在绕开彼此。你意识到“沉默”本身也会消耗羁绊。',
    effects: {
      sanDelta: -1,
      bondDelta: -2,
    },
  },
  {
    id: 'forced_stage_supply_run',
    weight: 1,
    cooldownWeeks: 0,
    text:
      '彩排后你临时被叫去补买耗材。来回奔波不算难，但它提醒你：舞台前总有看不见的成本。',
    choices: [
      {
        id: 'stage_supply_run_solo',
        label: '自己跑完，不麻烦别人',
        effects: { sanDelta: -2, academicsDelta: -1 },
      },
      {
        id: 'stage_supply_run_call_help',
        label: '拉一个同伴分担',
        effects: {
          sanDelta: -1,
          academicsDelta: -1,
          bondDelta: 1,
          npcPairIntimacyDelta: [{ npcIdA: 'c2', npcIdB: 'c3', delta: 1 }],
        },
      },
    ],
  },
]

export const FOLLOWUP_EVENT_BY_ID: Record<string, RandomEventDef> = Object.fromEntries(
  FOLLOWUP_EVENT_DEFS.map((e) => [e.id, e]),
)

