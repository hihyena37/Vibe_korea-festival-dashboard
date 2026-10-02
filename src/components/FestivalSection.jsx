import { Link } from 'react-router-dom'
import EmptyState from './EmptyState'
import FestivalGrid from './FestivalGrid'

export default function FestivalSection({ title, count, festivals, today, moreLink, emptyMessage }) {
  return (
    <section className="festival-section">
      <div className="section-head">
        <h2 className="section-title">
          {title}
          <span className="section-title__count">{count}</span>
        </h2>
        {moreLink && count > festivals.length && (
          <Link to={moreLink} className="section-head__more">
            전체보기 →
          </Link>
        )}
      </div>
      {festivals.length > 0 ? (
        <FestivalGrid festivals={festivals} today={today} />
      ) : (
        <EmptyState title={emptyMessage} />
      )}
    </section>
  )
}
