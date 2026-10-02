// Open-Meteo weather_code (WMO Weather interpretation codes) → 한국어 상태
// 출처: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
// type: 날씨 안내 문구 판단에 쓰는 분류
const WEATHER_CODES = {
  0: { label: '맑음', type: 'clear' },
  1: { label: '대체로 맑음', type: 'clear' },
  2: { label: '구름 조금', type: 'cloudy' },
  3: { label: '흐림', type: 'cloudy' },
  45: { label: '안개', type: 'fog' },
  48: { label: '안개', type: 'fog' },
  51: { label: '약한 이슬비', type: 'rain' },
  53: { label: '이슬비', type: 'rain' },
  55: { label: '강한 이슬비', type: 'rain' },
  56: { label: '어는 이슬비', type: 'rain' },
  57: { label: '어는 이슬비', type: 'rain' },
  61: { label: '약한 비', type: 'rain' },
  63: { label: '비', type: 'rain' },
  65: { label: '강한 비', type: 'rain' },
  66: { label: '어는 비', type: 'rain' },
  67: { label: '어는 비', type: 'rain' },
  71: { label: '약한 눈', type: 'snow' },
  73: { label: '눈', type: 'snow' },
  75: { label: '강한 눈', type: 'snow' },
  77: { label: '싸락눈', type: 'snow' },
  80: { label: '약한 소나기', type: 'rain' },
  81: { label: '소나기', type: 'rain' },
  82: { label: '강한 소나기', type: 'rain' },
  85: { label: '약한 눈보라', type: 'snow' },
  86: { label: '강한 눈보라', type: 'snow' },
  95: { label: '천둥번개', type: 'thunder' },
  96: { label: '천둥번개 · 우박', type: 'thunder' },
  99: { label: '천둥번개 · 우박', type: 'thunder' },
}

const UNKNOWN = { label: '정보 없음', type: 'unknown' }

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] ?? UNKNOWN
}

const RAIN_ALERT_PROBABILITY = 60
const LOW_RAIN_PROBABILITY = 30

// 날씨 안내 문구 (단순 조건식, 안전을 보장하는 표현은 쓰지 않는다)
// today: 오늘 일별 예보 { weatherCode, precipitationProbability }
export function getWeatherAdvice(today) {
  const probability = today?.precipitationProbability
  const hasProbability = Number.isFinite(probability)
  // 맑음 · 대체로 맑음 · 구름 조금까지를 '맑거나 구름이 적은 날'로 본다.
  const isFair = getWeatherInfo(today?.weatherCode).type === 'clear' || today?.weatherCode === 2

  if (hasProbability && probability >= RAIN_ALERT_PROBABILITY) {
    return { tone: 'caution', message: '비 예보가 있습니다. 야외 행사 방문 전 운영 여부를 확인하세요.' }
  }
  if (hasProbability && probability < LOW_RAIN_PROBABILITY && isFair) {
    return { tone: 'good', message: '야외 축제를 즐기기 무난한 날씨입니다.' }
  }
  return { tone: 'default', message: '외출 전 최신 날씨를 확인해보세요.' }
}
