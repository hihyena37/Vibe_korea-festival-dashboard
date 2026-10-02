import { getWeatherInfo } from '../utils/weatherCode'
import '../styles/weather-icon.css'

// 24x24 기준 구름 외곽선 (x 2.6~21.3, y 4~18)
const CLOUD_PATH = 'M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.1 9.2 4.4 4.4 0 0 0 7 18z'

const Cloud = ({ transform }) => <path className="wi-cloud" d={CLOUD_PATH} transform={transform} />
// 강수 아이콘용: 구름을 위로 올리고 약간 축소
const RAISED = 'translate(1.2 -1.5) scale(0.9)'

const SUN_RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

function Sun({ cx = 12, cy = 12, r = 4.2, ray = 7.2 }) {
  return (
    <g className="wi-sun">
      <circle cx={cx} cy={cy} r={r} />
      {SUN_RAYS.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const inner = r + 1.8
        return (
          <line
            key={deg}
            x1={cx + Math.cos(rad) * inner}
            y1={cy + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * (inner + ray - r - 1.6)}
            y2={cy + Math.sin(rad) * (inner + ray - r - 1.6)}
          />
        )
      })}
    </g>
  )
}

const ICONS = {
  sun: () => <Sun />,
  partly: () => (
    <>
      <Sun cx={8.5} cy={8.5} r={3} ray={5.2} />
      <Cloud transform="translate(4 4) scale(0.8)" />
    </>
  ),
  cloud: () => <Cloud />,
  fog: () => (
    <g className="wi-fog">
      <path d="M4 7.5h13M7 11.5h13M4 15.5h14M8 19.5h9" />
    </g>
  ),
  rain: () => (
    <>
      <Cloud transform={RAISED} />
      <g className="wi-drop">
        <path d="M8.5 17.2l-1 3.3M12.5 17.2l-1 3.3M16.5 17.2l-1 3.3" />
      </g>
    </>
  ),
  snow: () => (
    <>
      <Cloud transform={RAISED} />
      <g className="wi-snow">
        <circle cx="8" cy="18.5" r="1.15" />
        <circle cx="12" cy="20.6" r="1.15" />
        <circle cx="16" cy="18.5" r="1.15" />
      </g>
    </>
  ),
  thunder: () => (
    <>
      <Cloud transform={RAISED} />
      <path className="wi-bolt" d="M12.8 13.2 9.6 18.2h2.6l-1.1 4 4.1-5.6h-2.6l1.3-3.4z" />
    </>
  ),
}

// weather_code → 아이콘 종류
function getWeatherIconKind(code) {
  if (code === 0) return 'sun'
  if (code === 1 || code === 2) return 'partly'
  const { type } = getWeatherInfo(code)
  if (type === 'fog' || type === 'rain' || type === 'snow' || type === 'thunder') return type
  return 'cloud'
}

// 상태 텍스트가 항상 함께 표시되므로 아이콘은 장식용(aria-hidden)
export default function WeatherIcon({ code, className = '' }) {
  const Icon = ICONS[getWeatherIconKind(code)]
  return (
    <svg className={`weather-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <Icon />
    </svg>
  )
}
