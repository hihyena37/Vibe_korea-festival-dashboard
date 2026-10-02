import '../styles/stats.css'

// icon: 선택. 라벨 앞에 표시할 아이콘 요소
export default function StatsCard({ label, value, description, tone = 'default', icon }) {
  return (
    <div className={`stats-card stats-card--${tone}`}>
      <p className="stats-card__label">
        {icon && <span className="stats-card__icon">{icon}</span>}
        {label}
      </p>
      <p className="stats-card__value">
        {value}
        <span className="stats-card__unit">개</span>
      </p>
      {description && <p className="stats-card__desc">{description}</p>}
    </div>
  )
}
