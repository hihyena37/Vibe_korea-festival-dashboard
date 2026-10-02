// Open-Meteo Forecast API (인증키 불필요)
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const FORECAST_DAYS = 3

const CURRENT_FIELDS = ['temperature_2m', 'apparent_temperature', 'weather_code']
const DAILY_FIELDS = ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max']

// 응답에 값이 없으면 null로 두고 임의 값으로 채우지 않는다.
const toNumber = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null)

function normalizeWeather(data) {
  const current = data?.current ?? {}
  const daily = data?.daily ?? {}
  const dates = Array.isArray(daily.time) ? daily.time : []

  return {
    current: {
      time: current.time ?? '',
      temperature: toNumber(current.temperature_2m),
      apparentTemperature: toNumber(current.apparent_temperature),
      weatherCode: toNumber(current.weather_code),
    },
    daily: dates.map((date, i) => ({
      date,
      weatherCode: toNumber(daily.weather_code?.[i]),
      max: toNumber(daily.temperature_2m_max?.[i]),
      min: toNumber(daily.temperature_2m_min?.[i]),
      precipitationProbability: toNumber(daily.precipitation_probability_max?.[i]),
    })),
  }
}

// 위·경도 기준 현재 날씨 + 오늘 포함 3일 예보
export async function getRegionWeather(latitude, longitude) {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(','),
    daily: DAILY_FIELDS.join(','),
    timezone: 'Asia/Seoul',
    forecast_days: String(FORECAST_DAYS),
  })

  const response = await fetch(`${BASE_URL}?${query}`)
  if (!response.ok) {
    throw new Error(`날씨 API 요청 실패 (HTTP ${response.status})`)
  }

  const data = await response.json()
  if (data?.error) {
    throw new Error(`날씨 API 오류: ${data.reason ?? '알 수 없는 오류'}`)
  }
  return normalizeWeather(data)
}
