// 대한민국 17개 시도 SVG path 생성 스크립트 (개발용 1회 실행, 앱 런타임에는 사용하지 않음)
//
// 원본 데이터: 통계청(KOSTAT) 센서스용 행정구역경계 2018 (시도)
// 변환본: https://github.com/southkorea/southkorea-maps (kostat/2018/json/skorea-provinces-2018-topo.json)
//
// 실행: node scripts/generate-korea-map.mjs
// 결과: src/data/koreaMapPaths.js
//
// 처리 과정
// 1. TopoJSON arc(인접 지역이 공유하는 경계선)를 디코딩
// 2. 경위도 → 평면 좌표 (위도 36° 기준 등장방형 투영, 한반도 범위에서 왜곡이 작음)
// 3. arc 단위 Douglas-Peucker 단순화 → 이웃 지역 경계가 어긋나지 않음
// 4. 아주 작은 섬은 제거, 울릉도·독도는 지도 크기를 위해 inset 위치로 이동
// 5. 지역명 표시 위치(내부 최대 여백 지점) 계산

import { writeFile } from 'node:fs/promises'

const SOURCE_URL =
  'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-topo.json'
const OUTPUT = new URL('../src/data/koreaMapPaths.js', import.meta.url)

// KOSTAT 2018 시도 코드 → regions.js id
const CODE_TO_ID = {
  11: 'seoul', 21: 'busan', 22: 'daegu', 23: 'incheon', 24: 'gwangju', 25: 'daejeon', 26: 'ulsan',
  29: 'sejong', 31: 'gyeonggi', 32: 'gangwon', 33: 'chungbuk', 34: 'chungnam', 35: 'jeonbuk',
  36: 'jeonnam', 37: 'gyeongbuk', 38: 'gyeongnam', 39: 'jeju',
}

const MAP_WIDTH = 560 // 본토 + 서해 섬 기준 폭(px)
const PADDING = 12
const SIMPLIFY_TOLERANCE = 0.45 // px
const MIN_ISLAND_AREA = 2.5 // px², 이보다 작은 섬은 제거 (inset 섬은 예외)
const INSET_LON = 130.5 // 이 경도보다 동쪽 = 울릉도·독도
const INSET_SHIFT_LON = 1.55 // inset으로 옮길 때 서쪽 이동량(경도)

const LAT0 = (36 * Math.PI) / 180
const project = ([lon, lat]) => [lon * Math.cos(LAT0), -lat]

function decodeArcs(topology) {
  const [sx, sy] = topology.transform.scale
  const [tx, ty] = topology.transform.translate
  return topology.arcs.map((arc) => {
    let x = 0
    let y = 0
    return arc.map(([dx, dy]) => {
      x += dx
      y += dy
      return [x * sx + tx, y * sy + ty]
    })
  })
}

function perpendicularDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy)
  if (len === 0) return Math.hypot(px - ax, py - ay)
  return Math.abs(dy * px - dx * py + bx * ay - by * ax) / len
}

function simplify(points, tolerance) {
  if (points.length <= 2) return points
  let maxDist = 0
  let index = 0
  const last = points.length - 1
  for (let i = 1; i < last; i++) {
    const d = perpendicularDistance(points[i], points[0], points[last])
    if (d > maxDist) {
      maxDist = d
      index = i
    }
  }
  if (maxDist <= tolerance) {
    // 시작점과 끝점이 같은 닫힌 arc는 최소 형태를 유지
    return points[0][0] === points[last][0] && points[0][1] === points[last][1]
      ? [points[0], points[Math.floor(last / 3)], points[Math.floor((2 * last) / 3)], points[last]]
      : [points[0], points[last]]
  }
  return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)]
}

function ringArea(ring) {
  let sum = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1])
  }
  return Math.abs(sum / 2)
}

function pointInRing([x, y], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function distanceToRing(point, ring) {
  let min = Infinity
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    min = Math.min(min, perpendicularSegmentDistance(point, ring[j], ring[i]))
  }
  return min
}

function perpendicularSegmentDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax
  const dy = by - ay
  const lenSq = dx * dx + dy * dy
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

// 가장 큰 폴리곤 내부에서 경계로부터 가장 먼 지점 (격자 탐색 후 국소 보정)
function labelPoint(ring) {
  const xs = ring.map((p) => p[0])
  const ys = ring.map((p) => p[1])
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  let best = null
  let bestDist = -1
  const steps = 40
  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const p = [minX + ((maxX - minX) * i) / steps, minY + ((maxY - minY) * j) / steps]
      if (!pointInRing(p, ring)) continue
      const d = distanceToRing(p, ring)
      if (d > bestDist) {
        bestDist = d
        best = p
      }
    }
  }
  return best
}

const round = (n) => Math.round(n * 10) / 10

function ringToPath(ring) {
  return `M${ring.map(([x, y]) => `${round(x)} ${round(y)}`).join('L')}Z`
}

