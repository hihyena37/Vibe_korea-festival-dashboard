import '../styles/states.css'

export default function ErrorState({ title, description, detail, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <p className="state-box__title">{title}</p>
      {description && <p className="state-box__desc">{description}</p>}
      {detail && <p className="state-box__detail">{detail}</p>}
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  )
}
