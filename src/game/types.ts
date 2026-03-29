/** 主修乐器（吉他 / 声乐 / 贝斯 / 鼓 / 键盘） */
export type Instrument = 'guitar' | 'vocal' | 'bass' | 'drums' | 'keyboard'

export type GamePhase = 'intro' | 'skill_select' | 'playing' | 'graduated'

export interface SongEntry {
  id: string
  title: string
  proficiency: number
}

export interface BandActivityRecord {
  weekLabel: string
  text: string
}

export type BandPanelTab = 'overview' | 'members' | 'songs' | 'log' | 'actions'
