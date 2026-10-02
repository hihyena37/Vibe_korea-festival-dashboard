// 날짜는 TourAPI 형식과 같은 'YYYYMMDD' 문자열로 다룬다.
// 같은 길이의 숫자 문자열이므로 문자열 비교만으로 대소 비교가 가능하다.

const pad = (n) => String(n).padStart(2, '0')

export function toYmd(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

export function getTodayYmd() {
  return toYmd(new Date())
}

export function parseYmd(ymd) {
  if (!isValidYmd(ymd)) return null
  return new Date(Number(ymd.slice(0, 4)), Number(ymd.slice(4, 6)) - 1, Number(ymd.slice(6, 8)))
}

export function isValidYmd(ymd) {
  return typeof ymd === 'string' && /^\d{8}$/.test(ymd)
}

// YYYYMMDD → YYYY.MM.DD
export function formatYmd(ymd) {
  if (!isValidYmd(ymd)) return ''
  return `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`
}

export function formatPeriod(startYmd, endYmd) {
  const start = formatYmd(startYmd)
  const end = formatYmd(endYmd)
  if (!start && !end) return ''
  if (start === end || !end) return start
  return `${start} - ${end}`
}

// a에서 b까지의 일수 (b가 이후면 양수)
export function diffDays(fromYmd, toYmdValue) {
  const from = parseYmd(fromYmd)
  const to = parseYmd(toYmdValue)
  if (!from || !to) return null
  return Math.round((to - from) / 86400000)
}

export function addDays(ymd, days) {
  const date = parseYmd(ymd)
  date.setDate(date.getDate() + days)
  return toYmd(date)
}

// 진행 중: 시작일 <= today <= 종료일
export function isOngoing(festival, today) {
  return festival.startDate <= today && today <= festival.endDate
}

// 예정: today < 시작일
export function isUpcoming(festival, today) {
  return today < festival.startDate
}

// 종료: 종료일 < today
export function isEnded(festival, today) {
  return festival.endDate < today
}

// 축제 기간이 [rangeStart, rangeEnd] 와 하루라도 겹치는지
export function overlapsRange(festival, rangeStart, rangeEnd) {
  return festival.startDate <= rangeEnd && festival.endDate >= rangeStart
}

export function getMonthRange(ymd) {
  const year = Number(ymd.slice(0, 4))
  const month = Number(ymd.slice(4, 6))
  const lastDay = new Date(year, month, 0).getDate()
  return {
    start: `${year}${pad(month)}01`,
    end: `${year}${pad(month)}${pad(lastDay)}`,
  }
}

// 이번 달: 기준일이 속한 월과 축제 기간이 겹치는 축제
export function isInMonth(festival, ymd) {
  const { start, end } = getMonthRange(ymd)
  return overlapsRange(festival, start, end)
}

// 특정 날짜에 진행되는 축제
export function isOnDate(festival, ymd) {
  return festival.startDate <= ymd && ymd <= festival.endDate
}

export function formatTodayLabel(ymd) {
  const date = parseYmd(ymd)
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`
}

// 이번 주: 기준일이 속한 주의 월요일 ~ 일요일
export function getWeekRange(ymd) {
  const date = parseYmd(ymd)
  const offsetFromMonday = (date.getDay() + 6) % 7
  const start = addDays(ymd, -offsetFromMonday)
  return { start, end: addDays(start, 6) }
}

// <input type="date"> 값(YYYY-MM-DD) ↔ YYYYMMDD
export function inputValueToYmd(value) {
  const ymd = (value ?? '').replaceAll('-', '')
  return isValidYmd(ymd) ? ymd : ''
}

export function ymdToInputValue(ymd) {
  if (!isValidYmd(ymd)) return ''
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`
}
