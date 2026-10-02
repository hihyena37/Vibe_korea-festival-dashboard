import { getWeatherInfo } from '../utils/weatherCode'
import WeatherIcon from './WeatherIcon'

// 지도 tooltip / 지역 정보 패널용 한 줄 날씨 요약
// status: useLazyRegionWeather 의 'idle' | 'loading' | 'success' | 'error'
export default function RegionWeatherSummary({ status, weather, size = 'small' }) {
  if (status === 'loading') {
    return <p className="region-weather region-weather--muted">날씨 불러오는 중…</p>
  }
  if (status === 'error' || !weather) {
    return <p className="region-weather region-weather--muted">날씨 정보를 불러올 수 없습니다.</p>
  }

  const { current, daily } = weather
  const probability = daily[0]?.precipitationProbability ?? null

  return (
    <div className={`region-weather region-weather--${size}`}>
      <WeatherIcon code={current.weatherCode} className="region-weather__icon" />
      <p className="region-weather__text">
        <strong>{current.temperature === null ? '-' : `${Math.round(current.temperature)}°C`}</strong>
        <span>{getWeatherInfo(current.weatherCode).label}</span>
        {size === 'large' && probability !== null && <span>강수확률 {probability}%</span>}
      </p>
    </div>
  )
}
