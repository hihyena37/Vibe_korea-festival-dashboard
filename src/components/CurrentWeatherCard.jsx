import useWeather from '../hooks/useWeather'
import { getWeatherInfo } from '../utils/weatherCode'
import WeatherIcon from './WeatherIcon'
import '../styles/states.css'
import '../styles/current-weather.css'

// '2026-10-02T14:15' → '14:15'
const formatTime = (isoTime) => isoTime.split('T')[1] ?? ''

// 축제 상세용 compact 날씨 카드
// 행사 날짜와 무관한 '지금 이 시각'의 날씨임을 화면에 명시한다.
export default function CurrentWeatherCard({ locationLabel, latitude, longitude }) {
  const { weather, loading, error, reload } = useWeather(latitude, longitude)

  return (
    <section className="current-weather" aria-labelledby="current-weather-title">
      <div className="current-weather__head">
        <h2 id="current-weather-title" className="current-weather__title">
          현재 지역 날씨
        </h2>
        <p className="current-weather__location">{locationLabel}</p>
      </div>

      {loading && (
        <div className="current-weather__body" role="status">
          <span className="visually-hidden">날씨 정보를 불러오고 있습니다.</span>
          <div className="skeleton current-weather__skeleton-icon" />
          <div className="current-weather__skeleton-text">
            <div className="skeleton skeleton-line skeleton-line--title" />
            <div className="skeleton skeleton-line skeleton-line--short" />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="current-weather__error" role="alert">
          <p>날씨 정보를 불러올 수 없습니다.</p>
          <button type="button" className="current-weather__retry" onClick={reload}>
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && weather && (
        <div className="current-weather__body">
          <WeatherIcon code={weather.current.weatherCode} className="current-weather__icon" />
          <div>
            <p className="current-weather__temp">
              {weather.current.temperature === null ? '-' : Math.round(weather.current.temperature)}
              <span>°C</span>
            </p>
            <p className="current-weather__state">{getWeatherInfo(weather.current.weatherCode).label}</p>
          </div>
          <dl className="current-weather__details">
            {weather.current.apparentTemperature !== null && (
              <div>
                <dt>체감</dt>
                <dd>{Math.round(weather.current.apparentTemperature)}°</dd>
              </div>
            )}
            {weather.daily[0] && weather.daily[0].precipitationProbability !== null && (
              <div>
                <dt>오늘 강수확률</dt>
                <dd>{weather.daily[0].precipitationProbability}%</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <p className="current-weather__note">
        {weather?.current.time ? `오늘 ${formatTime(weather.current.time)} 기준 날씨입니다. ` : ''}
        행사 당일의 날씨 예보가 아니므로 방문 전 다시 확인하세요.
      </p>
    </section>
  )
}
