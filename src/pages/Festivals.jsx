import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FilterBar from '../components/FilterBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PagedFestivalGrid from '../components/PagedFestivalGrid'
import { findRegionById } from '../data/regions'
import { formatPeriod, isValidYmd } from '../utils/date'
import {
  DEFAULT_FILTERS,
  filterFestivals,
  getPeriodRange,
  getResultLabel,
  hasActiveFilters,
  PERIOD_OPTIONS,
  STATUS_OPTIONS,
} from '../utils/festivalFilter'
import '../styles/festivals.css'

const isOption = (options, value) => options.some((option) => option.value === value)

// URL 쿼리(?q=&region=&period=&from=&to=&status=) → 필터 객체. 잘못된 값은 기본값으로 처리한다.
function readFilters(searchParams) {
  const region = searchParams.get('region')
  const period = searchParams.get('period')
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  return {
    query: searchParams.get('q') ?? '',
    region: findRegionById(region) ? region : DEFAULT_FILTERS.region,
    period: isOption(PERIOD_OPTIONS, period) ? period : DEFAULT_FILTERS.period,
    from: isValidYmd(from) ? from : '',
    to: isValidYmd(to) ? to : '',
    status: isOption(STATUS_OPTIONS, status) ? status : DEFAULT_FILTERS.status,
  }
}

function toSearchParams(filters) {
  const params = {}
  if (filters.query) params.q = filters.query
  if (filters.region !== 'all') params.region = filters.region
  if (filters.period !== 'all') params.period = filters.period
  if (filters.period === 'custom') {
    if (filters.from) params.from = filters.from
    if (filters.to) params.to = filters.to
  }
  if (filters.status !== 'all') params.status = filters.status
  return params
}

// 검색어를 URL에 반영하기까지 기다리는 시간 (입력이 멈췄을 때만 반영)
const QUERY_SYNC_DELAY = 300

export default function Festivals({ festivals, loading, error, onRetry, today }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFilters = useMemo(() => readFilters(searchParams), [searchParams])

  // 검색 입력창은 컴포넌트 상태로 즉시 반영한다.
  // URL 값을 입력창에 바로 연결하면 한글 조합(ㅇ→아→안) 도중 값이 덮어써져 글자가 중복 입력된다.
  const [queryInput, setQueryInput] = useState(urlFilters.query)
  // 마지막으로 입력창과 맞춘 URL 검색어. 이 값과 다르면 바깥(초기화·뒤로가기)에서 바뀐 것.
  const [syncedQuery, setSyncedQuery] = useState(urlFilters.query)
  if (urlFilters.query !== syncedQuery) {
    setSyncedQuery(urlFilters.query)
    setQueryInput(urlFilters.query)
  }

  // 한글 조합 중(ㅇ→아→안)에 URL을 바꾸면 조합이 깨져 글자가 중복되므로, 조합이 끝난 뒤에만 반영한다.
  const [composing, setComposing] = useState(false)

  // 입력이 잠시 멈추면 URL(?q=)에 반영 (새로고침·공유 시 검색어 유지)
  useEffect(() => {
    if (composing || queryInput === urlFilters.query) return undefined
    const timer = setTimeout(() => {
      setSyncedQuery(queryInput)
      setSearchParams(toSearchParams({ ...urlFilters, query: queryInput }), { replace: true })
    }, QUERY_SYNC_DELAY)
    return () => clearTimeout(timer)
  }, [composing, queryInput, urlFilters, setSearchParams])

  const filters = useMemo(() => ({ ...urlFilters, query: queryInput }), [urlFilters, queryInput])
  // 검색어 입력 중에도 입력창이 끊기지 않도록 필터링은 지연된 값으로 수행
  const deferredFilters = useDeferredValue(filters)

  const results = useMemo(
    () => filterFestivals(festivals, deferredFilters, today),
    [festivals, deferredFilters, today],
  )
  const range = getPeriodRange(deferredFilters, today)

  const updateFilters = (patch) => {
    if ('query' in patch) {
      setQueryInput(patch.query)
      return
    }
    // 아직 URL에 반영되지 않은 검색어도 함께 저장
    setSyncedQuery(queryInput)
    setSearchParams(toSearchParams({ ...filters, ...patch }), { replace: true })
  }
  const resetFilters = () => {
    setQueryInput('')
    setSyncedQuery('')
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="festivals container">
      <section className="page-intro">
        <h1 className="page-intro__title">전국 축제</h1>
        <p className="page-intro__desc">현재 대한민국에서 열리는 다양한 축제를 만나보세요.</p>
      </section>

      <FilterBar
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
        canReset={hasActiveFilters(filters)}
        onQueryComposingChange={setComposing}
      />

      {loading && <LoadingSkeleton count={8} />}

      {!loading && error && (
        <ErrorState
          title="축제 정보를 불러오지 못했습니다."
          description="잠시 후 다시 시도해주세요."
          detail={error.message}
          onRetry={onRetry}
        />
      )}

      {!loading && !error && (
        <section aria-labelledby="festivals-result-title">
          <div className="festivals-result" aria-live="polite">
            <h2 id="festivals-result-title" className="festivals-result__title">
              {getResultLabel(deferredFilters)}
              <span className="festivals-result__count">{results.length}개</span>
            </h2>
            {range && <p className="festivals-result__range">기간 {formatPeriod(range.start, range.end)}</p>}
          </div>

          {results.length > 0 ? (
            <PagedFestivalGrid key={JSON.stringify(deferredFilters)} festivals={results} today={today} />
          ) : (
            <EmptyState
              title="조건에 맞는 축제가 없습니다."
              description="필터를 변경해 다른 축제를 찾아보세요."
            />
          )}
        </section>
      )}
    </div>
  )
}
