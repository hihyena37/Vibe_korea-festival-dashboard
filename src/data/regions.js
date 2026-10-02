// 대한민국 17개 광역자치단체
// - areaCode: 한국관광공사 TourAPI 지역코드 (areaCode2 기준)
// - ldongCode: 법정동 시도코드 (KorService2 응답의 lDongRegnCd)
// - latitude / longitude: 시청·도청 소재지 좌표 (날씨 조회용 대표 좌표)
export const REGIONS = [
  { id: 'seoul', name: '서울', fullName: '서울특별시', areaCode: '1', ldongCode: '11', latitude: 37.5665, longitude: 126.978 },
  { id: 'busan', name: '부산', fullName: '부산광역시', areaCode: '6', ldongCode: '26', latitude: 35.1796, longitude: 129.0756 },
  { id: 'daegu', name: '대구', fullName: '대구광역시', areaCode: '4', ldongCode: '27', latitude: 35.8714, longitude: 128.6014 },
  { id: 'incheon', name: '인천', fullName: '인천광역시', areaCode: '2', ldongCode: '28', latitude: 37.4563, longitude: 126.7052 },
  { id: 'gwangju', name: '광주', fullName: '광주광역시', areaCode: '5', ldongCode: '29', latitude: 35.1595, longitude: 126.8526 },
  { id: 'daejeon', name: '대전', fullName: '대전광역시', areaCode: '3', ldongCode: '30', latitude: 36.3504, longitude: 127.3845 },
  { id: 'ulsan', name: '울산', fullName: '울산광역시', areaCode: '7', ldongCode: '31', latitude: 35.5384, longitude: 129.3114 },
  { id: 'sejong', name: '세종', fullName: '세종특별자치시', areaCode: '8', ldongCode: '36', latitude: 36.48, longitude: 127.289 },
  { id: 'gyeonggi', name: '경기', fullName: '경기도', areaCode: '31', ldongCode: '41', latitude: 37.2893, longitude: 127.0535 },
  { id: 'gangwon', name: '강원', fullName: '강원특별자치도', areaCode: '32', ldongCode: '51', latitude: 37.8853, longitude: 127.7298 },
  { id: 'chungbuk', name: '충북', fullName: '충청북도', areaCode: '33', ldongCode: '43', latitude: 36.6357, longitude: 127.4912 },
  { id: 'chungnam', name: '충남', fullName: '충청남도', areaCode: '34', ldongCode: '44', latitude: 36.6588, longitude: 126.6728 },
  { id: 'jeonbuk', name: '전북', fullName: '전북특별자치도', areaCode: '37', ldongCode: '52', latitude: 35.8203, longitude: 127.1088 },
  { id: 'jeonnam', name: '전남', fullName: '전라남도', areaCode: '38', ldongCode: '46', latitude: 34.8161, longitude: 126.4629 },
  { id: 'gyeongbuk', name: '경북', fullName: '경상북도', areaCode: '35', ldongCode: '47', latitude: 36.576, longitude: 128.5056 },
  { id: 'gyeongnam', name: '경남', fullName: '경상남도', areaCode: '36', ldongCode: '48', latitude: 35.2383, longitude: 128.6925 },
  { id: 'jeju', name: '제주', fullName: '제주특별자치도', areaCode: '39', ldongCode: '50', latitude: 33.489, longitude: 126.4983 },
]

// 구 법정동 코드(강원 42, 전북 45)로 내려오는 데이터도 매칭되도록 처리
const LEGACY_LDONG_CODES = { 42: 'gangwon', 45: 'jeonbuk' }

export function findRegionById(id) {
  return REGIONS.find((region) => region.id === id) ?? null
}

// 광주광역시 + 전라남도 통합 지역 코드 (TourAPI 응답 주소: '전남광주통합특별시 ...')
const MERGED_GWANGJU_JEONNAM_CODE = '12'

// 통합 지역은 코드만으로 구분되지 않으므로 주소의 시·군·구로 판별한다.
// 옛 광주광역시는 자치구(동구·서구·남구·북구·광산구), 옛 전라남도는 시·군으로 구성된다.
function findMergedGwangjuJeonnamRegion(festival) {
  const district = festival.addr1?.split(' ')[1] ?? ''
  if (district.endsWith('구')) return findRegionById('gwangju')
  if (district.endsWith('시') || district.endsWith('군')) return findRegionById('jeonnam')
  return null
}

// 축제 데이터의 지역코드로 소속 지역을 찾는다. 코드가 없으면 null.
export function findRegionByFestival(festival) {
  const { areaCode } = festival
  if (areaCode) {
    const region = REGIONS.find((r) => r.areaCode === areaCode)
    if (region) return region
  }
  // 시도 코드(2자리) 대신 시군구 코드(예: 세종 36110)로 내려오는 경우가 있어 앞 2자리만 사용
  const ldongCode = festival.ldongCode?.slice(0, 2)
  if (ldongCode) {
    if (ldongCode === MERGED_GWANGJU_JEONNAM_CODE) return findMergedGwangjuJeonnamRegion(festival)
    const region = REGIONS.find((r) => r.ldongCode === ldongCode)
    if (region) return region
    if (LEGACY_LDONG_CODES[ldongCode]) return findRegionById(LEGACY_LDONG_CODES[ldongCode])
  }
  return null
}
