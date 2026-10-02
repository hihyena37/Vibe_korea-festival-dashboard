import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { findRegionByFestival } from '../data/regions'
import { formatPeriod, isValidYmd } from '../utils/date'
import FavoriteButton from './FavoriteButton'
import FestivalStatusBadge from './FestivalStatusBadge'
import '../styles/festival.css'

// 주소의 시·도 + 시·군·구까지만 표시 (예: 경상남도 진주시)
function getLocationLabel(festival) {
  if (festival.addr1) return festival.addr1.split(' ').slice(0, 2).join(' ')
  return findRegionByFestival(festival)?.fullName ?? ''
}

// variant: 'default'(세로 카드) | 'compact'(가로형, 캘린더 목록용)
export default function FestivalCard({ festival, today, variant = 'default' }) {
  const navigate = useNavigate()
  const [imageFailed, setImageFailed] = useState(false)
  const location = getLocationLabel(festival)
  const showImage = festival.image && !imageFailed
  const detailPath = `/festival/${festival.id}`

  // 카드 어디를 눌러도 상세로 이동. 링크(제목)와 버튼(관심 축제)은 각자 동작하므로 제외한다.
  // 링크 영역을 카드 전체로 덮지 않아야 터치 기기에서 하트 버튼이 링크에 가로채이지 않는다.
  const handleCardClick = (event) => {
    if (event.defaultPrevented || event.target.closest('a, button')) return
    navigate(detailPath)
  }

  return (
    <article
      className={`festival-card${variant === 'compact' ? ' festival-card--compact' : ''}`}
      onClick={handleCardClick}
    >
      <div className="festival-card__media">
        {showImage ? (
          <img
            src={festival.image}
            alt={`${festival.title} 대표 이미지`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="festival-card__placeholder" role="img" aria-label="대표 이미지 없음">
            <span>FESTIVAL NOW</span>
          </div>
        )}
        {/* 기간 정보가 없는 경우(저장된 관심 축제 등) 상태를 계산하지 않는다 */}
        {isValidYmd(festival.startDate) && isValidYmd(festival.endDate) && (
          <div className="festival-card__badge">
            <FestivalStatusBadge festival={festival} today={today} />
          </div>
        )}
        <FavoriteButton festival={festival} />
      </div>
      <div className="festival-card__body">
        <h3 className="festival-card__title">
          {/* 키보드 · 스크린리더 · 새 탭 열기용 실제 링크 */}
          <Link to={detailPath} className="festival-card__link">
            {festival.title}
          </Link>
        </h3>
        {location && <p className="festival-card__location">{location}</p>}
        <p className="festival-card__period">{formatPeriod(festival.startDate, festival.endDate)}</p>
      </div>
    </article>
  )
}
