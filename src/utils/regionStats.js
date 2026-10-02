import { findRegionByFestival, REGIONS } from '../data/regions'
import { isInMonth, isOngoing } from './date'

// 지역별 축제 수 { [regionId]: { ongoing, monthly } }
// 이미 받아온 전국 축제 데이터로 계산하므로 추가 API 호출이 없다.
export function getRegionFestivalCounts(festivals, today) {
  const counts = Object.fromEntries(REGIONS.map((region) => [region.id, { ongoing: 0, monthly: 0 }]))

  for (const festival of festivals) {
    const region = findRegionByFestival(festival)
    if (!region) continue
    if (isOngoing(festival, today)) counts[region.id].ongoing += 1
    if (isInMonth(festival, today)) counts[region.id].monthly += 1
  }
  return counts
}

// 지도 색상 기준: 이번 달 축제 수
// 구간은 실제 데이터 분포(2026년 10월 기준 지역별 0~52개)를 보고 정했다.
export const MAP_LEVELS = [
  { min: 0, max: 0, label: '0' },
  { min: 1, max: 5, label: '1~5' },
  { min: 6, max: 14, label: '6~14' },
  { min: 15, max: 29, label: '15~29' },
  { min: 30, max: Infinity, label: '30+' },
]

export function getMapLevel(count) {
  return MAP_LEVELS.findIndex((level) => count >= level.min && count <= level.max)
}
