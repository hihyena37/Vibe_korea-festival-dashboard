import { useMemo } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PagedFestivalGrid from '../components/PagedFestivalGrid'
import StatsCard from '../components/StatsCard'
import UiIcon from '../components/UiIcon'
import WeatherCard from '../components/WeatherCard'
import { findRegionById, REGIONS } from '../data/regions'
import useWeather from '../hooks/useWeather'
import { isEnded, isInMonth, isOngoing, isUpcoming } from '../utils/date'
import { DEFAULT_FILTERS, filterFestivals } from '../utils/festivalFilter'
import '../styles/festivals.css'
import '../styles/region.css'

function RegionNav() {
  return (
    <nav className="region-nav" aria-label="지역 선택">
      <ul className="region-nav__list">
        {REGIONS.map((region) => (
          <li key={region.id}>
            <NavLink
              to={`/region/${region.id}`}
              className={({ isActive }) => `region-nav__link${isActive ? ' is-active' : ''}`}
            >
              {region.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function RegionWeather({ region }) {
  const { weather, loading, error, reload } = useWeather(region.latitude, region.longitude)
  return (
    <WeatherCard regionName={region.fullName} weather={weather} loading={loading} error={error} onRetry={reload} />
  )
}

export default function Region({ festivals, loading, error, onRetry, today }) {
  const { regionId } = useParams()
  const region = findRegionById(regionId)

  const summary = useMemo(() => {
    if (!region) return null
    // 지역 판별 · 정렬은 FESTIVALS 페이지와 같은 필터 로직을 사용
    const regionFestivals = filterFestivals(festivals, { ...DEFAULT_FILTERS, region: region.id }, today)
    return {
      total: regionFestivals.length,
      ongoing: regionFestivals.filter((f) => isOngoing(f, today)).length,
      thisMonth: regionFestivals.filter((f) => isInMonth(f, today)).length,
      upcoming: regionFestivals.filter((f) => isUpcoming(f, today)).length,
      // 목록은 진행중 + 예정만 (종료 축제는 FESTIVALS 페이지에서 확인)
      visible: regionFestivals.filter((f) => !isEnded(f, today)),
    }
  }, [festivals, region, today])

  if (!region) {
    return (
      <div className="container page-pad">
        <EmptyState title="지역을 찾을 수 없습니다." description="아래에서 지역을 선택해주세요." />
        <RegionNav />
      </div>
    )
  }

  const month = Number(today.slice(4, 6))

  return (
    <div className="region container">
      <section className="page-intro region-intro">
        <p className="region-intro__eyebrow">
          <UiIcon name="pin" />
          {region.id.toUpperCase()}
        </p>
        <h1 className="page-intro__title">{region.fullName}</h1>
        <p className="page-intro__desc">지금 {region.name}에서 열리는 축제와 오늘의 날씨</p>
      </section>

      <RegionNav />

      <div className="region-dashboard">
        {/* 지역이 바뀌면 key로 날씨 영역을 새로 마운트 */}
        <RegionWeather key={region.id} region={region} />

        <section className="region-stats" aria-label={`${region.name} 축제 현황`}>
          {loading &&
            Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton region-stats__skeleton" />)}
          {!loading && !error && (
            <>
              <StatsCard
                label="현재 진행"
                value={summary.ongoing}
                description="오늘 열리고 있는 축제"
                tone="ongoing"
                icon={<UiIcon name="activity" />}
              />
              <StatsCard
                label="이번 달"
                value={summary.thisMonth}
                description={`${month}월 중 기간이 포함된 축제`}
                icon={<UiIcon name="calendar" />}
              />
              <StatsCard
                label="예정"
                value={summary.upcoming}
                description="시작 예정인 축제"
                tone="upcoming"
                icon={<UiIcon name="clock" />}
              />
            </>
          )}
          {!loading && error && (
            <p className="region-stats__error">축제 정보를 불러오지 못해 통계를 표시할 수 없습니다.</p>
          )}
        </section>
      </div>

      <section className="festival-section" aria-labelledby="region-festivals-title">
        <div className="section-head">
          <h2 id="region-festivals-title" className="section-title">
            {region.name}에서 열리는 축제
            {!loading && !error && <span className="section-title__count">{summary.visible.length}</span>}
          </h2>
          {!loading && !error && summary.total > summary.visible.length && (
            <Link to={`/festivals?region=${region.id}`} className="section-head__more">
              종료 축제 포함 전체보기 →
            </Link>
          )}
        </div>

        {loading && <LoadingSkeleton count={4} />}

        {!loading && error && (
          <ErrorState
            title="축제 정보를 불러오지 못했습니다."
            description="잠시 후 다시 시도해주세요."
            detail={error.message}
            onRetry={onRetry}
          />
        )}

        {!loading &&
          !error &&
          (summary.visible.length > 0 ? (
            <PagedFestivalGrid key={region.id} festivals={summary.visible} today={today} />
          ) : (
            <EmptyState
              title={`${region.name}에서 진행 중이거나 예정된 축제가 없습니다.`}
              description="다른 지역을 선택해 축제를 찾아보세요."
            />
          ))}
      </section>
    </div>
  )
}
