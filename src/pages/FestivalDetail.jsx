import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FestivalNotFoundError } from '../api/tourApi'
import CurrentWeatherCard from '../components/CurrentWeatherCard'
import ErrorState from '../components/ErrorState'
import ExpandableText from '../components/ExpandableText'
import FavoriteButton from '../components/FavoriteButton'
import FestivalStatusBadge from '../components/FestivalStatusBadge'
import UiIcon from '../components/UiIcon'
import { findRegionByFestival } from '../data/regions'
import useFestivalDetail from '../hooks/useFestivalDetail'
import { formatPeriod, isValidYmd } from '../utils/date'
import '../styles/festival.css'
import '../styles/states.css'
import '../styles/festival-detail.css'

const SITE_TITLE_SUFFIX = 'FESTIVAL NOW'

// TourAPI mapx = 경도, mapy = 위도. 값이 없거나 0이면 좌표 없음으로 본다.
function getCoordinates(festival) {
  const latitude = Number(festival.mapy)
  const longitude = Number(festival.mapx)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude === 0 || longitude === 0) return null
  return { latitude, longitude }
}

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  // 앱 안에서 이동해 온 경우에만 history 뒤로가기, 주소로 바로 들어온 경우 목록으로
  const hasHistory = location.key !== 'default'

  return (
    <button
      type="button"
      className="detail-back"
      onClick={() => (hasHistory ? navigate(-1) : navigate('/festivals'))}
    >
      <UiIcon name="arrowLeft" />
      {hasHistory ? '이전 페이지' : '축제 목록'}
    </button>
  )
}

