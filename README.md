# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




# FESTIVAL NOW
## 전국의 축제를 한눈에

전국에서 진행 중이거나 예정된 축제 정보를 지역과 날짜별로 탐색하고,
선택한 지역의 날씨까지 함께 확인할 수 있는 React 기반 축제 정보 웹서비스.

이 프로젝트는 사용자에게 질문을 하고 결과 하나를 추천하는 서비스가 아니다.

첫 화면부터 전국의 축제 현황을 보여주고,
사용자가 직접 지역·날짜·축제를 탐색하는
"정보 탐색형 서비스 / 데이터 대시보드"로 구현한다.


---

# 1. 프로젝트 목적

사용자가 다음 정보를 한 곳에서 확인할 수 있도록 한다.

- 전국 축제 현황
- 현재 진행 중인 축제
- 앞으로 시작할 축제
- 지역별 축제
- 월별 축제
- 축제 기간
- 축제 장소
- 축제 상세정보
- 선택한 지역의 현재 날씨
- 선택한 지역의 간단한 날씨 예보
- 관심 축제 저장


---

# 2. 프로젝트 핵심 방향

이 프로젝트의 핵심은

MAP
+
FESTIVAL DATA
+
WEATHER
+
CALENDAR

이다.


사용 흐름은 다음과 같다.

HOME
→ 전국 축제 현황 확인
→ 지역 선택
→ 해당 지역 날씨 + 축제 확인
→ 축제 카드 선택
→ 축제 상세 확인

또는

HOME
→ 전국 축제 목록
→ 지역 / 날짜 / 상태 필터
→ 축제 상세

또는

CALENDAR
→ 날짜 선택
→ 해당 날짜에 진행되는 축제 확인


---

# 3. 매우 중요한 디자인 원칙

이 프로젝트는 기존의 질문형 추천 서비스처럼 만들지 않는다.

절대 다음과 같은 구조로 만들지 마.

START
→ 질문
→ 선택
→ 추천
→ 결과

첫 화면에 "시작하기" 버튼을 크게 배치하지 않는다.

첫 화면부터 실제 축제 데이터와 전국 현황이 보여야 한다.


서비스 성격:

- 정보 탐색
- 데이터 시각화
- 여행 / 지역 행사 정보
- 대시보드
- 지도 중심 탐색


디자인은 다음 방향으로 한다.

- 관광 정보 서비스 느낌
- 깔끔하고 현대적
- 정보가 많아도 복잡해 보이지 않게
- 지도와 축제 이미지가 중심
- 과도하게 귀엽거나 게임처럼 만들지 않음
- 과한 gradient 금지
- 과한 그림자 금지
- 지나치게 큰 둥근 카드 남발 금지
- PC에서 넓은 화면을 적극적으로 활용
- 모바일에서도 정보 구조 유지

오늘 뭐 먹지? 같은 질문형 / 게임형 UI와 시각적으로도 확실히 다르게 만든다.


---

# 4. 기술 범위

Frontend:

- React
- Vite
- JavaScript
- CSS

상태관리는 기본 React Hook을 사용한다.

가능하면:

- useState
- useEffect
- useMemo

수준에서 구현한다.

복잡한 상태관리 라이브러리는 사용하지 않는다.

백엔드는 구현하지 않는다.

사용하지 않는 기술:

- Spring
- Java Backend
- MySQL
- Firebase
- 서버 DB
- 로그인
- 회원가입

현재 프로젝트는 프론트엔드 중심 포트폴리오 프로젝트이다.


---

# 5. 외부 데이터

## 5-1. 축제 데이터

한국관광공사 국문 관광정보 OpenAPI를 사용한다.

공공데이터포털에서 발급받은 API 인증키를 사용한다.

축제 관련 데이터는 실제 API 데이터를 우선 사용한다.

필요한 데이터 예:

- contentid
- 축제명
- 시작일
- 종료일
- 주소
- 지역코드
- 대표 이미지
- 좌표
- 상세 설명
- 문의처
- 홈페이지
- 행사 장소

API 응답에서 존재하지 않는 값은 억지로 생성하지 않는다.

데이터가 없는 항목은:

"정보 없음"

또는 UI에서 해당 항목을 숨긴다.

가짜 축제 정보를 만들어 실제 데이터처럼 표시하지 않는다.


---

# 6. API Key 관리

API Key를 코드에 직접 작성하지 않는다.

프로젝트 루트에:

.env

를 사용한다.

예:

