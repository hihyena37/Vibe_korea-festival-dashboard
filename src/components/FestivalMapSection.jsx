import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findRegionById, REGIONS } from '../data/regions'
import useLazyRegionWeather from '../hooks/useLazyRegionWeather'
import { MAP_LEVELS } from '../utils/regionStats'
import KoreaMap from './KoreaMap'
import RegionMapPanel from './RegionMapPanel'
import RegionWeatherSummary from './RegionWeatherSummary'
import '../styles/festival-map.css'

function MapLegend() {
  return (
    <div className="map-legend">
      <p className="map-legend__title">
        지도 기준 <strong>이번 달 축제 수</strong>
      </p>
      <ul className="map-legend__list">
        {MAP_LEVELS.map((level, i) => (
          <li key={level.label}>
            <span className={`map-legend__swatch map-legend__swatch--level-${i}`} aria-hidden="true" />
            {level.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

// HOME 전국 축제 지도: 지도 + 지역 정보 패널
// festivalCounts는 상위(Home)에서 계산해 전달받는다.
export default function FestivalMapSection({ festivalCounts }) {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  // hover가 선택보다 우선. 마우스를 떼면 선택한 지역 정보로 돌아간다.
  const activeRegion = findRegionById(hoveredId ?? selectedId)
  const weatherState = useLazyRegionWeather(activeRegion)

  const renderTooltip = (regionId) => {
    const region = findRegionById(regionId)
    const counts = festivalCounts[regionId]
    return (
      <>
        <p className="map-tooltip__title">{region.fullName}</p>
        <dl className="map-tooltip__stats">
          <div>
            <dt>현재 진행</dt>
            <dd>{counts.ongoing}개</dd>
          </div>
          <div>
            <dt>이번 달</dt>
            <dd>{counts.monthly}개</dd>
          </div>
        </dl>
        <RegionWeatherSummary status={weatherState.status} weather={weatherState.weather} />
      </>
    )
  }

  return (
    <section className="festival-map" aria-labelledby="festival-map-title">
      <div className="section-head">
        <h2 id="festival-map-title" className="section-title">
          전국 축제 지도
        </h2>
        <p className="festival-map__hint">
          <span className="festival-map__hint--pointer">지역을 클릭하면 지역 페이지로 이동합니다.</span>
          <span className="festival-map__hint--touch">지역을 탭해 선택하고, 한 번 더 탭하면 이동합니다.</span>
        </p>
      </div>

      <div className="festival-map__body">
        <div className="festival-map__map">
          <KoreaMap
            regions={REGIONS}
            festivalCounts={festivalCounts}
            hoveredRegion={hoveredId}
            selectedRegion={selectedId}
            onHoverRegion={setHoveredId}
            onSelectRegion={setSelectedId}
            onOpenRegion={(regionId) => navigate(`/region/${regionId}`)}
            renderTooltip={renderTooltip}
          />
          <MapLegend />
        </div>

        <RegionMapPanel
          region={activeRegion}
          regions={REGIONS}
          festivalCounts={festivalCounts}
          weatherState={weatherState}
        />
      </div>
    </section>
  )
}
