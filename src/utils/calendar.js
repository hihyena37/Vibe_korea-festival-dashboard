import { addDays, getMonthRange, overlapsRange, parseYmd, toYmd } from './date'

// 월은 'YYYYMM', 날짜는 'YYYYMMDD' 문자열로 다룬다. (date.js와 동일한 규칙)

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export const getMonthKey = (ymd) => ymd.slice(0, 6)

export function shiftMonth(monthKey, diff) {
  const date = new Date(Number(monthKey.slice(0, 4)), Number(monthKey.slice(4, 6)) - 1 + diff, 1)
  return getMonthKey(toYmd(date))
}

export function formatMonthLabel(monthKey) {
  return `${monthKey.slice(0, 4)}년 ${Number(monthKey.slice(4, 6))}월`
}

export function formatDateLabel(ymd) {
  const date = parseYmd(ymd)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`
}

// 일요일 시작 달력 grid. 첫 주/마지막 주의 빈칸은 이전·다음 달 날짜로 채운다. (5~6주)
export function getCalendarDays(monthKey) {
  const firstYmd = `${monthKey}01`
  const lastYmd = getMonthRange(firstYmd).end
  const start = addDays(firstYmd, -parseYmd(firstYmd).getDay())
  const end = addDays(lastYmd, 6 - parseYmd(lastYmd).getDay())

  const days = []
  for (let ymd = start; ymd <= end; ymd = addDays(ymd, 1)) {
    days.push({ ymd, day: Number(ymd.slice(6, 8)), weekday: days.length % 7, inMonth: getMonthKey(ymd) === monthKey })
  }
  return days
}

// 달력 범위 [startYmd, endYmd] 안의 날짜별 진행 축제 { 'YYYYMMDD': festival[] }
// 축제 기간(시작일~종료일)의 모든 날짜에 축제를 넣는다. 시작일에만 표시하지 않는다.
// 입력 순서를 유지하므로 정렬된 목록을 넣으면 날짜별 목록도 같은 순서가 된다.
export function buildCalendarMap(festivals, startYmd, endYmd) {
  const map = {}
  for (const festival of festivals) {
    if (!overlapsRange(festival, startYmd, endYmd)) continue
    const from = festival.startDate > startYmd ? festival.startDate : startYmd
    const to = festival.endDate < endYmd ? festival.endDate : endYmd
    for (let ymd = from; ymd <= to; ymd = addDays(ymd, 1)) {
      if (!map[ymd]) map[ymd] = []
      map[ymd].push(festival)
    }
  }
  return map
}
