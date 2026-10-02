import { useState } from 'react'
import useFavorites from '../hooks/useFavorites'
import '../styles/favorite.css'

function HeartIcon({ filled }) {
  return (
    <svg className="favorite-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 20.3s-7.8-4.6-7.8-10.4A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.8 2.7c0 5.8-7.8 10.4-7.8 10.4z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 관심 축제 버튼. 모든 화면이 같은 favorites store를 구독하므로 상태가 일관된다.
// variant: 'icon'(카드 위 원형 버튼) | 'labeled'(상세 페이지 텍스트 버튼)
export default function FavoriteButton({ festival, variant = 'icon' }) {
  const { favorites, toggleFavorite } = useFavorites()
  const [popping, setPopping] = useState(false)
  const saved = favorites.some((item) => item.id === String(festival.id))

  const handleClick = (event) => {
    // 카드의 상세 링크와 겹치지 않도록 이벤트 전파를 막는다.
    event.preventDefault()
    event.stopPropagation()
    const nowSaved = toggleFavorite(festival)
    setPopping(nowSaved)
  }

  return (
    <button
      type="button"
      className={`favorite-button favorite-button--${variant}${saved ? ' is-saved' : ''}${popping ? ' is-popping' : ''}`}
      aria-pressed={saved}
      aria-label={`${festival.title} 관심 축제${saved ? '에서 제거' : '에 추가'}`}
      onClick={handleClick}
      onAnimationEnd={() => setPopping(false)}
    >
      <HeartIcon filled={saved} />
      {variant === 'labeled' && <span>{saved ? '관심 축제 저장됨' : '관심 축제'}</span>}
    </button>
  )
}
