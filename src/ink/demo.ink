// 示例周常：乐队养成 Demo（原创设定，避免使用官方角色名）
VAR week = 1
VAR stamina = 10
VAR skill_play = 3
VAR skill_write = 2
VAR bond = 2

-> week_start

=== week_start ===
第 {week} 周。排练室里的音箱还热着，窗外是傍晚的街灯。


+ [全队排练（体力-2，演奏+1，默契+1）]
    ~ stamina = stamina - 2
    ~ skill_play = skill_play + 1
    ~ bond = bond + 1
    你们把同一小节抠了十七遍，主唱终于笑场，气氛反而松了下来。
    -> after_action
+ [写新段副歌（体力-3，创作+2）]
    ~ stamina = stamina - 3
    ~ skill_write = skill_write + 2
    你在谱纸上涂掉又写回，耳机里循环的和弦终于「对味」了。
    -> after_action
+ [早点解散休息（体力+2）]
    ~ stamina = stamina + 2
    有人说「今天就到这儿吧」，没人反对。你买了罐热饮，独自坐了一会儿。
    -> after_action

=== after_action ===
{ stamina < 0:
    你累到在谱架上睡着，下周得注意节奏。
    ~ stamina = 0
}

{ week >= 4:
    -> ending_ready
}

下周见。
~ week = week + 1
-> week_start

=== ending_ready ===
四周过去，Live 前最后一次核对设备。

演奏 {skill_play}，创作 {skill_write}，默契 {bond}。

{ skill_play >= 6 and bond >= 5:
    -> ending_good
}
{ skill_write >= 6 and skill_play >= 4:
    -> ending_song
}
-> ending_ok

=== ending_good ===
台上灯光亮起时，你们几乎不用对视就能进拍——这是排练室时间堆出来的默契。
# ending:golden
-> END

=== ending_song ===
新歌的首演有点紧，但副歌一起，台下有人跟着点头。你记住这个瞬间。
# ending:song
-> END

=== ending_ok ===
不算完美，但也没有搞砸。散场后你们约定：下个月再写一首。
# ending:ok
-> END
