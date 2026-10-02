import { useEffect, useState } from 'react'
import { loadRegionWeather, peekRegionWeather } from '../api/weatherCache'

// 지도에서 지역 위에 잠시 머물렀을 때만 요청 (빠르게 훑고 지나가는 지역은 호출하지 않음)
const FETCH_DELAY = 250

// 지도에서 활성화된 지역 하나의 날씨만 필요할 때 가져온다.
// status: 'idle' | 'loading' | 'success' | 'error'
export default function useLazyRegionWeather(region) {
  const [result, setResult] = useState({ regionId: null, data: null, error: null })
  const cached = region ? peekRegionWeather(region.id) : null

  useEffect(() => {
    if (!region || peekRegionWeather(region.id)) return undefined

    let ignore = false
    const timer = setTimeout(() => {
      loadRegionWeather(region)
        .then((data) => {
          if (!ignore) setResult({ regionId: region.id, data, error: null })
        })
        .catch((error) => {
          if (ignore) return
          console.warn(error)
          setResult({ regionId: region.id, data: null, error })
        })
    }, FETCH_DELAY)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [region])

  if (!region) return { status: 'idle', weather: null }
  if (cached) return { status: 'success', weather: cached }
  if (result.regionId === region.id) {
    return result.error ? { status: 'error', weather: null } : { status: 'success', weather: result.data }
  }
  return { status: 'loading', weather: null }
}
