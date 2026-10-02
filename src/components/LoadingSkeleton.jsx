import '../styles/states.css'

export default function LoadingSkeleton({ count = 4, message = '축제 정보를 불러오고 있습니다.' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <p className="loading__message">{message}</p>
      <div className="festival-grid">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="skeleton-card" aria-hidden="true">
            <div className="skeleton skeleton-card__media" />
            <div className="skeleton-card__body">
              <div className="skeleton skeleton-line skeleton-line--title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line--short" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
