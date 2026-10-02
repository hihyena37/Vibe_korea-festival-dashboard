import { Link } from 'react-router-dom'
import RegionWeatherSummary from './RegionWeatherSummary'
import UiIcon from './UiIcon'

const TOP_COUNT = 5

function DefaultPanel({ regions, festivalCounts }) {
  const topRegions = [...regions]
    .sort((a, b) => festivalCounts[b.id].monthly - festivalCounts[a.id].monthly)
    .slice(0, TOP_COUNT)

  return (
    <div className="map-panel map-panel--empty">
      <p className="map-panel__empty-title">
        <UiIcon name="pin" />
        지도에서 지역을 선택해보세요.
      </p>
      <p className="map-panel__empty-desc">지역을 선택하면 축제 수와 오늘 날씨를 볼 수 있습니다.</p>

      <h3 className="map-panel__rank-title">이번 달 축제가 많은 지역</h3>
      <ol className="map-panel__rank">
        {topRegions.map((region, i) => (
          <li key={region.id}>
            <Link to={`/region/${region.id}`} className="map-panel__rank-link">
              <span className="map-panel__rank-no">{i + 1}</span>
              <span className="map-panel__rank-name">{region.fullName}</span>
              <span className="map-panel__rank-count">{festivalCounts[region.id].monthly}개</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

// 지도에서 hover / 선택한 지역 정보
export default function RegionMapPanel({ region, regions, festivalCounts, weatherState }) {
  if (!region) return <DefaultPanel regions={regions} festivalCounts={festivalCounts} />

  const counts = festivalCounts[region.id]

  return (
    <div className="map-panel" aria-live="polite">
      <p className="map-panel__eyebrow">{region.id.toUpperCase()}</p>
      <h3 className="map-panel__title">{region.fullName}</h3>

      <dl className="map-panel__stats">
        <div className="map-panel__stat map-panel__stat--ongoing">
          <dt>
            <UiIcon name="activity" />
            현재 진행
          </dt>
          <dd>
            {counts.ongoing}
            <span>개</span>
          </dd>
        </div>
        <div className="map-panel__stat">
          <dt>
            <UiIcon name="calendar" />
            이번 달
          </dt>
          <dd>
            {counts.monthly}
            <span>개</span>
          </dd>
        </div>
      </dl>

      <div className="map-panel__weather">
        <p className="map-panel__weather-title">오늘 날씨</p>
        <RegionWeatherSummary status={weatherState.status} weather={weatherState.weather} size="large" />
      </div>

      <Link to={`/region/${region.id}`} className="map-panel__link">
        {region.name} 축제 보기 →
      </Link>
    </div>
  )
}
