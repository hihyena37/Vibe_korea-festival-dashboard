import { getWeatherAdvice, getWeatherInfo } from '../utils/weatherCode'
import UiIcon from './UiIcon'
import WeatherIcon from './WeatherIcon'
import '../styles/states.css'
import '../styles/weather.css'

const DAY_LABELS = ['오늘', '내일', '모레']

const formatTemp = (value) => (value === null ? '-' : `${Math.round(value)}°`)
const formatPercent = (value) => (value === null ? '정보 없음' : `${value}%`)

// '2026-10-02T14:15' → '14:15'
const formatTime = (isoTime) => isoTime.split('T')[1] ?? ''

function WeatherSkeleton() {
  return (
    <div className="weather-card__skeleton" role="status" aria-live="polite">
      <span className="visually-hidden">날씨 정보를 불러오고 있습니다.</span>
      <div className="weather-card__skeleton-now">
        <div className="skeleton weather-card__skeleton-icon" />
        <div className="weather-card__skeleton-text">
          <div className="skeleton weather-card__skeleton-temp" />
          <div className="skeleton skeleton-line skeleton-line--short" />
        </div>
      </div>
      <div className="weather-forecast">
        {DAY_LABELS.map((label) => (
          <div key={label} className="skeleton weather-card__skeleton-day" />
        ))}
      </div>
    </div>
  )
}

export default function WeatherCard({ regionName, weather, loading, error, onRetry }) {
  // 현재 날씨에 따른 은은한 배경 테마 (clear | cloudy | fog | rain | snow | thunder)
  const showWeather = !loading && !error && weather
  const theme = showWeather ? getWeatherInfo(weather.current.weatherCode).type : 'default'

  return (
    <section className={`weather-card weather-card--${theme}`} aria-labelledby="weather-card-title">
      {showWeather && <WeatherIcon code={weather.current.weatherCode} className="weather-card__bg" />}

      <div className="weather-card__head">
        <h2 id="weather-card-title" className="weather-card__title">
          {regionName} <span>오늘의 날씨</span>
        </h2>
        {weather?.current.time && (
          <p className="weather-card__time">{formatTime(weather.current.time)} 기준</p>
        )}
      </div>

      {loading && <WeatherSkeleton />}

      {!loading && error && (
        <div className="weather-card__error" role="alert">
          <p>날씨 정보를 불러올 수 없습니다.</p>
          <button type="button" className="weather-card__retry" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      )}

      {showWeather && <WeatherContent weather={weather} />}
    </section>
  )
}

function WeatherContent({ weather }) {
  const { current, daily } = weather
  const today = daily[0]
  const advice = today ? getWeatherAdvice(today) : null

  return (
    <>
      <div className="weather-now">
        <div className="weather-now__main">
          <WeatherIcon code={current.weatherCode} className="weather-now__icon" />
          <div>
            <p className="weather-now__temp">
              {current.temperature === null ? '-' : Math.round(current.temperature)}
              <span>°C</span>
            </p>
            <p className="weather-now__label">{getWeatherInfo(current.weatherCode).label}</p>
            <p className="weather-now__feels">체감 {formatTemp(current.apparentTemperature)}</p>
          </div>
        </div>

        {today && (
          <dl className="weather-now__details">
            <div>
              <dt>
                <UiIcon name="arrowUp" className="weather-now__detail-icon weather-now__detail-icon--max" />
                최고
              </dt>
              <dd>{formatTemp(today.max)}</dd>
            </div>
            <div>
              <dt>
                <UiIcon name="arrowDown" className="weather-now__detail-icon weather-now__detail-icon--min" />
                최저
              </dt>
              <dd>{formatTemp(today.min)}</dd>
            </div>
            <div>
              <dt>
                <UiIcon name="drop" className="weather-now__detail-icon weather-now__detail-icon--rain" />
                강수확률
              </dt>
              <dd>{formatPercent(today.precipitationProbability)}</dd>
            </div>
          </dl>
        )}
      </div>

      {advice && (
        <div className={`weather-advice weather-advice--${advice.tone}`}>
          <WeatherIcon code={today.weatherCode} className="weather-advice__icon" />
          <p>{advice.message}</p>
        </div>
      )}

      {daily.length > 0 && (
        <ul className="weather-forecast" aria-label="3일 예보">
          {daily.slice(0, DAY_LABELS.length).map((day, i) => (
            <li key={day.date} className={`weather-forecast__day${i === 0 ? ' is-today' : ''}`}>
              <p className="weather-forecast__label">{DAY_LABELS[i]}</p>
              <WeatherIcon code={day.weatherCode} className="weather-forecast__icon" />
              <p className="weather-forecast__state">{getWeatherInfo(day.weatherCode).label}</p>
              <p className="weather-forecast__temp">
                {formatTemp(day.max)}
                <span> / {formatTemp(day.min)}</span>
              </p>
              {day.precipitationProbability !== null && (
                <p className="weather-forecast__rain">
                  <UiIcon name="drop" />
                  {day.precipitationProbability}%
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
