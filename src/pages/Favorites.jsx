import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import FestivalGrid from '../components/FestivalGrid'
import useFavorites from '../hooks/useFavorites'
import { DEFAULT_FILTERS, filterFestivals } from '../utils/festivalFilter'
import '../styles/festivals.css'
import '../styles/favorites-page.css'

export default function Favorites({ festivals, today }) {
  const { favorites } = useFavorites()

  // 이미 받아온 목록 데이터에 같은 축제가 있으면 최신 정보(제목·기간·이미지)를 사용하고,
  // 없으면(오래전 종료 등) 저장 당시 정보를 사용한다. MY PICKS를 위한 추가 API 호출은 없다.
  const items = useMemo(() => {
    const byId = new Map(festivals.map((festival) => [festival.id, festival]))
    const merged = favorites.map((saved) => byId.get(saved.id) ?? saved)
    // 진행 중 → 예정 → 종료 순 (FESTIVALS 페이지와 같은 정렬)
    return filterFestivals(merged, DEFAULT_FILTERS, today)
  }, [favorites, festivals, today])

  return (
    <div className="favorites-page container">
      <section className="page-intro">
        <p className="favorites-page__eyebrow">MY PICKS</p>
        <h1 className="page-intro__title">관심 축제</h1>
        <p className="page-intro__desc">관심 있는 축제를 모아보세요.</p>
      </section>

      {items.length === 0 ? (
        <div className="favorites-page__empty">
          <EmptyState
            title="아직 관심 축제가 없습니다."
            description="마음에 드는 축제의 하트를 눌러 관심 축제로 저장해보세요."
          />
          <p className="center-text">
            <Link to="/festivals" className="button">
              전국 축제 둘러보기
            </Link>
          </p>
        </div>
      ) : (
        <section aria-labelledby="favorites-count">
          <div className="festivals-result">
            <h2 id="favorites-count" className="festivals-result__title" aria-live="polite">
              관심 축제
              <span className="festivals-result__count">{items.length}개</span>
            </h2>
            <p className="festivals-result__range">이 브라우저에 저장됩니다. 종료된 축제도 직접 삭제하기 전까지 유지됩니다.</p>
          </div>
          <FestivalGrid festivals={items} today={today} />
        </section>
      )}
    </div>
  )
}
