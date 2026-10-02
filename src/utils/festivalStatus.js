import { diffDays, isEnded, isOngoing } from './date'

// 종료 임박으로 표시할 기준 일수
const ENDING_SOON_DAYS = 3

// 상태는 데이터에 저장하지 않고, 기준일(today)로 매번 계산한다.
// type: 'ongoing' | 'upcoming' | 'ended'
export function getFestivalStatus(festival, today) {
  if (isEnded(festival, today)) {
    return { type: 'ended', label: '종료' }
  }

  if (isOngoing(festival, today)) {
    if (festival.startDate === today) return { type: 'ongoing', label: '오늘 시작' }
    const daysLeft = diffDays(today, festival.endDate)
    if (daysLeft === 0) return { type: 'ongoing', label: '오늘 종료' }
    if (daysLeft <= ENDING_SOON_DAYS) return { type: 'ongoing', label: `종료 D-${daysLeft}` }
    return { type: 'ongoing', label: '진행중' }
  }

  const daysUntil = diffDays(today, festival.startDate)
  return { type: 'upcoming', label: `D-${daysUntil}` }
}
