import { useCallback, useEffect, useState } from 'react'
import { getRegionWeather } from '../api/weatherApi'

// 좌표별 날씨 조회. 축제 데이터와 독립적으로 로딩/오류 상태를 가진다.
export default function useWeather(latitude, longitude) {
  const [requestId, setRequestId] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const key = `${latitude},${longitude}#${requestId}`

  useEffect(() => {
    let ignore = false

    getRegionWeather(latitude, longitude)
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null })
      })
      .catch((err) => {
        if (ignore) return
        console.warn(err)
        setResult({ key, data: null, error: err })
      })

    return () => {
      ignore = true
    }
  }, [key, latitude, longitude])

  const reload = useCallback(() => setRequestId((id) => id + 1), [])

  // 현재 요청(key)의 응답이 아직 도착하지 않았으면 로딩 중
  const isCurrent = result.key === key
  return {
    weather: isCurrent ? result.data : null,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    reload,
  }
}
