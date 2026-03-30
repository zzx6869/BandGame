import type { InviteFailureSpeechConfig, InviteFavorThresholdConfig, InviteRule } from './Npc'

/**
 * 邀请入队的专属条件（除“好感阈值”和“是否已相识”外的附加门槛）
 * - 满足全部规则才会邀请成功
 * - 规则本身不做好感判断；好感阈值由 `INVITE_FAVOR_THRESHOLD` 控制
 */
export const INVITE_RULES: Record<string, InviteRule[]> = {
  // 孤独摇滚：立希的“队内/队外”好感阈值差异由 `INVITE_FAVOR_THRESHOLDS` 控制（此处不再硬限制）。
  c3: [],
  // 孤独摇滚：技能达到一定水平，祥子才会加入
  c5: [
    {
      minMainSkill: 65,
      reason: '丰川祥子表示你当前主修实力还不够稳定（需主修技能 >= 65）。',
    },
  ],
  c4: [
    {
      minMainSkill: 45,
      reason: '要乐奈只会在你有一定演奏基础后考虑加入（需主修技能 >= 45）。',
    },
  ],

  // Ave Mujica：示例：祥子（Ave）需要更高主修技能
  ave_sakiko: [
    {
      minMainSkill: 80,
      reason: '丰川祥子（Ave）要求更高的演奏标准（需主修技能 >= 80）。',
    },
  ],

  // SICK HACK：示例：需要至少 1 名队友
  btr_hitori: [
    {
      minBandMemberCount: 1,
      reason: '后藤一里需要先确认乐队已有稳定同伴。',
    },
  ],
}

/**
 * 每个角色的“邀请入队所需好感阈值”，并允许随队伍成员组成变化。
 *
 * 说明：
 * - `default`：不满足任何 `byBandRules` 时使用
 * - `byBandRules`：按顺序命中第一条规则并使用其 `threshold`
 */
export const INVITE_FAVOR_THRESHOLDS: Record<string, InviteFavorThresholdConfig> = {
  // 轻音少女（示例：使用不同阈值区间）
  c1: { default: 35 },
  c2: { default: 45 },
  c3: {
    default: 60,
    byBandRules: [
      { requireBandMemberIdsAll: ['c1'], threshold: 40 }, // 高松灯在队内时更容易说服
    ],
  },
  c4: { default: 48 },
  c5: {
    default: 58,
    byBandRules: [
      { minBandMemberCount: 2, threshold: 45 }, // 队伍更完整时门槛降低
    ],
  },
  c6: { default: 42 },

  // 孤独摇滚
  btr_hitori: { default: 55, byBandRules: [{ minBandMemberCount: 1, threshold: 40 }] },
  btr_nijika: { default: 48 },
  btr_ryo: { default: 45 },
  btr_kita: { default: 40 },
  btr_kikuri: { default: 52 },
  btr_eliza: { default: 46 },
  btr_shima: { default: 44 },

  // Ave Mujica
  ave_uika: { default: 46 },
  ave_sakiko: { default: 62, byBandRules: [{ minBandMemberCount: 2, threshold: 50 }] },
  ave_umiri: { default: 45 },
  ave_nyamu: { default: 48 },
  ave_mutsumi: { default: 44 },

  // Girls Band Cry
  gbc_nina: { default: 42 },
  gbc_momoka: { default: 50 },
  gbc_subaru: { default: 47 },
  gbc_tomo: { default: 46 },
  gbc_rupa: { default: 41 },

  // K-ON（放课后Tea Time）
  kon_yui: { default: 40 },
  kon_mio: { default: 46 },
  kon_ritsu: { default: 55, byBandRules: [{ requireBandMemberIdsAll: ['kon_mio'], threshold: 45 }] },
  kon_tsumugi: { default: 44 },
  kon_azusa: { default: 48 },
}

/**
 * 邀请失败时的角色口吻台词（用于弹窗展示）。
 */
