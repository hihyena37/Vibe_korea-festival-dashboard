import { useCallback, useEffect, useState } from 'react'
import { FestivalNotFoundError, getFestivalDetail } from '../api/tourApi'

// 축제 상세조회. 목록 데이터와 별개로 로딩/오류 상태를 가진다.
export default function useFestivalDetail(contentId) {
  const [requestId, setRequestId] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const key = `${contentId}#${requestId}`

  useEffect(() => {
    let ignore = false

    getFestivalDetail(contentId)
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null })
      })
      .catch((err) => {
        if (ignore) return
        // '존재하지 않는 축제'는 화면에서 안내하는 정상 흐름이므로 콘솔에 남기지 않는다.
        if (!(err instanceof FestivalNotFoundError)) console.warn(err)
        setResult({ key, data: null, error: err })
      })

    return () => {
      ignore = true
    }
  }, [key, contentId])

  const reload = useCallback(() => setRequestId((id) => id + 1), [])

  // 현재 요청(key)의 응답이 아직 도착하지 않았으면 로딩 중
  const isCurrent = result.key === key
  return {
    festival: isCurrent ? result.data : null,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    reload,
  }
}