VITE_TOUR_API_KEY=발급받은키

그리고 .gitignore에 반드시 .env가 포함되게 한다.

GitHub에 API Key가 올라가지 않게 한다.


---

# 7. 날씨 API

1차 버전의 날씨는 Open-Meteo Forecast API를 사용한다.

선택한 지역의 대표 좌표(latitude / longitude)를 이용해
현재 날씨와 간단한 예보를 가져온다.

날씨 데이터 예:

- 현재 기온
- 체감 기온
- 오늘 최고 기온
- 오늘 최저 기온
- 강수 확률
- weather code
- 현재 날씨 상태

날씨 상태는 weather code를 해석해서:

- 맑음
- 구름 조금
- 흐림
- 비
- 눈
- 천둥번개

등 사람이 읽을 수 있는 한국어로 표시한다.


---

# 8. 지역 데이터

대한민국 17개 광역자치단체를 기준으로 한다.

- 서울
- 부산
- 대구
- 인천
- 광주
- 대전
- 울산
- 세종
- 경기
- 강원
- 충북
- 충남
- 전북
- 전남
- 경북
- 경남
- 제주

src/data/regions.js

같은 별도 파일에서 관리한다.

각 지역 데이터에는 필요한 경우:

- id
- name
- TourAPI areaCode
- latitude
- longitude

를 저장한다.

지역 코드나 좌표는 임의로 만들지 말고 실제 값에 근거해서 작성한다.


---

# 9. 전체 페이지

필요한 핵심 화면은 다음과 같다.

1. HOME
2. FESTIVALS
3. REGION
4. CALENDAR
5. FESTIVAL DETAIL
6. MY PICKS


---

# 10. HOME

HOME은 이 프로젝트에서 가장 중요한 화면이다.

첫 화면을 히어로 문구만 크게 띄운 랜딩페이지처럼 만들지 않는다.

화면을 열자마자:

- 전국 축제 지도
- 현재 축제 현황
- 축제 카드

가 보여야 한다.


## 상단 Header

예:

FESTIVAL NOW

메뉴:

- 전국축제
- 캘린더
- 관심축제


검색 아이콘 또는 검색창도 제공할 수 있다.


---

# 11. HOME 상단 정보

메인 카피는 작게 사용할 수 있다.

예:

전국의 축제를 한눈에

또는

지금 대한민국에서는
어떤 축제가 열리고 있을까요?


하지만 이 문구가 화면 대부분을 차지하면 안 된다.

그 아래 바로 데이터가 보여야 한다.


---

# 12. 전국 축제 현황

현재 날짜를 기준으로 다음 숫자를 계산해서 보여준다.

예:

진행 중
38

이번 달
124

곧 시작
26


실제 API 데이터 기준으로 계산한다.


정의:

진행 중:
festivalStartDate <= today <= festivalEndDate

예정:
today < festivalStartDate

종료:
festivalEndDate < today


이번 달:
현재 월과 축제 기간이 겹치는 축제


---

# 13. 대한민국 지도

HOME 중앙의 핵심 UI로 대한민국 지역 지도를 배치한다.

가능하면 17개 광역지역을 선택할 수 있는 SVG / GeoJSON 기반 지도를 사용한다.

중요:

실제 지역 경계를 임의의 모양으로 만들어 대한민국 지도처럼 표시하지 않는다.

정확한 지도 데이터를 사용할 수 있다면
공개 사용 가능한 검증된 지도 데이터만 사용한다.

지도 위 각 지역은 클릭 가능해야 한다.


지역 hover 시:

예:

대구광역시

진행 중 축제
6개

오늘
24°C / 맑음


정도의 작은 tooltip 또는 info card를 보여준다.


지역 클릭 시:

REGION 화면으로 이동한다.


---

# 14. 지도 데이터 시각화

지역별 현재 축제 수에 따라 지도 색상 농도가 달라지게 한다.

예:

축제 없음
→ 가장 연한 색

1~3개
→ 연함

4~7개
→ 중간

8개 이상
→ 진함


정확한 숫자 구간은 디자인하면서 조정해도 된다.

지도 옆 또는 아래에 legend를 제공한다.


---

# 15. HOME 축제 섹션

지도 아래에는 실제 축제 카드를 보여준다.


섹션 예:

## 지금 진행 중인 축제

진행 중인 축제를 보여준다.


## 곧 시작하는 축제

시작 예정 축제를 보여준다.


## 이번 달 축제

