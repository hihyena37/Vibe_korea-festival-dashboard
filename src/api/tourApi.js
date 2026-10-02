import { addDays, getMonthRange, getTodayYmd } from '../utils/date'
import { extractLinks, htmlToText } from '../utils/text'

// 한국관광공사 국문 관광정보 서비스 (KorService2)
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2'
const PAGE_SIZE = 300
// 진행 중인 장기 축제와 최근 종료 축제까지 포함하기 위해 몇 달 전부터 조회한다.
const LOOKBACK_DAYS = 90
// TourAPI 콘텐츠 타입: 15 = 축제/공연/행사
const FESTIVAL_CONTENT_TYPE_ID = '15'

function getServiceKey() {
  const key = import.meta.env.VITE_TOUR_API_KEY
  if (!key) {
    throw new Error('API 인증키가 설정되지 않았습니다. 프로젝트 루트의 .env 파일에 VITE_TOUR_API_KEY를 입력하세요.')
  }
  // 공공데이터포털의 Encoding 키를 넣은 경우 이중 인코딩되지 않도록 디코딩한다.
  return key.includes('%') ? decodeURIComponent(key) : key
}

async function request(operation, params) {
  const query = new URLSearchParams({
    serviceKey: getServiceKey(),
    MobileOS: 'ETC',
    MobileApp: 'FestivalNow',
    _type: 'json',
    ...params,
  })

  const response = await fetch(`${BASE_URL}/${operation}?${query}`)
  if (!response.ok) {
    throw new Error(`축제 API 요청 실패 (HTTP ${response.status})`)
  }

  // 인증 오류 등은 JSON이 아닌 XML/텍스트로 내려오는 경우가 있다.
  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('축제 API 응답을 해석할 수 없습니다. 인증키를 확인하세요.')
  }

  const header = data?.response?.header
  if (header?.resultCode !== '0000') {
    throw new Error(`축제 API 오류: ${header?.resultMsg ?? '알 수 없는 오류'}`)
  }
  return data.response.body
}

function toItemArray(body) {
  const item = body?.items?.item
  if (!item) return []
  return Array.isArray(item) ? item : [item]
}

// http 이미지는 https 배포 환경에서 차단되므로 프로토콜만 맞춘다.
function toHttps(url) {
  if (!url) return ''
  return url.replace(/^http:\/\//, 'https://')
}

// API 응답 → 앱에서 사용하는 축제 객체. 없는 값은 빈 문자열로 두고 임의로 채우지 않는다.
function normalizeFestival(item) {
  return {
    id: String(item.contentid),
    title: item.title ?? '',
    startDate: item.eventstartdate ?? '',
    endDate: item.eventenddate ?? '',
    addr1: item.addr1 ?? '',
    addr2: item.addr2 ?? '',
    areaCode: item.areacode ? String(item.areacode) : '',
    ldongCode: item.lDongRegnCd ? String(item.lDongRegnCd) : '',
    image: toHttps(item.firstimage || item.firstimage2),
    mapx: item.mapx ?? '',
    mapy: item.mapy ?? '',
    tel: item.tel ?? '',
  }
}

// 상세조회 결과 → 상세 페이지용 축제 객체
// detailCommon2(공통정보) + detailIntro2(행사 소개정보)를 조합한다. 없는 값은 빈 문자열.
function normalizeFestivalDetail(common, intro) {
  const text = (value) => htmlToText(value)
  const commonLinks = extractLinks(common.homepage)
  return {
    id: String(common.contentid),
    title: text(common.title),
    // 기간은 행사 소개정보(detailIntro2)에만 있다.
    startDate: intro?.eventstartdate ?? '',
    endDate: intro?.eventenddate ?? '',
    addr1: text(common.addr1),
    addr2: text(common.addr2),
    areaCode: common.areacode ? String(common.areacode) : '',
    ldongCode: common.lDongRegnCd ? String(common.lDongRegnCd) : '',
    image: toHttps(common.firstimage || common.firstimage2),
    mapx: common.mapx ?? '',
    mapy: common.mapy ?? '',
    tel: text(common.tel) || text(intro?.sponsor1tel),
    telName: text(common.telname),
    // 홈페이지 필드에 여러 링크(공식 홈페이지, 인스타그램 등)가 오는 경우가 있어 목록으로 둔다.
    links: commonLinks.length > 0 ? commonLinks : extractLinks(intro?.eventhomepage),
    overview: text(common.overview),
    place: text(intro?.eventplace),
    playtime: text(intro?.playtime),
    fee: text(intro?.usetimefestival),
    sponsor: text(intro?.sponsor1),
    program: text(intro?.program),
  }
}

export class FestivalNotFoundError extends Error {}

// 축제 상세조회: 공통정보와 소개정보를 동시에 요청해 하나로 합친다.
// 소개정보(기간·장소 등)만 실패한 경우에는 공통정보만으로 표시한다.
export async function getFestivalDetail(contentId) {
  const [commonBody, introResult] = await Promise.all([
    request('detailCommon2', { contentId }),
    request('detailIntro2', { contentId, contentTypeId: FESTIVAL_CONTENT_TYPE_ID }).then(
      (body) => ({ ok: true, body }),
      (error) => ({ ok: false, error }),
    ),
  ])

  const common = toItemArray(commonBody)[0]
  if (!common) {
    throw new FestivalNotFoundError('해당 축제 정보를 찾을 수 없습니다.')
  }
  if (!introResult.ok) console.warn(introResult.error)
  const intro = introResult.ok ? toItemArray(introResult.body)[0] : null

  return normalizeFestivalDetail(common, intro)
}

// 조회 기준일. searchFestival2는 이 날짜 이후에 '종료되는' 행사를 모두 반환하므로
// 이 날짜 이후의 일정은 빠짐없이 포함된다. (캘린더 조회 가능 범위로도 사용)
export function getFestivalDataStartDate(today = getTodayYmd()) {
  return getMonthRange(addDays(today, -LOOKBACK_DAYS)).start
}

// 행사 정보 조회 (searchFestival2). 전체 페이지를 모아 반환한다.
export async function fetchFestivals() {
  const eventStartDate = getFestivalDataStartDate()
  const baseParams = { eventStartDate, arrange: 'A', numOfRows: String(PAGE_SIZE) }

  const firstBody = await request('searchFestival2', { ...baseParams, pageNo: '1' })
  const totalPages = Math.ceil((firstBody.totalCount ?? 0) / PAGE_SIZE)

  const restBodies = await Promise.all(
    Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) =>
      request('searchFestival2', { ...baseParams, pageNo: String(i + 2) }),
    ),
  )

  const seen = new Set()
  return [firstBody, ...restBodies]
    .flatMap(toItemArray)
    .map(normalizeFestival)
    .filter((festival) => {
      // 기간 정보가 없는 데이터는 상태 계산이 불가능하므로 제외
      if (!festival.startDate || !festival.endDate || seen.has(festival.id)) return false
      seen.add(festival.id)
      return true
    })
}
