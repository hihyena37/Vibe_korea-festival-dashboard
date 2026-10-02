import useToast from '../hooks/useToast'
import '../styles/favorite.css'

// 앱에 하나만 렌더링하는 간단한 toast (외부 라이브러리 없음)
export default function Toast() {
  const toast = useToast()
  return (
    <div aria-live="polite" role="status">
      {toast && (
        <p key={toast.id} className="toast">
          {toast.message}
        </p>
      )}
    </div>
  )
}
