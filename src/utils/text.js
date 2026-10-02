// TourAPI 텍스트 필드에는 <br>, <a>, &nbsp; 같은 HTML이 섞여 올 수 있다.
// HTML로 렌더링하지 않고(dangerouslySetInnerHTML 미사용) 순수 텍스트로 정리해 안전하게 표시한다.

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·' }

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const num = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(num) ? String.fromCodePoint(num) : match
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match
  })
}

// HTML 문자열 → 줄바꿈이 유지된 일반 텍스트
export function htmlToText(html) {
  if (!html) return ''
  const text = String(html)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
  return decodeEntities(text)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const URL_PATTERN = /(https?:\/\/[^\s"'<>]+|www\.[^\s"'<>]+)/gi

// http/https만 허용해 javascript: 등의 링크를 막는다.
function toSafeUrl(rawCandidate) {
  // 문장 끝 구두점(쉼표·마침표·괄호 등)은 URL에서 제외
  const candidate = decodeEntities(rawCandidate).replace(/[),.;'"]+$/, '')
  const url = /^https?:\/\//i.test(candidate) ? candidate : `http://${candidate}`
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : ''
  } catch {
    return ''
  }
}

// 홈페이지 필드에서 링크 목록 추출 → [{ label, url }]
// 예: '공식 홈페이지 https://a.kr\n공식 인스타그램 https://instagram.com/b' → 2개
//     '<a href="http://a.kr">http://a.kr</a>' → 1개 (label 없음)
export function extractLinks(value) {
  if (!value) return []
  const links = []
  const add = (label, candidate) => {
    const url = toSafeUrl(candidate)
    if (!url || links.some((link) => link.url === url)) return
    const cleanLabel = label.replace(/[\s:：\-|([]+$/, '').trim()
    // 글자·숫자가 없는 라벨('(' 등)은 버린다.
    links.push({ label: /[\p{L}\p{N}]/u.test(cleanLabel) ? cleanLabel : '', url })
  }

  // <a href="...">텍스트</a>
  const withoutAnchors = String(value).replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_, href, inner) => {
    const innerText = htmlToText(inner)
    add(URL_PATTERN.test(innerText) ? '' : innerText, href)
    URL_PATTERN.lastIndex = 0
    return '\n'
  })

  // 일반 텍스트 줄: 'URL 앞의 글자'를 라벨로 사용
  for (const line of htmlToText(withoutAnchors).split('\n')) {
    let rest = line
    for (const match of line.matchAll(URL_PATTERN)) {
      const [before] = rest.split(match[0])
      add(before, match[0])
      rest = rest.slice(rest.indexOf(match[0]) + match[0].length)
    }
  }
  return links
}