export const INVITE_FAILURE_SPEECH: Record<string, InviteFailureSpeechConfig> = {
  // 轻音少女（K-ON）/ 基础组
  c1: {
    favorLow: '我……还没被你完全说服。',
    favorLowNear: '嗯……已经接近了，但还不够让我点头。',
    favorLowFar: '差太远了，我现在做不到。',
    ruleBlocked: '要加入之前，队伍还得更稳定一点。',
    ruleSkillBlocked: '先把实力练到更稳，再来找我。',
    ruleBandBlocked: '队伍的节奏还不够让我安心。',
    fallback: '对不起，再等我一下。',
  },
  c2: {
    favorLow: '好像还差一点点……再让我更了解你。',
    favorLowNear: '再多一点点就好……真的。',
    favorLowFar: '现在还不行，先别再催我。',
    ruleBlocked: '现在加入会太勉强。',
    ruleSkillBlocked: '你的状态还没到能一起走的程度。',
    ruleBandBlocked: '阵容现在不太适合多我一个。',
    fallback: '算了，先不答应。',
  },
  c3: {
    favorLow: '我不想把乐队当儿戏，先别急。',
    favorLowNear: '快到了，但还没到让我点头的程度。',
    favorLowFar: '差得太远了，别急着谈入队。',
    ruleBlocked: '条件还没到位，别再提了。',
    ruleSkillBlocked: '现在还没到我承认你可以带我走的程度。',
    ruleBandBlocked: '阵容不对，我不会加入。',
    fallback: '……不行。',
  },
  c4: {
    favorLow: '你还没让我觉得“不会拖累”。',
    favorLowNear: '再证明一次，我就会认真考虑。',
    favorLowFar: '现在还不够，我不想答应让你难堪。',
    ruleBlocked: '现在还不适合加入。',
    ruleSkillBlocked: '主修实力还没到我的标准。',
    ruleBandBlocked: '队伍的基础还没稳定下来。',
    fallback: '抱歉，我需要再准备一下。',
  },
  c5: {
    favorLow: '你的邀请……我还不能立刻点头。',
    favorLowNear: '你离我的标准不远了，但还不够。',
    favorLowFar: '现在谈这个还太早。',
    ruleBlocked: '现在还不到我加入的时候。',
    ruleSkillBlocked: '主修实力先提上来，再来找我。',
    ruleBandBlocked: '阵容现在还不需要我冒险加入。',
    fallback: '对不起，先放我冷静一下。',
  },
  c6: {
    favorLow: '喜欢是喜欢，但还差一点信任。',
    favorLowNear: '再多靠近一点……我就能稍微安心。',
    favorLowFar: '现在要我答应还太早了。',
    ruleBlocked: '队伍的节奏还不够让人放心。',
    ruleSkillBlocked: '你的实力还不够稳，我需要再观察。',
    ruleBandBlocked: '队伍的氛围还需要再磨合。',
    fallback: '等以后再说吧。',
  },

  // 孤独摇滚（BTR）/ 结束乐队 + SICK HACK
  btr_hitori: {
    favorLow: '我...我...算....算了....',
    favorLowNear: '我、我再想一下......再给我一点点时间......',
    favorLowFar: '对不起......我现在真的做不到......',
    ruleBlocked: '现、现在我还没准备好和大家一起......',
    ruleBandBlocked: '队、队伍现在这样的话......我会拖后腿的......',
    fallback: '对不起，我还需要一点时间......',
  },
  btr_nijika: {
    favorLow: '你跟我还不够熟呢。',
    favorLowNear: '再让我多了解你一点点。',
    favorLowFar: '现在说加入还太快了。',
    ruleBlocked: '现在说加入还太早。',
    ruleSkillBlocked: '实力还没跟上，我不敢点头。',
    ruleBandBlocked: '队伍的选择还不需要变动。',
    fallback: '先这样吧。',
  },
  btr_ryo: {
    favorLow: '哎呀，太着急了。',
    favorLowNear: '你再耐心一点，我可能就会答应。',
    favorLowFar: '现在真的不行，别再提了。',
    ruleBlocked: '条件没到我就不会点头。',
    ruleSkillBlocked: '先把演奏练到更扎实。',
    ruleBandBlocked: '队伍还不够让我放心。',
    fallback: '慢慢来吧。',
  },
  btr_kita: {
    favorLow: '我还没完全相信你会一直走下去。',
    favorLowNear: '如果你能更坚持一点……或许。',
    favorLowFar: '现在还不够，我无法把心交出去。',
    ruleBlocked: '队伍现在还不需要额外的变化。',
    ruleSkillBlocked: '实力不到位的话，我会替你担心。',
    ruleBandBlocked: '阵容当前已经很好，不想乱动。',
    fallback: '下次再试试。',
  },
  btr_kikuri: {
    favorLow: '……好感不够。真的还不够。',
    favorLowNear: '差一点点就能让我点头了。',
    favorLowFar: '太勉强了，我不能答应。',
    ruleBlocked: '我没法答应这种不稳的邀请。',
    ruleSkillBlocked: '你还没达到我期待的稳定。',
    ruleBandBlocked: '队伍的节奏现在不适合。',
    fallback: '抱歉。',
  },
  btr_eliza: {
    favorLow: '不行哦，我心态还没跟上。',
    favorLowNear: '等我心态更稳一点，再说吧。',
    favorLowFar: '现在还没办法。',
    ruleBlocked: '现在加入会太危险。',
    ruleSkillBlocked: '你的实力还不够让我安心。',
    ruleBandBlocked: '队伍现在的风险太高了。',
    fallback: '算了，之后再说。',
  },
  btr_shima: {
    favorLow: '你还没和我的鼓点对上。',
    favorLowNear: '只要再对上一点点……就行。',
    favorLowFar: '现在还不行，我听不到契合。',
    ruleBlocked: '现在的阵容不适合你进来。',
    ruleSkillBlocked: '节奏还没对齐，我不能点头。',
    ruleBandBlocked: '阵容的空位不在你这里。',
    fallback: '等更合拍的时候再来。',
  },

  // Ave Mujica
  ave_uika: {
    favorLow: '我还不够信任你。',
    favorLowNear: '再多证明一次……我就会信一点。',
    favorLowFar: '现在要我答应太快了。',
    ruleBlocked: '现在不是加入的时机。',
    ruleSkillBlocked: '你还没到让我放心的实力。',
    ruleBandBlocked: '队伍节奏还不够稳定。',
    fallback: '……我先拒绝一次。',
  },
  ave_sakiko: {
    favorLow: '我只接受“足够强”的邀请。',
    favorLowNear: '如果你再强一点，我就会考虑。',
    favorLowFar: '现在不够强，我不点头。',
    ruleBlocked: '条件未达标，我不能答应。',
    ruleSkillBlocked: '主修实力还不够扎实。',
    ruleBandBlocked: '阵容基础还没稳。',
    fallback: '抱歉，现在不行。',
  },
  ave_umiri: {
    favorLow: '再多靠近一点点吧。',
    favorLowNear: '差一点点就够了。',
    favorLowFar: '现在靠近还没用。',
    ruleBlocked: '你还不够稳定。',
    ruleSkillBlocked: '实力不够稳定，我不能答应。',
    ruleBandBlocked: '队伍现在不需要我冒险加入。',
    fallback: '先不加入。',
  },
  ave_nyamu: {
    favorLow: '你太急了啦。',
    favorLowNear: '你别那么急……我还需要再看。',
    favorLowFar: '现在真的太急了。',
    ruleBlocked: '还没到我点头的时候。',
    ruleSkillBlocked: '实力还没到位。',
    ruleBandBlocked: '阵容还没到我想加入的状态。',
    fallback: '换个时间再来。',
  },
  ave_mutsumi: {
    favorLow: '好感度还不够。',
    favorLowNear: '你再努力一点点，我会松口。',
    favorLowFar: '现在还不行，别让我难堪。',
    ruleBlocked: '条件还没过线。',
    ruleSkillBlocked: '你的实力还没过线。',
    ruleBandBlocked: '队伍现在还不适合。',
    fallback: '对不起。',
  },

  // Girls Band Cry
  gbc_nina: {
    favorLow: '我……我没有要拒绝你，只是还差一点。',
    favorLowNear: '只要再一点点就好。',
    favorLowFar: '现在让我答应不太可能。',
    ruleBlocked: '现在加入会让我不安心。',
    ruleSkillBlocked: '你还没到能一起扛住的实力。',
    ruleBandBlocked: '队伍的气氛还不够让我放心。',
    fallback: '先别急着进队。',
  },
  gbc_momoka: {
    favorLow: '我觉得你还得再练得更稳。',
    favorLowNear: '已经看见进步了，再稳一点。',
    favorLowFar: '差得太多了，先练到更稳。',
    ruleBlocked: '门槛还没到。',
    ruleSkillBlocked: '主修实力不够扎实。',
    ruleBandBlocked: '阵容基础还没稳定。',
    fallback: '不行，再等等吧。',
  },
  gbc_subaru: {
    favorLow: '啧……不够。',
    favorLowNear: '差得不算多，但还不行。',
    favorLowFar: '现在不行，我不点头。',
    ruleBlocked: '现在还早，我不点头。',
    ruleSkillBlocked: '还没到你能带我走的程度。',
    ruleBandBlocked: '队伍不适合现在变化。',
    fallback: '算了。',
  },
  gbc_tomo: {
    favorLow: '你需要先证明你能承担。',
    favorLowNear: '我看到了你的认真……还差一点。',
    favorLowFar: '证明还不够，我不能答应。',
    ruleBlocked: '条件没满足，我不能答应。',
    ruleSkillBlocked: '承担需要对应的实力。',
    ruleBandBlocked: '队伍现在还不能多我一个压力点。',
    fallback: '请你再准备一下。',
  },
  gbc_rupa: {
    favorLow: '我不想让自己分心。',
    favorLowNear: '如果你更稳一点，我就能安心。',
    favorLowFar: '现在加入会让我太分心。',
    ruleBlocked: '阵容现在不需要这种变化。',
    ruleSkillBlocked: '实力不到位会影响整体。',
    ruleBandBlocked: '阵容当前不需要变化。',
    fallback: '对不起。',
  },

  // 轻音少女（放课后Tea Time）/ K-ON
  kon_yui: {
    favorLow: 'えへへ……还差一点点呢！',
    favorLowNear: '再让我确认一下！就一点点！',
    favorLowFar: '现在还不行哦！',
    ruleBlocked: '现在还不行啦。',
    ruleSkillBlocked: '再厉害一点点，再来！',
    ruleBandBlocked: '队伍还没到我放心的状态。',
    fallback: '再想想再说吧。',
  },
  kon_mio: {
    favorLow: '好感还不够呢。',
    favorLowNear: '再多一点点，我就能答应。',
    favorLowFar: '现在还不够。',
    ruleBlocked: '现在加入不合适。',
    ruleSkillBlocked: '你的状态还不够稳。',
    ruleBandBlocked: '队伍安排现在不适合。',
    fallback: '抱歉。',
  },
  kon_ritsu: {
    favorLow: '律子还没认可你呢。',
    favorLowNear: '再符合一点点标准就行。',
    favorLowFar: '现在还不合格。',
    ruleBlocked: '差一点火候。',
    ruleSkillBlocked: '实力还差火候。',
    ruleBandBlocked: '队伍的节奏还差一点。',
    fallback: '别催啦。',
  },
  kon_tsumugi: {
    favorLow: '我需要更可靠的理由。',
    favorLowNear: '你的理由很认真了，再稳一点就好。',
    favorLowFar: '现在理由还不够可靠。',
    ruleBlocked: '现在还不符合我们这边的安排。',
    ruleSkillBlocked: '实力与理由都还要更完整。',
    ruleBandBlocked: '队伍的安排现在不允许。',
    fallback: '对不起。',
  },
  kon_azusa: {
    favorLow: '……我先不勉强你了。',
    favorLowNear: '你再努力一点点，我就会改变主意。',
    favorLowFar: '现在还不行。',
    ruleBlocked: '条件还不够。',
    ruleSkillBlocked: '条件还没到我的标准。',
    ruleBandBlocked: '队伍现在还不需要额外的你。',
    fallback: '等你更合适再来。',
  },
}
