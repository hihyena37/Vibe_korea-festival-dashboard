import { findRegionByFestival, findRegionById } from '../data/regions'
import { getMonthRange, getWeekRange, isEnded, isOngoing, isUpcoming, overlapsRange } from './date'

export const PERIOD_OPTIONS = [
  { value: 'all', label: '전체 기간' },
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'custom', label: '날짜 선택' },
]

export const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '진행중' },
  { value: 'upcoming', label: '예정' },
  { value: 'ended', label: '종료' },
]

export const DEFAULT_FILTERS = {
  query: '',
  region: 'all',
  period: 'all',
  from: '',
  to: '',
  status: 'all',
}

const STATUS_MATCHERS = {
  ongoing: isOngoing,
  upcoming: isUpcoming,
  ended: isEnded,
}

// 대소문자·공백 차이를 무시하기 위해 소문자 + 공백 제거
export function normalizeText(text) {
  return (text ?? '').toLowerCase().replace(/\s+/g, '')
}

// 검색어를 공백 기준 토큰으로 나눈다. ('대구 치맥' → ['대구', '치맥'])
export function toSearchTokens(query) {
  return (query ?? '').split(/\s+/).map(normalizeText).filter(Boolean)
}

// 축제명 + 주소 + 지역명(약칭/정식명칭)을 하나의 검색 대상 문자열로 만든다.
function getSearchText(festival) {
  const region = findRegionByFestival(festival)
  return normalizeText(
    [festival.title, festival.addr1, festival.addr2, region?.name, region?.fullName].join(' '),
  )
}

// 모든 토큰이 검색 대상에 포함되어야 일치 (AND)
function matchesSearch(festival, tokens) {
  if (tokens.length === 0) return true
  const text = getSearchText(festival)
  return tokens.every((token) => text.includes(token))
}

// 기간 필터 → 비교할 날짜 범위. 제한이 없으면 null.
export function getPeriodRange(filters, today) {
  switch (filters.period) {
    case 'today':
      return { start: today, end: today }
    case 'week':
      return getWeekRange(today)
    case 'month':
      return getMonthRange(today)
    case 'custom': {
      const { from, to } = filters
      if (!from && !to) return null
      // 한쪽만 선택하면 그 날짜 하루로 본다. 순서가 뒤바뀌면 정렬한다.
      const start = from || to
      const end = to || from
      return start <= end ? { start, end } : { start: end, end: start }
    }
    default:
      return null
  }
}

// 상태 우선순위: 진행중 → 예정 → 종료
const STATUS_ORDER = { ongoing: 0, upcoming: 1, ended: 2 }

function getStatusType(festival, today) {
  if (isOngoing(festival, today)) return 'ongoing'
  if (isUpcoming(festival, today)) return 'upcoming'
  return 'ended'
}

// 진행중은 종료 임박 순, 예정은 시작 임박 순, 종료는 최근 종료 순
function compareFestivals(a, b, today) {
  const typeA = getStatusType(a, today)
  const typeB = getStatusType(b, today)
  if (typeA !== typeB) return STATUS_ORDER[typeA] - STATUS_ORDER[typeB]
  if (typeA === 'ongoing') return a.endDate.localeCompare(b.endDate)
  if (typeA === 'upcoming') return a.startDate.localeCompare(b.startDate)
  return b.endDate.localeCompare(a.endDate)
}

// 검색 · 지역 · 기간 · 상태 조건을 모두 만족하는 축제만 반환 (AND)
export function filterFestivals(festivals, filters, today) {
  const tokens = toSearchTokens(filters.query)
  const range = getPeriodRange(filters, today)
  const matchStatus = STATUS_MATCHERS[filters.status]

  return festivals
    .filter((festival) => {
      if (filters.region !== 'all' && findRegionByFestival(festival)?.id !== filters.region) return false
      if (range && !overlapsRange(festival, range.start, range.end)) return false
      if (matchStatus && !matchStatus(festival, today)) return false
      return matchesSearch(festival, tokens)
    })
    .sort((a, b) => compareFestivals(a, b, today))
}

export function hasActiveFilters(filters) {
  return Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key])
}

// 결과 요약 문구 (예: '대구광역시 진행 중인 축제')
export function getResultLabel(filters) {
  const regionName = findRegionById(filters.region)?.fullName ?? '전국'
  const statusText = {
    ongoing: '진행 중인 ',
    upcoming: '예정된 ',
    ended: '종료된 ',
  }[filters.status] ?? ''
  return `${regionName} ${statusText}축제`
}
