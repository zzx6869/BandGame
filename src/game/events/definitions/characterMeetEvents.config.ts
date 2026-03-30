import type { RandomEventDef } from '@/game/events/runtime'

/**
 * 角色相识事件池（v2）
 * - 每个角色至少一条“主角相识事件”
 * - 通过 meetNpcIds 驱动 met=true
 * - 建议由 store 以“每周至多一次”触发，避免出现过快
 */
export const CHARACTER_MEET_EVENT_DEFS: RandomEventDef[] = [
  {
    id: 'meet_c1_tomori_hallway_note',
    weight: 6,
    meetNpcIds: ['c1'],
    text:
      '你在走廊捡到一张写着零碎歌词的纸条。高松灯慌乱地来找它，你把纸条递回去，她红着脸说了声谢谢。',
    effects: {
      sanDelta: 1,
      characterFavorDelta: [{ characterId: 'c1', delta: 3 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'meet_c2_anon_opening_chat',
    weight: 7,
    meetNpcIds: ['c2'],
    text:
      '午休时千早爱音主动坐到你旁边，话题从社团海报一路跳到你最喜欢的歌。你还没反应过来，已经被她拉进了聊天节奏。',
    effects: {
      sanDelta: 1,
      characterFavorDelta: [{ characterId: 'c2', delta: 3 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'meet_c3_rikki_score_sheet',
    weight: 5,
    meetNpcIds: ['c3'],
    text:
      '你在教室后排收作业时，椎名立希把一张节拍笔记塞给你：“这块你总会乱，先照这个来。”语气很硬，但很实用。',
    effects: {
      sanDelta: -1,
      characterFavorDelta: [{ characterId: 'c3', delta: 3 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'meet_c4_yoruna_snack_bribe',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['c4'],
    text:
      '要乐奈抱着点心盒站在楼梯口，问你“要不要一起”。你们并排坐着吃完那一小块，彼此终于从“路过”变成“认识”。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 3 }],
    },
  },
  {
    id: 'meet_c5_shoko_piano_room',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['c5'],
    text:
      '音乐教室门半掩着，丰川祥子正在调试键盘。她看见你没有赶人，只是让你听一遍“同一段旋律的两种版本”。',
    effects: {
      sanDelta: 1,
      characterFavorDelta: [{ characterId: 'c5', delta: 3 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'meet_c1_tomori_bandage_story',
    weight: 4,
    meetNpcIds: ['c1'],
    text:
      '你看到高松灯在整理一盒创可贴，她认真解释每张图案的来历。你没笑，她反而放松下来，把“喜欢收集”说成了可以分享的秘密。',
    effects: {
      sanDelta: 1,
      characterFavorDelta: [{ characterId: 'c1', delta: 3 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'meet_c2_anon_society_map',
    weight: 5,
    meetNpcIds: ['c2'],
    text:
      '爱音拿着社团招新地图站在公告栏前，一边自言自语一边把你拉进讨论。你刚给了两个建议，就被她默认成“队友”。',
    effects: {
      sanDelta: 1,
      characterFavorDelta: [{ characterId: 'c2', delta: 3 }],
      academicsDelta: 1,
    },
  },
  {
    id: 'meet_c3_rikka_metronome_tap',
    weight: 4,
    meetNpcIds: ['c3'],
    text:
      '你在楼道听到桌沿的敲击声，立希一边打拍一边皱眉。你下意识跟了两拍，她瞥你一眼，把节奏记法写在你手背上。',
    effects: {
      sanDelta: -1,
      characterFavorDelta: [{ characterId: 'c3', delta: 3 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'meet_c4_yoruna_rooftop_cat',
    weight: 3,
    condition: { minYear: 2, minMainSkill: 28 },
    meetNpcIds: ['c4'],
    text:
      '天台角落里有只打盹的猫，要乐奈蹲在旁边喂它。她看见你时只是拍了拍身边空位，像在邀请你加入一个无需解释的同盟。',
    effects: {
      sanDelta: 2,
      characterFavorDelta: [{ characterId: 'c4', delta: 3 }],
      mainSkillDelta: 1,
    },
  },
  {
    id: 'meet_c5_shoko_after_festival',
    weight: 3,
    condition: { minYear: 2, minAbsoluteWeek: 45 },
    meetNpcIds: ['c5'],
    text:
      '校庆后排练室还留着没拆的线材。祥子在逐条收拾，你帮她扶住一端。她没有客套，只说了一句“你手很稳”。',
    effects: {
      sanDelta: 1,
      characterFavorDelta: [{ characterId: 'c5', delta: 3 }],
      academicsDelta: 1,
    },
  },
  // -------------------------- 孤独摇滚 --------------------------
  {
    id: 'meet_btr_hitori_cable_help',
    weight: 5,
    meetNpcIds: ['btr_hitori'],
    text: '社团教室线材打结，你帮后藤一里理开接口。她小声道谢后，主动给你示范了更省时的收线法。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'btr_hitori', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_btr_nijika_stick_count',
    weight: 5,
    meetNpcIds: ['btr_nijika'],
    text: '伊地知虹夏在空教室打拍热身，见你路过就让你帮她数四个小节。你们很快在同一拍点上笑了出来。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'btr_nijika', delta: 3 }], bondDelta: 1 },
  },
  {
    id: 'meet_btr_ryo_bassline_note',
    weight: 4,
    meetNpcIds: ['btr_ryo'],
    text: '山田凉把一段低音线写在便签上递给你，说“先听骨架，再听旋律”。你第一次认真听见了贝斯在说话。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'btr_ryo', delta: 3 }], academicsDelta: 1 },
  },
  {
    id: 'meet_btr_kita_hallway_harmony',
    weight: 5,
    meetNpcIds: ['btr_kita'],
    text: '喜多郁代在走廊试和声，看到你后立刻邀请你一起试一句。你们对上的那一刻，空气都亮了些。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'btr_kita', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_btr_kikuri_livehouse_advice',
    weight: 3,
    condition: { minYear: 2 },
    meetNpcIds: ['btr_kikuri'],
    text: '你在Livehouse门口碰到广井菊里，她边调背带边告诉你“上台前先把呼吸踩稳”。你记住了这句很实用的话。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'btr_kikuri', delta: 3 }], bondDelta: 1 },
  },
  {
    id: 'meet_btr_eliza_amp_tone',
    weight: 3,
    condition: { minYear: 2 },
    meetNpcIds: ['btr_eliza'],
    text: '清水伊莱莎帮你把音箱高频削了一点，音色立刻顺耳。她说“别追尖锐，先追清楚”。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'btr_eliza', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_btr_shima_count_in',
    weight: 3,
    condition: { minYear: 2 },
    meetNpcIds: ['btr_shima'],
    text: '岩下志麻在门边轻敲鼓棒做count in，你跟着点头后，她把节拍口令写给了你。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'btr_shima', delta: 3 }], academicsDelta: 1 },
  },

  // -------------------------- Ave Mujica --------------------------
  {
    id: 'meet_ave_uika_stage_smile',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['ave_uika'],
    text: '祐天寺若麦在舞台侧台练开嗓，她看见你后仍保持节奏，把一句尾音留给你接。你们因此认识。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'ave_uika', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_ave_sakiko_arrange_sheet',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['ave_sakiko'],
    text: '你捡到一页编排草稿，丰川祥子接过后却让你先看完。她问你“哪一段最需要保留”，像在测试你的判断。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'ave_sakiko', delta: 3 }], academicsDelta: 1 },
  },
  {
    id: 'meet_ave_umiri_lowend_talk',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['ave_umiri'],
    text: '八幡海铃调低频时让你站到观众区听一次。你回头时，她点点头，像默认你“听得懂”。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'ave_umiri', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_ave_nyamu_stick_spin',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['ave_nyamu'],
    text: 'Nyamu在休息时转鼓棒玩，你接住她抛来的那一下，换来她一句“反应不错”。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'ave_nyamu', delta: 3 }], bondDelta: 1 },
  },
  {
    id: 'meet_ave_mutsumi_quiet_chord',
    weight: 4,
    condition: { minYear: 2 },
    meetNpcIds: ['ave_mutsumi'],
    text: '若叶睦在空走廊轻轻压了一个和弦，你停下听，她便把这组按法写给了你。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'ave_mutsumi', delta: 3 }], mainSkillDelta: 1 },
  },

  // -------------------------- Girls Band Cry --------------------------
  {
    id: 'meet_gbc_nina_street_voice',
    weight: 4,
    meetNpcIds: ['gbc_nina'],
    text: '你在天桥下听见井芹仁菜的练声，她收尾后先问你“这句够真实吗？”你回答后你们就聊开了。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'gbc_nina', delta: 3 }], bondDelta: 1 },
  },
  {
    id: 'meet_gbc_momoka_pick_choice',
    weight: 4,
    meetNpcIds: ['gbc_momoka'],
    text: '河原木桃香把两片拨片递给你，让你选更适合今天状态的一片。她说“选择本身也是演奏”。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'gbc_momoka', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_gbc_subaru_fill_pattern',
    weight: 4,
    meetNpcIds: ['gbc_subaru'],
    text: '安和昴在排练间隙示范了一个fill in，你跟着拍了两遍后，她把节奏切分写给你。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'gbc_subaru', delta: 3 }], academicsDelta: 1 },
  },
  {
    id: 'meet_gbc_tomo_layer_hint',
    weight: 3,
    condition: { minYear: 2 },
    meetNpcIds: ['gbc_tomo'],
    text: '海老冢智帮你把键盘层次改成“先薄后厚”。你听懂后，她难得夸了句“理解得快”。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'gbc_tomo', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_gbc_rupa_groove_walk',
    weight: 3,
    condition: { minYear: 2 },
    meetNpcIds: ['gbc_rupa'],
    text: 'Rupa带你沿着街拍走四个小节，脚步和低频对上后，她笑着说“这就是groove”。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'gbc_rupa', delta: 3 }], bondDelta: 1 },
  },

  // -------------------------- 轻音少女 --------------------------
  {
    id: 'meet_kon_yui_afterclass_chord',
    weight: 5,
    meetNpcIds: ['kon_yui'],
    text: '放学后平泽唯抱着吉他试和弦，卡住时你顺手帮她按稳。她开心地邀请你下次再一起练。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'kon_yui', delta: 3 }], mainSkillDelta: 1 },
  },
  {
    id: 'meet_kon_mio_bass_score',
    weight: 4,
    meetNpcIds: ['kon_mio'],
    text: '秋山澪在谱架前校对低音谱，你指出了一处重拍标记。她认真道谢，还给你留了复习建议。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'kon_mio', delta: 3 }], academicsDelta: 1 },
  },
  {
    id: 'meet_kon_ritsu_drum_joke',
    weight: 4,
    meetNpcIds: ['kon_ritsu'],
    text: '田井中律拿鼓棒敲了个搞怪节奏，你居然接上了最后一拍。她当场宣布你通过“节奏测试”。',
    effects: { sanDelta: 1, characterFavorDelta: [{ characterId: 'kon_ritsu', delta: 3 }], bondDelta: 1 },
  },
  {
    id: 'meet_kon_tsumugi_tea_break',
    weight: 4,
    meetNpcIds: ['kon_tsumugi'],
    text: '琴吹紬在练习间隙分你一杯热茶，顺手讲了她整理练习计划的小技巧。你们在安静里认识了彼此。',
    effects: { sanDelta: 2, characterFavorDelta: [{ characterId: 'kon_tsumugi', delta: 3 }], academicsDelta: 1 },
  },
  {
    id: 'meet_kon_azusa_strict_tune',
    weight: 4,
    meetNpcIds: ['kon_azusa'],
    text: '中野梓盯着你调音，直到每根弦都准确才点头。她话不多，但你知道她认可了你的认真。',
    effects: { sanDelta: 0, characterFavorDelta: [{ characterId: 'kon_azusa', delta: 3 }], mainSkillDelta: 1 },
  },
]