function DetailImage({ festival }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="detail-hero__media">
      {festival.image && !failed ? (
        <img src={festival.image} alt={`${festival.title} 대표 이미지`} onError={() => setFailed(true)} />
      ) : (
        <div className="festival-card__placeholder" role="img" aria-label="대표 이미지 없음">
          <span>FESTIVAL NOW</span>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="detail-info__row">
      <dt>
        <UiIcon name={icon} />
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}

const EMPTY = <span className="detail-info__empty">정보 없음</span>

function DetailContent({ festival, today }) {
  const region = findRegionByFestival(festival)
  const coords = getCoordinates(festival)
  const hasPeriod = isValidYmd(festival.startDate) && isValidYmd(festival.endDate)
  const address = [festival.addr1, festival.addr2].filter(Boolean).join(' ')
  const placeLabel = festival.place || festival.addr1

  // 날씨 좌표: 소속 지역의 대표 좌표 → 없으면 축제 좌표 → 둘 다 없으면 표시하지 않음
  const weatherTarget = region
    ? { label: region.fullName, latitude: region.latitude, longitude: region.longitude }
    : coords && { label: '축제 장소 주변', ...coords }

  return (
    <>
      <section className="detail-hero">
        <DetailImage festival={festival} />
        <div className="detail-hero__info">
          {hasPeriod && <FestivalStatusBadge festival={festival} today={today} />}
          <h1 className="detail-hero__title">{festival.title}</h1>
          <ul className="detail-hero__meta">
            {hasPeriod && (
              <li>
                <UiIcon name="calendar" />
                {formatPeriod(festival.startDate, festival.endDate)}
              </li>
            )}
            {placeLabel && (
              <li>
                <UiIcon name="pin" />
                {placeLabel}
              </li>
            )}
          </ul>
          <div className="detail-hero__actions">
            <FavoriteButton festival={festival} variant="labeled" />
            {region && (
              <Link to={`/region/${region.id}`} className="detail-hero__region">
                {region.fullName} 축제 더 보기 →
              </Link>
            )}
          </div>
        </div>
      </section>

      {festival.overview && (
        <section className="detail-section" aria-labelledby="detail-overview-title">
          <h2 id="detail-overview-title" className="detail-section__title">
            축제 소개
          </h2>
          <ExpandableText id="detail-overview" text={festival.overview} />
        </section>
      )}

      {festival.program && (
        <section className="detail-section" aria-labelledby="detail-program-title">
          <h2 id="detail-program-title" className="detail-section__title">
            행사 내용
          </h2>
          <ExpandableText id="detail-program" text={festival.program} />
        </section>
      )}

      <div className="detail-columns">
        <section className="detail-section detail-info" aria-labelledby="detail-info-title">
          <h2 id="detail-info-title" className="detail-section__title">
            행사 정보
          </h2>
          <dl className="detail-info__list">
            <InfoRow icon="calendar" label="기간">
              {hasPeriod ? formatPeriod(festival.startDate, festival.endDate) : EMPTY}
            </InfoRow>
            {festival.playtime && (
              <InfoRow icon="clock" label="운영 시간">
                <span className="detail-info__multiline">{festival.playtime}</span>
              </InfoRow>
            )}
            <InfoRow icon="building" label="장소">
              {festival.place || EMPTY}
            </InfoRow>
            <InfoRow icon="pin" label="주소">
              {address || EMPTY}
            </InfoRow>
            {festival.fee && (
              <InfoRow icon="ticket" label="이용 요금">
                <span className="detail-info__multiline">{festival.fee}</span>
              </InfoRow>
            )}
            {festival.sponsor && (
              <InfoRow icon="users" label="주최">
                {festival.sponsor}
              </InfoRow>
            )}
            <InfoRow icon="phone" label="문의">
              {festival.tel ? (
                <span className="detail-info__multiline">
                  {festival.tel}
                  {festival.telName && <span className="detail-info__sub"> · {festival.telName}</span>}
                </span>
              ) : (
                EMPTY
              )}
            </InfoRow>
            <InfoRow icon="globe" label="홈페이지">
              {festival.links.length > 0 ? (
                <ul className="detail-info__links">
                  {festival.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label || '홈페이지'} ${link.url} (새 창에서 열림)`}
                      >
                        {link.label ? `${link.label} · ` : ''}
                        <span className="detail-info__url">{link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                        <UiIcon name="external" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                EMPTY
              )}
            </InfoRow>
          </dl>
        </section>

        {weatherTarget && (
          <CurrentWeatherCard
            locationLabel={weatherTarget.label}
            latitude={weatherTarget.latitude}
            longitude={weatherTarget.longitude}
          />
        )}
      </div>

      {(coords || festival.addr1) && (
        <section className="detail-section detail-location" aria-labelledby="detail-location-title">
          <h2 id="detail-location-title" className="detail-section__title">
            위치 정보
          </h2>
          <div className="detail-location__body">
            <div>
              {address && <p className="detail-location__address">{address}</p>}
              {coords && (
                <p className="detail-location__coords">
                  위도 {coords.latitude.toFixed(5)} · 경도 {coords.longitude.toFixed(5)}
                </p>
              )}
            </div>
            <div className="detail-location__links">
              {coords && (
                <a
                  className="detail-location__link"
                  href={`https://map.kakao.com/link/map/${encodeURIComponent(festival.title)},${coords.latitude},${coords.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`카카오맵에서 ${festival.title} 위치 보기 (새 창에서 열림)`}
                >
                  <UiIcon name="map" />
                  카카오맵에서 보기
                </a>
              )}
              {festival.addr1 && (
                <a
                  className="detail-location__link"
                  href={`https://map.naver.com/p/search/${encodeURIComponent(festival.addr1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`네이버 지도에서 ${festival.addr1} 검색 (새 창에서 열림)`}
                >
                  <UiIcon name="map" />
                  네이버 지도에서 검색
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function DetailSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <p className="loading__message">축제 정보를 불러오고 있습니다.</p>
      <div className="detail-hero" aria-hidden="true">
        <div className="detail-hero__media skeleton" />
        <div className="detail-hero__info">
          <div className="skeleton skeleton-line skeleton-line--short" />
          <div className="skeleton detail-skeleton__title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--short" />
        </div>
      </div>
    </div>
  )
}

export default function FestivalDetail({ today }) {
  const { contentId } = useParams()
  const { festival, loading, error, reload } = useFestivalDetail(contentId)

  // 상세 진입 시 '축제명 | FESTIVAL NOW', 떠날 때 원래 title 복구
  useEffect(() => {
    if (!festival?.title) return undefined
    const previousTitle = document.title
    document.title = `${festival.title} | ${SITE_TITLE_SUFFIX}`
    return () => {
      document.title = previousTitle
    }
  }, [festival?.title])

  const notFound = error instanceof FestivalNotFoundError

  return (
    <div className="festival-detail container">
      <BackButton />

      {loading && <DetailSkeleton />}

      {!loading && error && (
        <div className="detail-error">
          <ErrorState
            title="축제 정보를 불러오지 못했습니다."
            description={notFound ? '존재하지 않거나 삭제된 축제입니다.' : '잠시 후 다시 시도해주세요.'}
            detail={notFound ? null : error.message}
            onRetry={notFound ? null : reload}
          />
          <p className="center-text">
            <Link to="/festivals" className="detail-error__link">
              축제 목록으로 돌아가기
            </Link>
          </p>
        </div>
      )}

      {!loading && !error && festival && <DetailContent festival={festival} today={today} />}
    </div>
  )
}
