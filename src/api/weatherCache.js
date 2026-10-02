import { getRegionWeather } from './weatherApi'

// 지역 날씨 메모리 캐시 (페이지를 새로고침하면 초기화)
// 같은 지역을 반복 hover / 선택해도 TTL 동안은 다시 요청하지 않는다.
const TTL = 10 * 60 * 1000

const resolved = new Map() // regionId → { data, savedAt }
const pending = new Map() // regionId → Promise (동시에 같은 지역을 요청해도 한 번만 호출)

export function peekRegionWeather(regionId) {
  const entry = resolved.get(regionId)
  if (!entry || Date.now() - entry.savedAt > TTL) return null
  return entry.data
}

export function loadRegionWeather(region) {
  const cached = peekRegionWeather(region.id)
  if (cached) return Promise.resolve(cached)
  if (pending.has(region.id)) return pending.get(region.id)

  const request = getRegionWeather(region.latitude, region.longitude)
    .then((data) => {
      resolved.set(region.id, { data, savedAt: Date.now() })
      return data
    })
    .finally(() => pending.delete(region.id))

  pending.set(region.id, request)
  return request
}