현재 월 기준 축제를 보여준다.


각 섹션은 너무 많은 카드를 한 번에 보여주지 않는다.

PC에서는 3~4개 정도 보여주고:

전체보기 →

버튼을 제공한다.


---

# 16. 축제 카드

FestivalCard 컴포넌트를 만든다.

카드 정보:

- 대표 이미지
- 진행 상태
- 축제명
- 지역
- 기간
- 관심축제 버튼


예:

[IMAGE]

진행중

진주남강유등축제

경상남도 진주시

2026.10.05 - 2026.10.20

♡


이미지가 없는 축제는 깨진 이미지 아이콘을 표시하지 않는다.

공통 placeholder를 사용한다.


---

# 17. 축제 상태 Badge

오늘 날짜를 기준으로 자동 계산한다.

예:

진행중

D-7

오늘 시작

종료 D-2

종료


단순 문자열을 데이터에 직접 저장하지 않고
날짜를 기준으로 계산하는 utility 함수를 만든다.

예:

src/utils/festivalStatus.js


---

# 18. FESTIVALS 화면

전국 축제를 목록으로 탐색하는 페이지.


상단:

전국 축제

현재 대한민국에서 열리는 다양한 축제를 만나보세요.


그 아래 FilterBar.


필터:

지역
전체 / 서울 / 부산 / 대구 / ...

기간
- 오늘
- 이번 주
- 이번 달
- 날짜 직접 선택

상태
- 전체
- 진행중
- 예정
- 종료


검색:

축제명 또는 지역 검색


---

# 19. 필터 동작

필터는 실제 데이터에 적용한다.

여러 조건을 동시에 적용할 수 있게 한다.

예:

지역:
대구

기간:
이번 달

상태:
진행중


→ 세 조건을 모두 만족하는 결과 표시.


결과 개수도 표시한다.

예:

대구광역시
진행 중인 축제 6개


결과가 없으면:

조건에 맞는 축제가 없습니다.

필터를 변경해 다른 축제를 찾아보세요.

라는 empty state를 제공한다.


---

# 20. REGION 화면

지도에서 지역을 클릭하면 이동한다.

예:

DAEGU
대구광역시


상단은 지역 소개 랜딩 페이지처럼 크게 만들지 않는다.

바로:

날씨
+
축제 통계
+
축제 목록

을 보여준다.


---

# 21. 지역 날씨

WeatherCard 컴포넌트를 만든다.

예:

대구광역시

오늘의 날씨

맑음
24°C

체감 25°C

최고 27°
최저 17°

강수확률 10%


가능하면 오늘 이후 2~3일 정도도 작은 형태로 보여준다.

예:

오늘
24°
맑음

내일
21°
비

모레
23°
구름


---

# 22. 날씨와 축제 연결

날씨 데이터를 기반으로 간단한 안내를 표시할 수 있다.

이 기능은 AI를 사용하지 않는다.

단순 조건식으로 구현한다.


예:

강수확률이 높을 경우:

비 예보가 있습니다.
야외 행사 방문 전 운영 여부를 확인하세요.


날씨가 맑고 강수확률이 낮으면:

야외 축제를 즐기기 무난한 날씨입니다.


단:

과장된 표현이나 안전을 보장하는 표현은 하지 않는다.


---

# 23. REGION 축제 현황

날씨 옆 또는 아래에:

현재 진행
6

이번 달
14

예정
8

등 해당 지역 기준 통계를 보여준다.


그 아래:

대구에서 열리는 축제

카드 목록을 표시한다.


---

# 24. CALENDAR

월별 축제를 달력 형태로 탐색한다.

상단:

< 2026년 10월 >


일 월 화 수 목 금 토


각 날짜에 진행 중인 축제가 존재하면
dot 또는 작은 indicator를 표시한다.


예:

12
● 3


의미:

10월 12일에 진행되는 축제가 3개 있음.


날짜 클릭 시:

10월 12일 진행 축제

리스트를 달력 아래 또는 오른쪽 패널에 보여준다.


---

# 25. 축제 기간 처리

축제가:

10월 10일 ~ 10월 15일

이라면:

10
11
12
13
14
15

모든 날짜에 해당 축제가 진행 중인 것으로 처리한다.


---

# 26. FESTIVAL DETAIL

축제 카드를 클릭하면 상세 화면을 보여준다.

구성:

대표 이미지

진행 상태

축제명

기간

주소

행사 장소

문의

홈페이지


상세 설명


