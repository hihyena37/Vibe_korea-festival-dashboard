import { useCallback, useEffect, useState } from 'react'
import { fetchFestivals } from '../api/tourApi'

export default function useFestivals() {
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    let ignore = false

    fetchFestivals()
      .then((data) => {
        if (ignore) return
        setFestivals(data)
        setError(null)
      })
      .catch((err) => {
        if (ignore) return
        console.warn(err)
        setError(err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [requestId])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setRequestId((id) => id + 1)
  }, [])

  return { festivals, loading, error, reload }
}
