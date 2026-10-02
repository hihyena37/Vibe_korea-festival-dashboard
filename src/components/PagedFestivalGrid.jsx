import { useState } from 'react'
import FestivalGrid from './FestivalGrid'
import '../styles/festivals.css'

const DEFAULT_PAGE_SIZE = 24

// 카드를 pageSize개씩 보여주고 '더 보기'로 늘린다.
// 목록 조건이 바뀌면 부모에서 key를 바꿔 개수를 초기화한다.
export default function PagedFestivalGrid({ festivals, today, variant, pageSize = DEFAULT_PAGE_SIZE }) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const visible = festivals.slice(0, visibleCount)

  return (
    <>
      <FestivalGrid festivals={visible} today={today} variant={variant} />
      {festivals.length > visibleCount && (
        <div className="festivals-more">
          <button
            type="button"
            className="festivals-more__button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            더 보기 ({visible.length} / {festivals.length})
          </button>
        </div>
      )}
    </>
  )
}