지도 좌표가 존재하면:

위치 정보

를 표시한다.


지도 API를 반드시 붙일 필요는 없다.

1차 버전에서는 좌표 또는
외부 지도 검색 링크 정도로 처리해도 된다.


---

# 27. 축제 상세 날씨

축제가 진행되는 지역의 현재 날씨를 작은 카드로 함께 보여준다.

예:

현재 진주시

23°C
맑음

강수확률 10%


사용자가 축제 정보와 지역 날씨를
한 화면에서 볼 수 있게 한다.


---

# 28. MY PICKS

사용자가 축제 카드의 ♡ 버튼을 누르면
관심 축제로 저장한다.

로그인은 사용하지 않는다.

localStorage를 이용한다.


예:

festival-now-favorites


저장할 데이터:

contentid


등 최소 데이터만 관리하고,
실제 표시 정보는 가능하면 축제 데이터와 매칭한다.


새로고침해도 관심 축제가 유지되어야 한다.


---

# 29. 검색

축제명을 검색할 수 있게 한다.

가능하면 검색 대상:

- 축제명
- 지역
- 주소


검색어는 대소문자 / 공백 때문에 지나치게 엄격하게 일치하지 않게 처리한다.


---

# 30. 로딩 상태

API 요청 중에는 빈 화면을 보여주지 않는다.

Skeleton UI 또는 loading card를 제공한다.


예:

축제 정보를 불러오고 있습니다.


---

# 31. API 오류 처리

API 호출 실패 시 앱 전체가 깨지면 안 된다.

예:

축제 정보를 불러오지 못했습니다.

잠시 후 다시 시도해주세요.

[다시 시도]


날씨 API 오류 역시 축제 목록 전체에 영향을 주면 안 된다.

날씨만:

날씨 정보를 불러올 수 없습니다.

라고 표시한다.


---

# 32. 데이터 없는 경우

API에서 다음 데이터가 없을 수 있다.

- 이미지
- 문의처
- 홈페이지
- 상세 설명

값이 없다고 해서 임의로 내용을 생성하지 않는다.

조건부 렌더링을 한다.


---

# 33. 날짜 처리

날짜 관련 로직은 utility로 분리한다.

예:

src/utils/date.js

필요 기능:

- YYYYMMDD → YYYY.MM.DD
- 진행중 여부
- 예정 여부
- 종료 여부
- D-Day
- 현재 월 축제 판별
- 특정 날짜 축제 판별


---

# 34. 권장 폴더 구조

src/

api/
- tourApi.js
- weatherApi.js

components/
- Header.jsx
- KoreaMap.jsx
- FestivalCard.jsx
- FestivalGrid.jsx
- FestivalStatusBadge.jsx
- WeatherCard.jsx
- StatsCard.jsx
- FilterBar.jsx
- SearchBar.jsx
- LoadingSkeleton.jsx
- EmptyState.jsx

pages/
- Home.jsx
- Festivals.jsx
- Region.jsx
- Calendar.jsx
- FestivalDetail.jsx
- Favorites.jsx

data/
- regions.js

utils/
- date.js
- festivalStatus.js
- weatherCode.js

styles/

assets/

App.jsx
main.jsx


필요한 경우 구조를 조금 변경해도 된다.

단:

한 파일에 모든 코드를 몰아넣지 않는다.


---

# 35. 페이지 이동

프로젝트 규모가 작다면
과도하게 복잡한 라우팅 구조는 사용하지 않는다.

React Router를 사용하는 것이 구조상 명확하다면 사용해도 된다.

예:

/
→ HOME

/festivals
→ FESTIVALS

/region/daegu
→ REGION

/calendar
→ CALENDAR

/festival/:contentId
→ DETAIL

/favorites
→ MY PICKS


---

# 36. 반응형

반드시 PC / Tablet / Mobile 대응.


기준:

PC
1440px 이상

Tablet
768px ~ 1024px

Mobile
360px 이상


PC:

지도 + 데이터 패널을 넓게 활용한다.


Tablet:

지도와 정보 영역이 자연스럽게 재배치되게 한다.


Mobile:

지도 때문에 전체 페이지가 가로로 넘치지 않게 한다.

필요하면 모바일에서는:

지도
↓
선택 지역 정보

형태로 세로 배치한다.


---

# 37. 접근성

기본적인 접근성을 고려한다.

- 클릭 가능한 요소는 button 사용
- 이미지 alt 제공
- focus 상태 제공
- 색상만으로 상태를 구분하지 않음
- keyboard 접근 가능
- 적절한 aria-label 사용


