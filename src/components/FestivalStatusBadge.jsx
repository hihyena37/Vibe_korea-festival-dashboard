import { getFestivalStatus } from '../utils/festivalStatus'

export default function FestivalStatusBadge({ festival, today }) {
  const status = getFestivalStatus(festival, today)
  return <span className={`status-badge status-badge--${status.type}`}>{status.label}</span>
}
