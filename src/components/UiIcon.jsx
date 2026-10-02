import '../styles/weather-icon.css'

// 통계 · 헤더 · 날씨 상세 항목에 쓰는 단색 라인 아이콘 (currentColor)
const PATHS = {
  activity: <path d="M3 12h4l3-7 4 14 3-7h4" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  drop: <path d="M12 3.5s-5.5 6.2-5.5 10.2a5.5 5.5 0 0 0 11 0C17.5 9.7 12 3.5 12 3.5z" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  phone: (
    <path d="M5 4h3.5l1.5 4.5-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4.5 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5s1.1-6.1 3.5-8.5z" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5h16M6 20.5V5.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M15 9.5h3a1 1 0 0 1 1 1v10" />
      <path d="M9 8h3M9 11.5h3M9 15h3" />
    </>
  ),
  ticket: (
    <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4zM14 6v12" />
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0M15.5 5.5a3 3 0 0 1 0 6M17.5 14.5a5 5 0 0 1 3 5" />
    </>
  ),
  external: <path d="M14 4.5h5.5V10M19.5 4.5l-8 8M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10" />,
  map: <path d="M9 4.5l-5 2v13l5-2 6 2 5-2v-13l-5 2-6-2zM9 4.5v13M15 6.5v13" />,
}

export default function UiIcon({ name, className = '' }) {
  return (
    <svg
      className={`ui-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
