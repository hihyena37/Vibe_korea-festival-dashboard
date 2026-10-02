import { useMemo } from 'react'
import ErrorState from '../components/ErrorState'
import FestivalMapSection from '../components/FestivalMapSection'
import FestivalSection from '../components/FestivalSection'
import LoadingSkeleton from '../components/LoadingSkeleton'
import StatsCard from '../components/StatsCard'
import { addDays, formatTodayLabel, isInMonth, isOngoing, isUpcoming } from '../utils/date'
import { getRegionFestivalCounts } from '../utils/regionStats'
import '../styles/home.css'

const PREVIEW_COUNT = 4
// '곧 시작' 기준: 오늘 이후 N일 이내 시작
const SOON_DAYS = 30

const byStartDate = (a, b) => a.startDate.localeCompare(b.startDate)
const byEndDate = (a, b) => a.endDate.localeCompare(b.endDate)

export default function Home({ festivals, loading, error, onRetry, today }) {
  const summary = useMemo(() => {
    const soonLimit = addDays(today, SOON_DAYS)
    const ongoing = festivals.filter((f) => isOngoing(f, today)).sort(byEndDate)
    const soon = festivals
      .filter((f) => isUpcoming(f, today) && f.startDate <= soonLimit)
      .sort(byStartDate)
    const thisMonth = festivals.filter((f) => isInMonth(f, today)).sort(byStartDate)

    // 지도용 지역별 축제 수 (이미 받아온 전국 데이터로 계산)
    const regionCounts = getRegionFestivalCounts(festivals, today)

    return { ongoing, soon, thisMonth, regionCounts }
  }, [festivals, today])

  const month = Number(today.slice(4, 6))

  return (
    <div className="home container">
      <section className="home-intro">
        <p className="home-intro__date">{formatTodayLabel(today)} 기준</p>
        <h1 className="home-intro__title">전국의 축제를 한눈에</h1>
        <p className="home-intro__desc">지금 대한민국에서는 어떤 축제가 열리고 있을까요?</p>
      </section>

      {loading && <LoadingSkeleton />}

      {!loading && error && (
        <ErrorState
          title="축제 정보를 불러오지 못했습니다."
          description="잠시 후 다시 시도해주세요."
          detail={error.message}
          onRetry={onRetry}
        />
      )}

      {!loading && !error && (
        <>
          <div className="home-stats">
            <StatsCard
              label="진행 중"
              value={summary.ongoing.length}
              description="오늘 열리고 있는 축제"
              tone="ongoing"
            />
            <StatsCard
              label="이번 달"
              value={summary.thisMonth.length}
              description={`${month}월 중 기간이 포함된 축제`}
            />
            <StatsCard
              label="곧 시작"
              value={summary.soon.length}
              description={`${SOON_DAYS}일 이내 시작 예정`}
              tone="upcoming"
            />
          </div>

          <FestivalMapSection festivalCounts={summary.regionCounts} />

          <FestivalSection
            title="지금 진행 중인 축제"
            count={summary.ongoing.length}
            festivals={summary.ongoing.slice(0, PREVIEW_COUNT)}
            today={today}
            moreLink="/festivals"
            emptyMessage="현재 진행 중인 축제가 없습니다."
          />
          <FestivalSection
            title="곧 시작하는 축제"
            count={summary.soon.length}
            festivals={summary.soon.slice(0, PREVIEW_COUNT)}
            today={today}
            moreLink="/festivals"
            emptyMessage={`${SOON_DAYS}일 이내 시작 예정인 축제가 없습니다.`}
          />
          <FestivalSection
            title={`${month}월 축제`}
            count={summary.thisMonth.length}
            festivals={summary.thisMonth.slice(0, PREVIEW_COUNT)}
            today={today}
            moreLink="/festivals"
            emptyMessage="이번 달 축제 정보가 없습니다."
          />
        </>
      )}
    </div>
  )
}
