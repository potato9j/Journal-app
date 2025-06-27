# Journal‑App [분개 자동화 시스템]
## RuleMatrix‑Based Accounting Entry Generator

>  `.github`, `node_modules`, `index.html` 미업로드

--------------------------

| num. | Readme 설명 바로가기 |
| --  | -- |
| 0 | [스택‧개발기술 바로가기](#stackdev) |
| 1 | [코드 구조 바로가기](#1-project-skeleton--structure) |
| 2-1 | [업데이트 내역 바로가기](#2-1-update-contents) |
| 2-2 | [데모(개발서버) 바로가기](#2-2-데모-개발서버) |
| 3-1 | [핵심기술-RuleMatrix 바로가기](#3-1-핵심기술---rule-matrix) |
| 3-2 | [HTML&CSS 구성 바로가기](#3-2-html--css-구성) |
| 3-3 | [폴더&파일별 역할 요약 바로가기](#3-3-폴더--파일별-역할-요약) |
| 3-4 | [핵심 로직 다이어그램 바로가기](#3-4-핵심-로직-흐름-다이어그램) |
| 4 | [단계별 작업 기초 가이드 바로가기](#4-단계별-작업-가이드) |
| 5 | [LICENSE 바로가기](#5-license) |
| 6 | [최종 목표 체크리스트 바로가기](#6-최종-목표-체크리스트) |
| 7 | [팝업 내용 초안 바로가기](#7-팝업-내용-초안) |
> 00바로가기 클릭시, 해당 문단으로 이동됩니다.



<br>

--------------------------

## stack/dev.

| 계층 | 기술 | 사용 목적, 특징 |
| -- | --- | --- |
| language | JavaScript | 프런트+백엔드 |
| Framework | React18 | 컴포넌트 단위 UI / CSR(고속HMR) |
| build | Vite5 | ESM번들, 서버 스타트 |
| routing | react-router-dom6 | 9개 탭 SPA전환 | 
| style | CSS Modules + VanillaCSS | 전역 오류 X 방지 | 
| 전역상태관리 | Reack hook (useState) | 페이지 단순 로컬 상태 |
| CI/CD | GitHub Actions + Pages | `push-build-deploy` | 
| 데이터 저장 | JSON(chat.json) | 250+ 계정가목, 동의어 정리 | 
| 검증 | ESLint + Prettier | 코드 규칙성 확보 |
> 외부 API,DB 미사용 : 모든 로직 브라우저(JS)에서 실행 

> 본 파일은 프로젝트 초기 계획으로, 중기 / 말기 각 시점마다 새로운 README가 작성됨. <br>

--------------------------

## 1. Project Skeleton & Structure

```text
journal-app/
├─ .github/workflows/
│  └─ deploy.yml              # CI → GitHub Pages 자동 배포
├─ package.json               # 의존성 / 빌드·배포 스크립트 / homepage
├─ vite.config.js             # Vite 설정 (경로·빌드 최적화)
├─ public/
│   └─ index.html              # React 마운트 (#root)
├─ src/
│   ├─ main.jsx                # React 엔트리
│   ├─ App.jsx                 # 상단 Tabs + 우측 Pop‑up Trigger + Router
│   ├─ index.css               # Reset / 글로벌 변수
│   ├─ components/
│   │   ├─ Tabs/               # 상단 9개 탭 UI
│   │   │   ├─ Tabs.jsx
│   │   │   ├─ Tabs.module.css
│   │   │   └─ TabButton.jsx
│   │   ├─ Popup.module.css    # 팝업창 css
│   │   ├─ InputBox.jsx        # “거래를 입력하세요” 공용 입력창
│   │   ├─ InputBox.module.css
│   │   ├─ ChatArea.jsx        # 분개 결과 log 창
│   │   ├─ ChatArea.module.css
│   │   ├─ ResultCard.jsx      # 차변/대변 결과
│   │   └─ ResultCard.module.css
│   ├─ routes/                # **9개 탭 화면**
│   │   ├─ BasicEntry.jsx        # 기초분개
│   │   ├─ AdjustingEntry.jsx    # 수정분개
│   │   ├─ FIFO.jsx              # 선입선출법
│   │   ├─ LIFO.jsx              # 후입선출법
│   │   ├─ MovingAvg.jsx         # 이동평균법
│   │   ├─ WeightedAvg.jsx       # 총평균법
│   │   ├─ Physical.jsx          # 실지재고조사법
│   │   ├─ index.js          
│   │   ├─ Shrinkage.jsx         # 재고자산 감모손실
│   │   └─ Valuation.jsx         # 재고자산 평가손실
│   ├─ styles/
│   │   ├─ variables.css       # CSS 변수
│   │   └─ animations.css
│   ├─ engine/                # 분개 엔진 로직
│   │   ├─ chart.json         # 사진의 표를 그대로 json화 (계정명, 동의어, 성격) : +250개
│   │   ├─ index.js           # 탭 종류에 따라 서브 파서 호출
│   │   ├─ parserBasic.js     # 기초 분개
│   │   ├─ parserAdjust.js    # 수정 분개 (기간, 월할, 일할)
│   │   ├─ parserInventory.js # FIFO / LIFO / 이동 / 총평균 / 실지
│   │   ├─ parserLoss.js      # 감모, 평가 손실
│   │   ├─ ruleMatrux.js      # 동사, 방법, 대상 메트릭스
│   │   ├─ depreciationUtil.js  # 정액, 정률, 생산량법 계산
│   │   ├─ inventoryUtil.js   # 단가, 재고수량 계산 공통 함수
│   │   └─ accrual.js         # 월할, 이자 발생액 계산 유틸
│   └─ utils/
│       ├─ date.js            # 한글 날짜 → Date 변환
│       └─ number.js          # 한글 금액 → Number 변환
└─ README.md                  # 현재 문서
```
> `npm run dev` 테스트시, `public/index.html`파일 `root`(최상위 폴더)로 이동

<br>

-----------------------------------------------------------------

## 2-1. UPDATE CONTENTS

| date. | 대분류 | 세부내역 |
| -- | --- | --- |
| 25.05.27 | 프로젝트 기획&구성 | - |
| 25.06.10 | 프로젝트 중단 | 시험기간 |
| 25.06.24 | 프로젝트 재개 | 전체 재구성 | 
| 25.06.24 | 자연어 처리를 통한 분석 방식 채택 (WAY1) | React(Vite, Javascript) + tailwind / GithubPages |
| 25.06.25 | (WAY1) 폐기 | tailwind 오류 지속 |
| 25.06.25 | Typescript기반 방식 채택, 기본 분석방식 동일 | Typescript |
| 25.06.25 | Typescript 숙련도 이슈로 폐기 | - |
| 25.06.26 | Rule규칙 설정 방식 채택 (WAY2) | 외부 API사용 X <br> React(Vite, Javascript) + VanillaCSS / GithunPages |
| 25.06.26 | RuleMatrix 도입 | 기존 Rule 독자 방식의 경우, 수천 수만가지의 규칙 발생으로 RuleMatrix 방식으로 수천>수백>수십 30개 수준으로 규칙 감소 |
| 25.06.26 | localhost beta test | 동작O <br> 손실, 수정분개 엔진 일부 보완 필요 / RuleMatrix 수정 필요
<br>

-----------------------------------------------------------------

## 2-2. 데모 (개발서버)
```bash
git colone https://githun.com/000000/journal-app.git
cd hournal-app
npm install
npm run dev    # http://localhost:0000
```
* 배포 : `npm run deploy` - gh-pages branch auto push
<br>


-----------------------------------------------------------------


## 3-1. 핵심기술 - Rule Matrix
* 동사 * 지급방법 * 대상계정 = 차변*대변 계정
* 3차원 메트릭스 정의 후 수백가지 분개 규칙 자동 생성
```
      지급방법
      ┌─────────────┐
동사  │ 현금 │ 외상 │ ...
┌─────┼──────┼──────┤
│매입 │  상품 │ 외상매입금
│매도 │ 현금  │ 외상매출금
│지급 │      ...          ← resolveRule()
└─────┴──────────────────┘
```
| FILEname. | contents | 
| -- | --- |
| `ruleMatrix.js` | VERB_GROUP + METHOD_MAP + TARGET_DEFAULT |
| `chat.json` | 계정코드, 명칭, 동의어, 카테고리 모든 계정 저장 |
| `parserBasic.js` | 문장 > 토큰 > resolveRule() 호출 |
| `parserAdjust.js` | 월할/일할 이자, 감가상각 등 기간성 분개 |
| `parserInventory.js` | FILFO/LIFO?이동총평균/실지재고 | 
| `parserLoss.js` | 재고 감모, 평가손실 (원가 vs NRV) |
<br>

-----------------------------------------------------------------

## 3-2. HTML & CSS 구성

| FILEname. | contents | 역할 |
| -- | --- | --- |
| `index.html` | `<div id="root">` | React 마운팅 |
| `components/Tabs` | tabs.jsx / TabButton.jsx / Tabs.modules.css | 상단 9개 탭, 우측 팝업 버튼 UI |
| `components/InputBox.*` | `<textarea>` + Submit 버튼 | 거래입력 | 
| `components/ChatArea.*` | 스크롤 영역, 결과 카드 | 분개 로그 표시 | 
| `styles/variables.css` | `--primary`, `--gray` 등 테마 변수 | - |
| `styles/animation.css` | `fadeIn` 공통 애니메이션 | - |
* CSS Modules > `.module.css` 파일마다 클래스가 `hash_xyz`로 컴파일되어 전역 충돌 방지
> 사실 맨처음에 tailwind로 하다가 이상한 에러를 못잡아서 CSS구성 변경함.

  ```css
  .tab-active    { @apply text-black font-semibold; }
  .tab-inactive  { @apply text-gray-400 backdrop-blur-sm; }
  ```
* 각 탭 버튼(`TabButton.jsx`)은 `activeTab === name ? 'tab-active' : 'tab-inactive'`
<br>

-----------------------------------------------------------------

## 3-3. 폴더 / 파일별 역할 요약

| 경로                          | 역할                                                                       |
| --------------------------- | ------------------------------------------------------------------------ |
| **src/components/Tabs.jsx** | 9개 탭 렌더링. 클릭 시 `setActiveTab`. 비활성 탭은 `tab-inactive` 클래스로 blur + gray 처리 |
| **src/routes/**             | 탭별 화면. 공통 로직: `InputBox` → `parser()` 호출 → `ResultCard` 표시               |
| **engine/parser.js** | 자연어 분석 → (기초/수정/재고/손실) 분기 → 룰 매트릭스 또는 이자 계산 호출                           |
| **engine/accrual.js** | 수정분개(비용·수익 기간배분, 이자계산) 처리 함수                                             |
| …                           | …                                                                        |

-----------------------------------

## 3-4. 핵심 로직 흐름 (다이어그램)
```
flowchart TD
  subgraph UI
    A[사용자 입력&nbsp;<br/>Textarea]
    B[Tabs&nbsp;Router]
    C[결과&nbsp;카드&nbsp;<br/>(ChatArea)]
  end

  subgraph Engine
    D[parser*<br/>(basic · adjust · inventory · loss)]
    E[Rule&nbsp;Matrix&nbsp;<br/>resolveRule()]
    F[특수&nbsp;계산기&nbsp;<br/>(감가상각 · 재고&nbsp;util)]
  end

  A -- 문자열 --> D
  B -- 탭종류 --> D
  D -- 일반거래 --> E
  D -- 기간·재고 --> F
  E & F -- {debit, credit, amount} --> C
```
* UI층
 * 입력 문자열 + 현재 탭 종류를 엔진으로 전달
* Engine층
 * `parser*`가 입력을 분석 후 매트릭스, 특수 유틸 호출
* 결과표시
   * ChatArea가 카드 형태로 로그 출력 (ex. gpt입력창, 로그창)
<br>

-----------------------------------------------------------------

## 4. 단계별 작업 가이드

1. **프로젝트 생성 & 의존성 설치**

```bash
   npm create vite@latest journal-app -- --template react
   cd journal-app && npm i
   npm i react-router-dom gh-pages
   # Tailwind (선택)
   npm i -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
```

2. **Tabs + Router + Pop‑up Trigger**

```
  // App.jsx (발췌)
  const [showModal, setShowModal] = useState(null); // 'about'|'help'|'support'|null
  <header>
    <Tabs />
    <nav className="meta-links">
      <button onClick={()=>setShowModal('about')}>제작</button>
      <button onClick={()=>setShowModal('help')}>사용법</button>
      <button onClick={()=>setShowModal('support')}>지원 연락처</button>
    </nav>
  </header>
  {showModal==='about' && <AboutModal onClose={()=>setShowModal(null)} />}
  {/* ... */}
```


3. **Chat Area** – 각 탭 화면에서

```
  const [messages,setMessages]=useState([]);
  const handleSubmit=(txt)=>{
    const res=parse(txt, activeTab);
    setMessages([...messages,{role:'user',txt},{role:'system',res}]);
  }
```

4. **각 routes/** 작성 – 9개 탭 화면. 공통 UI 컴포넌트 사용
5. **Modal CSS** - `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%)` + `backdrop-filter:blur(2px)`
6. **dictionary.js & ruleMatrix.js** – 계정표 + 매핑 테이블 작성
7. **parser.js** – 텍스트 → `{ debit, credit, amount }` 로 변환
8. **배포 스크립트 & GitHub Actions** 설정 (위 스니펫)
9. **UI 검수** – 활성 탭 외 나머지 탭 blur/gray 동작 확인
<br>

-----------------------------------------------------------------

## 5. LICENSE
> MIT License - 자유 사용, 수정, 배포 가능 (저작권 문구 유지)
<br>

-----------------------------------------------------------------

## 6. 최종 목표 체크리스트 

* Vite(reactJS) 프로젝트 생성 완료
* `dictionary.js` 모든 계정과목 입력되어 있는가
* `ruleMatrix.js` 기본 거래 30개 룰 작성
* `parser.js` 룰 매칭
* Github Pages 주소 UI, 분개 결과 확인
<br>

-----------------------------------------------------------------

## 7. 팝업 내용 초안

**제작**
```
* Fronted : React(Vite)
* Style : CSS Modules + Vanilla CSS (not Tailwind)
```

**사용법**
```
1. 상단 탭 선택
2. 하단 공용 입력창에 거래를 입력하세요.
  Ex. 3월1일 상품 50,000원을 외상으로 매입했다.
  ** 새로운 거래를 입력하면 기존 답변은 저장되지 않습니다.
```

**지원 연락처**
```
문의 : 00000000@gmail.com
```
<br>



