import '../styles/filter.css'

// onComposingChange: 한글 등 IME 조합 중 여부(true/false)를 상위에 알린다. (선택)
export default function SearchBar({ value, onChange, onComposingChange, placeholder = '축제명, 지역, 주소로 검색' }) {
  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onCompositionStart={() => onComposingChange?.(true)}
        onCompositionEnd={() => onComposingChange?.(false)}
        placeholder={placeholder}
        aria-label="축제 검색"
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={() => onChange('')} aria-label="검색어 지우기">
          ×
        </button>
      )}
    </div>
  )
}