---

# 38. 디자인 스타일

전국 관광 / 축제 정보 서비스에 어울리는 분위기.

키워드:

- Explore
- Local
- Festival
- Korea
- Data
- Travel


레이아웃은 정보 중심.

추천 방향:

밝은 neutral 배경
+
dark text
+
선명한 한 가지 main color
+
필요한 곳에만 지역별 accent


폰트:

Pretendard 또는 Noto Sans KR


텍스트 위계:

큰 페이지 타이틀
↓
섹션 타이틀
↓
축제명
↓
정보


일관된 spacing system을 사용한다.


---

# 39. 애니메이션

애니메이션은 보조적으로만 사용한다.

허용:

- 카드 hover
- 지도 hover
- 페이지 fade
- tooltip
- favorite 버튼
- loading skeleton


사용하지 않을 것:

- 룰렛
- 슬롯머신
- 과도한 floating animation
- 게임형 효과음
- 화려한 페이지 전환


정보 탐색 서비스 성격을 유지한다.


---

# 40. 오늘 뭐 먹지? 프로젝트와의 차별화

이 프로젝트는 기존 "오늘 뭐 먹지?" 프로젝트와
UX와 시각적인 성격이 확실히 달라야 한다.


오늘 뭐 먹지?

질문
→ 취향 분석
→ 후보
→ 룰렛
→ 결과


FESTIVAL NOW

데이터
→ 지도 탐색
→ 필터
→ 지역 날씨
→ 상세 정보


따라서:

- 질문형 UI 사용 금지
- 결과 하나를 추천하는 구조 금지
- 룰렛 사용 금지
- START 화면 사용 금지

이 프로젝트는 포털 / 지도 / 대시보드 성격으로 구현한다.


---

# 41. 1차 구현 우선순위

한 번에 모든 기능을 무리하게 만들지 않는다.


## STEP 1

기본 구조

- Header
- HOME
- 전국 현황
- FestivalCard
- API 연결


## STEP 2

축제 목록

- 검색
- 지역 필터
- 날짜 필터
- 상태 필터


## STEP 3

지역 페이지

- 지역 선택
- 지역별 축제
- 날씨 API


## STEP 4

지도

- 17개 지역 클릭
- hover 정보
- 축제 개수에 따른 시각화


## STEP 5

캘린더


## STEP 6

축제 상세


## STEP 7

관심 축제 localStorage


---

# 42. Claude Code 작업 방식

이 README를 전체 요구사항 문서로 사용한다.

작업 전에 먼저:

1. 현재 프로젝트 파일 구조 확인
2. package.json 확인
3. 기존 코드 확인
4. 필요한 작업 계획 수립

그 뒤 구현한다.


한 번에 프로젝트 전체를 무리하게 다시 작성하지 않는다.

정상 동작하는 코드는 유지한다.


---

# 43. 코드 작성 원칙

- 이해하기 어려운 과도한 추상화 금지
- 필요 없는 라이브러리 설치 금지
- 동일 로직 반복 시 컴포넌트 / utility 분리
- console error 없어야 함
- React key warning 없어야 함
- 사용하지 않는 import 제거
- API Key 하드코딩 금지
- 실제 데이터가 없으면 거짓 데이터 생성 금지


---

# 44. 작업 완료 시 확인

각 단계가 끝날 때:

npm run build

를 실행해서 build가 성공하는지 확인한다.


그리고 마지막에 다음 내용을 설명한다.

1. 생성한 파일
2. 수정한 파일
3. API 호출 구조
4. 축제 상태 계산 방법
5. 날씨 API 구조
6. 지도 데이터 처리 방법
7. localStorage 구조
8. 반응형 처리 방법
9. 아직 구현하지 않은 기능
10. 다음 작업 권장 순서


---

# 45. 최종 목표

사용자가 사이트에 들어왔을 때

"전국에서 지금 어떤 축제가 열리고 있는지"

를 첫 화면에서 바로 알 수 있어야 한다.


그리고 원하는 지역을 선택하면

"그 지역의 날씨와 축제"

를 동시에 확인할 수 있어야 한다.


이 프로젝트의 핵심 경험은:

전국을 보고
→ 지역을 고르고
→ 축제를 발견하고
→ 상세정보와 날씨를 확인하는 것

이다.#   V i b e _ k o r e a - f e s t i v a l - d a s h b o a r d  
 