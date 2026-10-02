import { useRef, useState } from 'react'
import {
  DOKDO_POINT,
  MAP_HEIGHT,
  MAP_WIDTH,
  REGION_LABEL_POINTS,
  REGION_PATHS,
  ULLEUNG_INSET,
} from '../data/koreaMapPaths'
import { getMapLevel } from '../utils/regionStats'
import '../styles/korea-map.css'

// 면적이 넓은 도 단위: 지역 내부에 '이름 + 개수' 2줄 표시. 위치는 기본 계산값을 일부 보정.
const PROVINCE_LABELS = {
  gyeonggi: [284, 172],
  gangwon: [362, 118],
  chungbuk: [312, 214],
  chungnam: [203, 266],
  jeonbuk: [259, 346],
  jeonnam: [262, 462],
  gyeongbuk: [408, 260],
  gyeongnam: [333, 388],
  jeju: [194, 619],
}

// 면적이 작은 광역시: 겹치지 않도록 바깥으로 끌어낸 1줄 라벨 + 연결선
// [라벨 x, 라벨 y, text-anchor]
const CITY_CALLOUTS = {
  seoul: [236, 100, 'middle'],
  incheon: [168, 128, 'end'],
  sejong: [246, 232, 'middle'],
  daejeon: [304, 294, 'start'],
  daegu: [414, 318, 'start'],
  gwangju: [176, 404, 'end'],
  ulsan: [488, 360, 'start'],
  busan: [482, 412, 'start'],
}

const TOOLTIP_WIDTH = 200
const TOOLTIP_OFFSET = 14
const TOOLTIP_HEIGHT = 132

export default function KoreaMap({
  regions,
  festivalCounts,
  hoveredRegion,
  selectedRegion,
  onHoverRegion,
  onSelectRegion,
  onOpenRegion,
  renderTooltip,
}) {
  const wrapRef = useRef(null)
  const pointerRef = useRef({ type: 'mouse', wasSelected: false })
  const [tooltipPos, setTooltipPos] = useState(null)

  const updateTooltip = (event) => {
    const rect = wrapRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    // 오른쪽 공간이 부족하면 커서 왼쪽에 표시해 지도 밖으로 넘치지 않게 한다.
    const flipX = x + TOOLTIP_OFFSET + TOOLTIP_WIDTH > rect.width
    const flipY = y + TOOLTIP_OFFSET + TOOLTIP_HEIGHT > rect.height
    setTooltipPos({
      x: Math.max(0, flipX ? x - TOOLTIP_OFFSET - TOOLTIP_WIDTH : x + TOOLTIP_OFFSET),
      y: Math.max(0, flipY ? y - TOOLTIP_OFFSET - TOOLTIP_HEIGHT : y + TOOLTIP_OFFSET),
    })
  }

  const handlePointerEnter = (regionId, event) => {
    if (event.pointerType !== 'mouse') return
    onHoverRegion(regionId)
    updateTooltip(event)
  }

  const handlePointerMove = (event) => {
    if (event.pointerType === 'mouse') updateTooltip(event)
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType !== 'mouse') return
    onHoverRegion(null)
    setTooltipPos(null)
  }

  const handlePointerDown = (regionId, event) => {
    pointerRef.current = { type: event.pointerType, wasSelected: selectedRegion === regionId }
  }

  // 마우스: 클릭 즉시 지역 페이지로 이동
  // 터치: 첫 탭은 선택(정보 확인), 이미 선택된 지역을 다시 탭하면 이동
  const handleClick = (regionId) => {
    const { type, wasSelected } = pointerRef.current
    if (type === 'mouse' || wasSelected) {
      onOpenRegion(regionId)
    } else {
      onSelectRegion(regionId)
    }
  }

  const handleKeyDown = (regionId, event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenRegion(regionId)
    }
  }

  const regionById = Object.fromEntries(regions.map((region) => [region.id, region]))
  const tooltipRegion = hoveredRegion && tooltipPos ? hoveredRegion : null

  return (
    <div className="korea-map" ref={wrapRef}>
      <svg
        className="korea-map__svg"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="group"
        aria-label="대한민국 지역별 축제 지도. 지역을 선택하면 지역 페이지로 이동합니다."
      >
        <g className="korea-map__regions">
          {regions.map((region) => {
            const counts = festivalCounts[region.id] ?? { ongoing: 0, monthly: 0 }
            return (
              <path
                key={region.id}
                d={REGION_PATHS[region.id]}
                className={`korea-map__region korea-map__region--level-${getMapLevel(counts.monthly)}`}
                tabIndex={0}
                role="button"
                aria-label={`${region.fullName}, 이번 달 축제 ${counts.monthly}개, 현재 진행 ${counts.ongoing}개`}
                aria-current={selectedRegion === region.id ? 'true' : undefined}
                onPointerEnter={(event) => handlePointerEnter(region.id, event)}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={(event) => handlePointerDown(region.id, event)}
                onClick={() => handleClick(region.id)}
                onKeyDown={(event) => handleKeyDown(region.id, event)}
                onFocus={() => onSelectRegion(region.id)}
              />
            )
          })}
        </g>

        {/* hover / 선택 외곽선은 맨 위에 다시 그려 이웃 지역에 가려지지 않게 한다 */}
        {hoveredRegion && hoveredRegion !== selectedRegion && (
          <path className="korea-map__outline korea-map__outline--hover" d={REGION_PATHS[hoveredRegion]} />
        )}
        {selectedRegion && (
          <path className="korea-map__outline korea-map__outline--selected" d={REGION_PATHS[selectedRegion]} />
        )}

        <g className="korea-map__inset" aria-hidden="true">
          <rect
            x={ULLEUNG_INSET.x}
            y={ULLEUNG_INSET.y}
            width={ULLEUNG_INSET.width}
            height={ULLEUNG_INSET.height}
          />
          <text x={ULLEUNG_INSET.x + 6} y={ULLEUNG_INSET.y + 14}>
            울릉도 · 독도
          </text>
          <circle cx={DOKDO_POINT[0]} cy={DOKDO_POINT[1]} r="2.2" />
        </g>

        <g className="korea-map__labels" aria-hidden="true">
          {Object.entries(PROVINCE_LABELS).map(([id, [x, y]]) => (
            <text key={id} x={x} y={y} textAnchor="middle" className="korea-map__label">
              <tspan x={x} className="korea-map__label-name">
                {regionById[id].name}
              </tspan>
              <tspan x={x} dy="1.15em" className="korea-map__label-count">
                {festivalCounts[id]?.monthly ?? 0}
              </tspan>
            </text>
          ))}

          {Object.entries(CITY_CALLOUTS).map(([id, [x, y, anchor]]) => {
            const [ax, ay] = REGION_LABEL_POINTS[id]
            return (
              <g key={id} className="korea-map__callout">
                <line x1={ax} y1={ay} x2={x} y2={y} />
                <circle cx={ax} cy={ay} r="2.4" />
                <text x={x} y={y} dy="0.35em" textAnchor={anchor} className="korea-map__label">
                  <tspan className="korea-map__label-name">{regionById[id].name}</tspan>
                  <tspan className="korea-map__label-count"> {festivalCounts[id]?.monthly ?? 0}</tspan>
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {tooltipRegion && renderTooltip && (
        <div className="korea-map__tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y, width: TOOLTIP_WIDTH }}>
          {renderTooltip(tooltipRegion)}
        </div>
      )}
    </div>
  )
}
