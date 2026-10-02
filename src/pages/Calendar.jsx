import { useMemo, useState } from 'react'
import { getFestivalDataStartDate } from '../api/tourApi'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FestivalCalendar, { CalendarSkeleton } from '../components/FestivalCalendar'
import PagedFestivalGrid from '../components/PagedFestivalGrid'
import UiIcon from '../components/UiIcon'
import { findRegionById, REGIONS } from '../data/regions'
import {
  buildCalendarMap,
  formatDateLabel,
  formatMonthLabel,
  getCalendarDays,
  getMonthKey,
  shiftMonth,
} from '../utils/calendar'
import { formatYmd } from '../utils/date'
import { DEFAULT_FILTERS, filterFestivals } from '../utils/festivalFilter'
import '../styles/festivals.css'
import '../styles/filter.css'
import '../styles/calendar.css'

const LIST_PAGE_SIZE = 10

export default function Calendar({ festivals, loading, error, onRetry, today }) {
  const todayMonth = getMonthKey(today)
  // 이 날짜 이전 일정은 기존 TourAPI 조회 범위 밖이라 불완전하므로 이동/선택을 막는다.
  const [minDate] = useState(() => getFestivalDataStartDate(today))
  const minMonth = getMonthKey(minDate)

  const [viewMonth, setViewMonth] = useState(todayMonth)
  const [selectedDate, setSelectedDate] = useState(today)
  const [region, setRegion] = useState('all')

  // 지역 필터 + 정렬은 FESTIVALS 페이지와 같은 로직 재사용
  const regionFestivals = useMemo(
    () => filterFestivals(festivals, { ...DEFAULT_FILTERS, region }, today),
    [festivals, region, today],
  )
  const days = useMemo(() => getCalendarDays(viewMonth), [viewMonth])
  // 현재 화면 grid 범위(앞뒤 달 날짜 포함)의 날짜별 축제 목록
  const calendarMap = useMemo(
    () => buildCalendarMap(regionFestivals, days[0].ymd, days[days.length - 1].ymd),
    [regionFestivals, days],
  )
  const selectedFestivals = calendarMap[selectedDate] ?? []

  const goToMonth = (monthKey) => {
    if (monthKey < minMonth) return
    setViewMonth(monthKey)
    // 오늘이 있는 달이면 오늘, 아니면 1일을 선택
    setSelectedDate(monthKey === todayMonth ? today : `${monthKey}01`)
  }

  const handleSelectDate = (ymd) => {
    // 이전·다음 달 날짜를 누르면 그 달로 이동하면서 선택
    if (getMonthKey(ymd) !== viewMonth) setViewMonth(getMonthKey(ymd))
    setSelectedDate(ymd)
  }

  const regionInfo = findRegionById(region)
  const ready = !loading && !error

  return (
    <div className="calendar-page container">
      <section className="page-intro">
        <p className="calendar-page__eyebrow">CALENDAR</p>
        <h1 className="page-intro__title">축제 캘린더</h1>
        <p className="page-intro__desc">전국 축제를 날짜별로 확인해보세요.</p>
      </section>

      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button
            type="button"
            className="calendar-nav__arrow"
            onClick={() => goToMonth(shiftMonth(viewMonth, -1))}
            disabled={shiftMonth(viewMonth, -1) < minMonth}
            aria-label="이전 달"
          >
            <UiIcon name="chevronLeft" />
          </button>
          <h2 className="calendar-nav__label" aria-live="polite">
            {formatMonthLabel(viewMonth)}
          </h2>
          <button
            type="button"
            className="calendar-nav__arrow"
            onClick={() => goToMonth(shiftMonth(viewMonth, 1))}
            aria-label="다음 달"
          >
            <UiIcon name="chevronRight" />
          </button>
          <button
            type="button"
            className="calendar-nav__today"
            onClick={() => goToMonth(todayMonth)}
            disabled={viewMonth === todayMonth && selectedDate === today}
          >
            오늘
          </button>
        </div>

        <label className="filter-select calendar-toolbar__region">
          <span className="filter-group__label">지역</span>
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="all">전국</option>
            {REGIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="calendar-page__range">{formatYmd(minDate)} 이후 진행되는 축제 일정을 제공합니다.</p>

      {error && !loading && (
        <ErrorState
          title="축제 일정을 불러오지 못했습니다."
          description="잠시 후 다시 시도해주세요."
          detail={error.message}
          onRetry={onRetry}
        />
      )}

      {!error && (
        <div className="calendar-layout">
          <div className="calendar-layout__main">
            {loading ? (
              <>
                <p className="loading__message" role="status">
                  축제 일정을 불러오고 있습니다.
                </p>
                <CalendarSkeleton />
              </>
            ) : (
              <FestivalCalendar
                days={days}
                calendarMap={calendarMap}
                selectedDate={selectedDate}
                today={today}
                minDate={minDate}
                onSelectDate={handleSelectDate}
              />
            )}
          </div>

          <section className="calendar-day-panel" aria-labelledby="calendar-day-title" aria-live="polite">
            <div className="calendar-day-panel__head">
              <h2 id="calendar-day-title" className="calendar-day-panel__date">
                {formatDateLabel(selectedDate)}
              </h2>
              {ready && (
                <p className="calendar-day-panel__count">
                  {regionInfo ? `${regionInfo.name} · ` : ''}진행 중인 축제
                  <strong>{selectedFestivals.length}개</strong>
                </p>
              )}
            </div>

            {ready &&
              (selectedFestivals.length > 0 ? (
                <PagedFestivalGrid
                  key={`${selectedDate}-${region}`}
                  festivals={selectedFestivals}
                  today={today}
                  variant="compact"
                  pageSize={LIST_PAGE_SIZE}
                />
              ) : (
                <EmptyState title="이 날짜에 진행 중인 축제가 없습니다." description="다른 날짜를 선택해보세요." />
              ))}
          </section>
        </div>
      )}
    </div>
  )
}
