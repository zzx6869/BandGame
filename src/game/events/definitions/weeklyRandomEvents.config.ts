/**
 * =============================================================================
 * 随机事件池 —— 只改本文件
 * =============================================================================
 *
 * - `text`：情景与背景，可写长。
 * - `choices`：若有，玩家必须点选一项；只结算该选项的 `effects`。
 * - 无 `choices`：显示「继续」，结算根上的 `effects`。
 * - `effects` / 选项内可写：SAN、学业、主修、羁绊、NPC 好感、`npcPairIntimacyDelta`、`npcSpecialtySkillDelta`。
 * - `meetNpcIds`：本事件里尚未与主角「认识」也可被抽中的角色 id（初次打交道仅在实际结算到好感/专精指导等时记为认识）。
 *
 * 每周抽几条由 `config.ts` 的 `weeklyRandomEventCount` 决定。
 */

import type { RandomEventDef } from '@/game/events/runtime'

export const RANDOM_EVENT_DEFS: RandomEventDef[] = [
  {
    id: 'club_poster',
    weight: 10,
    meetNpcIds: ['c2'],
    text:
      '班会上，班主任抬高声音说下周有社团招新宣讲。走廊里已经贴上海报，色彩撞在一起，有人开始讨论要报什么。你盯着「轻音」「器乐」几个字眼，思绪飘了一秒。',
    choices: [
      {
        id: 'ask_around',
        label: '散会后顺口问问有没有人一起去逛摊位',
        effects: { sanDelta: 3, characterFavorDelta: [{ characterId: 'c2', delta: 2 }] },
      },
      {
        id: 'slip_away',
        label: '假装记笔记，心里盘算周末练琴计划',
        effects: { sanDelta: 1, mainSkillDelta: 1 },
      },
      {
        id: 'drained',
        label: '只觉得吵闹，只想趴桌放空',
        effects: { sanDelta: -2 },
      },
    ],
  },
  {
    id: 'rain_station',
    weight: 9,
    spawnChanceByStats: [
      { condition: { maxSan: 45 }, chance: 0.95 },
      { condition: { minSan: 80 }, chance: 0.65 },
    ],
    meetNpcIds: ['c1'],
    text:
      '放学路上雨突然大起来。站台下挤满人，雨伞滴水在鞋边积成小洼。等车的时间被拉得很长，手机信号一格一格跳。',
    choices: [
      {
        id: 'walk',
        label: '冒雨走两站，当清醒一下',
        effects: { sanDelta: -6, academicsDelta: 1 },
        probabilisticFollowups: [
          {
            chance: 0.35,
            chanceByStats: [
              { condition: { maxSan: 40 }, chance: 0.75 },
              { condition: { minSan: 75 }, chance: 0.2 },
            ],
            eventIds: ['forced_buy_medicine'],
          },
        ],
      },
      {
        id: 'wait',
        label: '老实等着，听歌打发',
        effects: { sanDelta: -2, mainSkillDelta: 1 },
      },
      {
        id: 'share',
        label: '把伞檐往陌生同学那边让一点',
        effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'c1', delta: 1 }] },
        followupEventIds: ['forced_buy_medicine'],
        probabilisticFollowups: [{ chance: 0.25, eventIds: ['forced_recovering_day'] }],
      },
    ],
  },
  {
    id: 'pop_quiz',
    weight: 8,
    meetNpcIds: ['c3'],
    text:
      '数学课尾声，老师突然说「随堂小测，就当练手」。卷子传下来那一瞬间，教室的空气薄得像纸。你握笔的手指有点僵。',
    choices: [
      {
        id: 'focus',
        label: '硬着头皮抠到最后一秒',
        effects: { sanDelta: -8, academicsDelta: 3 },
        probabilisticFollowups: [
          {
            chance: 0.5,
            chanceByStats: [
              { condition: { maxSan: 40 }, chance: 0.8 },
              { condition: { minAcademics: 75 }, chance: 0.25 },
            ],
            eventIds: ['forced_post_quiz_headache'],
          },
        ],
      },
      {
        id: 'half',
        label: '会写的写完，剩下随缘',
        effects: { sanDelta: -4, academicsDelta: -1 },
      },
      {
        id: 'chat_after',
        label: '交卷后跟人对两道大题，搞清错哪了',
        effects: { sanDelta: -3, academicsDelta: 2, characterFavorDelta: [{ characterId: 'c3', delta: 2 }] },
      },
    ],
  },
  {
    id: 'cafeteria_line',
    weight: 8,
    meetNpcIds: ['c1'],
    text:
      '食堂新窗口前排起折尺形长队，空气里是油和甜酱。有人小声抱怨课表，有人分享见闻。你被人群推着往前挪。',
    choices: [
      {
        id: 'smalltalk',
        label: '跟排在前面的隔壁班同学搭话两句',
        effects: { sanDelta: 2, characterFavorDelta: [{ characterId: 'c1', delta: 3 }], npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c2', delta: 1 }] },
      },
      {
        id: 'phone',
        label: '低头刷手机当没听见',
        effects: { sanDelta: 1 },
      },
      {
        id: 'leave',
        label: '队伍太长，转战旧窗口随便吃点',
        effects: { sanDelta: -1 },
      },
    ],
  },
  {
    id: 'music_room_open',
    weight: 7,
    spawnChanceByStats: [
      { condition: { minMainSkill: 60 }, chance: 0.9 },
      { condition: { maxMainSkill: 28 }, chance: 0.4 },
    ],
    text:
      '路过音乐教室，门虚掩着，里面没人。灯还亮，谱架上的谱子被穿堂风吹得翘起一角。走廊尽头是上课铃的余音。',
    condition: { minMainSkill: 25 },
    choices: [
      {
        id: 'grind',
        label: '进去练到手指发酸再起',
        effects: { sanDelta: -5, mainSkillDelta: 4 },
      },
      {
        id: 'light',
        label: '轻轻弹几遍过过手瘾就走',
        effects: { sanDelta: -2, mainSkillDelta: 2 },
      },
      {
        id: 'close',
        label: '帮人把灯关了带上门',
        effects: { sanDelta: 2 },
      },
    ],
  },
  {
    id: 'class_group_spam',
    weight: 7,
    text:
      '班长在班级群里发长文提醒交表，下面立刻刷出一串「收到」。通知往上顶，旧消息几秒钟就看不见了。',
    choices: [
      {
        id: 'reply',
        label: '跟条收到，顺便扫一眼附件',
        effects: { sanDelta: -1, academicsDelta: 1 },
      },
      {
        id: 'mute',
        label: '长按静音，假装自己没有群',
        effects: { sanDelta: 1, academicsDelta: -1 },
      },
      {
        id: 'pin_and_delay',
        label: '先置顶，晚点集中处理',
        effects: { sanDelta: 0, academicsDelta: 0, mainSkillDelta: 1 },
      },
    ],
  },
  {
    id: 'pe_guitar_corner',
    weight: 8,
    meetNpcIds: ['c2'],
    text:
      '体育课自由活动，操场角落有人抱着木吉他扫弦。围坐的人跟着打拍子，跑圈的脚步声变得很远。',
    choices: [
      {
        id: 'listen',
        label: '坐近点听，记一记和弦走向',
        effects: { sanDelta: 2, mainSkillDelta: 2 },
      },
      {
        id: 'join',
        label: '腼腆地问能不能试两下',
        effects: { sanDelta: -1, mainSkillDelta: 3, characterFavorDelta: [{ characterId: 'c2', delta: 2 }] },
      },
      {
        id: 'jog',
        label: '继续跑圈，当放松眼部肌肉',
        effects: { sanDelta: 3 },
      },
    ],
  },
  {
    id: 'linxiao_rumor',
    weight: 4,
    meetNpcIds: ['c1'],
    text:
      '林晓在图书馆拦住你，眼睛亮了一下又别开。她问：周末要不要一起去琴行试效果器？听起来像随口一提，又像准备了很久。',
    condition: { characterFavorMin: [{ characterId: 'c1', min: 25 }] },
    choices: [
      {
        id: 'yes',
        label: '答应下来，顺便约好集合时间',
        effects: { sanDelta: 2, characterFavorDelta: [{ characterId: 'c1', delta: 6 }], npcPairIntimacyDelta: [{ npcIdA: 'c1', npcIdB: 'c2', delta: 1 }] },
      },
      {
        id: 'hesitate',
        label: '说「要先看课表」，把话头吊在半空',
        effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'c1', delta: -2 }] },
      },
      {
        id: 'no',
        label: '婉拒，理由说得尽量软',
        effects: { sanDelta: 3, characterFavorDelta: [{ characterId: 'c1', delta: -4 }] },
      },
    ],
  },
  {
    id: 'second_year_pressure',
    weight: 6,
    meetNpcIds: ['c3'],
    text:
      '高二年级组开会的消息在走廊传开，有人说课业要加码、自习要延长。你下意识去摸琴包带子，确认它还在肩后。',
    condition: { minYear: 2 },
    choices: [
      {
        id: 'study_mode',
        label: '把课表重排，多抠一小时作业',
        effects: { sanDelta: -5, academicsDelta: 4 },
      },
      {
        id: 'guard_practice',
        label: '宁可少睡也要保住练习时段',
        effects: { sanDelta: -7, mainSkillDelta: 3, academicsDelta: -1 },
      },
      {
        id: 'vent',
        label: '找熟人吐槽两句，笑一笑散掉闷气',
        effects: { sanDelta: 2, characterFavorDelta: [{ characterId: 'c3', delta: 2 }] },
      },
      {
        id: 'hybrid_mode',
        label: '学习练习都保底，强度都下调',
        effects: { sanDelta: -3, academicsDelta: 2, mainSkillDelta: 1 },
      },
    ],
  },
]
