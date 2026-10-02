import { useSyncExternalStore } from 'react'
import { showToast } from './useToast'

// 관심 축제 저장소 (localStorage + 메모리)
// - 모든 화면이 같은 store를 구독하므로 Context 없이 상태가 일관된다.
// - 다른 탭에서 바꾼 내용도 'storage' 이벤트로 반영한다.
const STORAGE_KEY = 'festival-now-favorites'

// 카드 표시에 필요한 최소 정보만 저장한다. (전체 API 응답은 저장하지 않음)
// 목록 API 데이터에 같은 축제가 있으면 화면에서는 최신 데이터를 우선 사용한다.
const SNAPSHOT_FIELDS = ['title', 'image', 'startDate', 'endDate', 'addr1', 'areaCode', 'ldongCode']

function toSnapshot(festival) {
  const snapshot = { id: String(festival.id) }
  for (const field of SNAPSHOT_FIELDS) snapshot[field] = typeof festival[field] === 'string' ? festival[field] : ''
  snapshot.savedAt = Date.now()
  return snapshot
}

// 깨진 JSON / 예상과 다른 형식이어도 앱이 멈추지 않도록 검증 후 사용
function readStorage() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set()
    return parsed
      .map((item) => (typeof item === 'string' ? { id: item } : item)) // id만 저장된 형식도 허용
      .filter((item) => {
        if (!item || typeof item.id !== 'string' || !item.id || seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })
  } catch {
    return []
  }
}

let warnedWriteFailure = false

function writeStorage(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // 저장 공간 부족 · 비공개 모드 등: 현재 화면에서는 동작하되 새로고침 후 유지되지 않는다.
    if (!warnedWriteFailure) {
      warnedWriteFailure = true
      showToast('브라우저 저장소를 사용할 수 없어 새로고침 후에는 유지되지 않습니다.')
    }
  }
}

let favorites = typeof window === 'undefined' ? [] : readStorage()
const listeners = new Set()

function setFavorites(next) {
  favorites = next
  writeStorage(next)
  listeners.forEach((listener) => listener())
}

// 다른 탭에서 변경 시 반영 (리스너는 모듈에서 한 번만 등록)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    favorites = readStorage()
    listeners.forEach((listener) => listener())
  })
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => favorites

export function isFavorite(contentId) {
  return favorites.some((item) => item.id === String(contentId))
}

export function addFavorite(festival) {
  if (isFavorite(festival.id)) return // 중복 저장 방지
  setFavorites([...favorites, toSnapshot(festival)])
}

export function removeFavorite(contentId) {
  setFavorites(favorites.filter((item) => item.id !== String(contentId)))
}

// 저장/삭제 후 짧은 toast로 결과를 알린다. 저장 여부(true/false)를 반환.
export function toggleFavorite(festival) {
  if (isFavorite(festival.id)) {
    removeFavorite(festival.id)
    showToast('관심 축제에서 삭제했습니다.')
    return false
  }
  addFavorite(festival)
  showToast('관심 축제에 저장했습니다.')
  return true
}

export default function useFavorites() {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => [])
  return { favorites: items, isFavorite, toggleFavorite, addFavorite, removeFavorite }
}