async function main() {
  const topology = await (await fetch(SOURCE_URL)).json()
  const objectName = Object.keys(topology.objects)[0]
  const geometries = topology.objects[objectName].geometries

  // 1~2. arc 디코딩 + inset 이동 + 투영
  const rawArcs = decodeArcs(topology).map((arc) => {
    const isInset = arc.every(([lon]) => lon > INSET_LON)
    const moved = isInset ? arc.map(([lon, lat]) => [lon - INSET_SHIFT_LON, lat]) : arc
    return { points: moved.map(project), isInset }
  })

  // 본토 + 서해 섬 범위로 스케일 결정
  const all = rawArcs.flatMap((a) => a.points)
  const minX = Math.min(...all.map((p) => p[0]))
  const maxX = Math.max(...all.map((p) => p[0]))
  const minY = Math.min(...all.map((p) => p[1]))
  const maxY = Math.max(...all.map((p) => p[1]))
  const scale = (MAP_WIDTH - PADDING * 2) / (maxX - minX)
  const toPx = ([x, y]) => [(x - minX) * scale + PADDING, (y - minY) * scale + PADDING]
  const height = Math.ceil((maxY - minY) * scale + PADDING * 2)

  // 3. arc 단위 단순화 (공유 경계는 한 번만 단순화되므로 양쪽 지역이 동일한 선을 사용)
  const arcs = rawArcs.map((a) => ({ points: simplify(a.points.map(toPx), SIMPLIFY_TOLERANCE), isInset: a.isInset }))

  const arcPoints = (index) => (index >= 0 ? arcs[index].points : [...arcs[~index].points].reverse())
  const arcIsInset = (index) => arcs[index >= 0 ? index : ~index].isInset

  const buildRing = (arcIndexes) => {
    const ring = []
    arcIndexes.forEach((index, i) => {
      const points = arcPoints(index)
      ring.push(...(i === 0 ? points : points.slice(1)))
    })
    return ring
  }

  const paths = {}
  const labels = {}
  let insetBox = null
  let dokdoPoint = null // inset 안에서 가장 동쪽 섬 = 독도 (너무 작아 마커로 함께 표시)

  for (const geometry of geometries) {
    const id = CODE_TO_ID[geometry.properties.code]
    if (!id) throw new Error(`알 수 없는 시도 코드: ${geometry.properties.code}`)
    const polygons = geometry.type === 'Polygon' ? [geometry.arcs] : geometry.arcs

    const parts = []
    let largest = null
    for (const polygon of polygons) {
      const isInset = polygon[0].every(arcIsInset)
      const rings = polygon.map(buildRing)
      const area = ringArea(rings[0])
      // 4. 너무 작은 섬 제거 (울릉도·독도 inset은 유지)
      if (!isInset && area < MIN_ISLAND_AREA) continue
      if (isInset) {
        const cx = rings[0].reduce((sum, pt) => sum + pt[0], 0) / rings[0].length
        const cy = rings[0].reduce((sum, pt) => sum + pt[1], 0) / rings[0].length
        if (!dokdoPoint || cx > dokdoPoint[0]) dokdoPoint = [round(cx), round(cy)]
        for (const [x, y] of rings[0]) {
          insetBox = insetBox ?? { minX: x, maxX: x, minY: y, maxY: y }
          insetBox.minX = Math.min(insetBox.minX, x)
          insetBox.maxX = Math.max(insetBox.maxX, x)
          insetBox.minY = Math.min(insetBox.minY, y)
          insetBox.maxY = Math.max(insetBox.maxY, y)
        }
      }
      parts.push(rings.map(ringToPath).join(''))
      if (!largest || area > largest.area) largest = { area, ring: rings[0] }
    }

    paths[id] = parts.join('')
    // 5. 지역명 위치
    labels[id] = labelPoint(largest.ring).map(round)
  }

  const inset = insetBox && {
    x: round(insetBox.minX - 10),
    y: round(insetBox.minY - 22),
    width: round(insetBox.maxX - insetBox.minX + 20),
    height: round(insetBox.maxY - insetBox.minY + 32),
  }

  const ids = Object.values(CODE_TO_ID)
  const source = `// 자동 생성 파일입니다. 직접 수정하지 말고 scripts/generate-korea-map.mjs 를 실행하세요.
// 원본: 통계청(KOSTAT) 센서스용 행정구역경계 2018 (시도)
// 변환본: https://github.com/southkorea/southkorea-maps
// 울릉도·독도는 지도 크기를 위해 inset 위치로 이동해 표시합니다.

export const MAP_WIDTH = ${MAP_WIDTH}
export const MAP_HEIGHT = ${height}

export const ULLEUNG_INSET = ${JSON.stringify(inset)}
export const DOKDO_POINT = [${dokdoPoint.join(', ')}]

// 지역명 기본 표시 위치 (폴리곤 내부에서 경계와 가장 먼 지점)
export const REGION_LABEL_POINTS = {
${ids.map((id) => `  ${id}: [${labels[id].join(', ')}],`).join('\n')}
}

export const REGION_PATHS = {
${ids.map((id) => `  ${id}:\n    '${paths[id]}',`).join('\n')}
}
`
  await writeFile(OUTPUT, source)
  const size = Buffer.byteLength(source)
  console.log(`생성 완료: ${OUTPUT.pathname} (${(size / 1024).toFixed(1)} KB, ${MAP_WIDTH}x${height})`)
}

main()
