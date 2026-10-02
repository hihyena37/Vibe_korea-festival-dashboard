import { useSyncExternalStore } from 'react'

// 간단한 전역 toast (한 번에 하나, 잠시 후 자동으로 사라짐)
const DURATION = 2200

let current = null // { id, message }
let timer = null
let nextId = 1
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

export function showToast(message) {
  current = { id: nextId++, message }
  clearTimeout(timer)
  timer = setTimeout(() => {
    current = null
    emit()
  }, DURATION)
  emit()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export default function useToast() {
  return useSyncExternalStore(subscribe, () => current)
}
