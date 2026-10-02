import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <div className="container page-pad">
      <EmptyState title="페이지를 찾을 수 없습니다." description="아직 준비 중이거나 존재하지 않는 페이지입니다." />
      <p className="center-text">
        <Link to="/" className="button">
          홈으로 이동
        </Link>
      </p>
    </div>
  )
}
