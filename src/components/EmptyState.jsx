import '../styles/states.css'

export default function EmptyState({ title, description }) {
  return (
    <div className="state-box">
      <p className="state-box__title">{title}</p>
      {description && <p className="state-box__desc">{description}</p>}
    </div>
  )
}
