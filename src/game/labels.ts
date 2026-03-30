import type { Instrument } from './types'
import { monthFromWeekInYear, weekInMonthFromWeekInYear } from './config'

export const INSTRUMENT_LABEL: Record<Instrument, string> = {
  guitar: '吉他🎸',
  vocal: '声乐🎤',
  bass: '贝斯🎸',
  drums: '鼓🥁',
  keyboard: '键盘🎹',
}

export function schoolYearLabel(year: number): string {
  if (year === 1) return '高一'
  if (year === 2) return '高二'
  if (year === 3) return '高三'
  return `第${year}年`
}

export function weekLabel(year: number, weekInYear: number): string {
  const month = monthFromWeekInYear(weekInYear)
  const weekInMonth = weekInMonthFromWeekInYear(weekInYear)
  return `${schoolYearLabel(year)} · ${month}月 · 第${weekInMonth}周`
}
