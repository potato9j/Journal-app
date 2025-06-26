# Journal‑App

## RuleMatrix‑Based Accounting Entry Generator

> **Stack** : React (Vite, **JavaScript**), GitHub Pages, Pure Client‑Side Rule Engine <br>

> **Goal**: Convert Korean natural‑language transaction sentences into double‑entry journal entries (차변 / 대변) <br>
> **[Without any external APIs]** <br>

> 본 파일은 프로젝트 초기 계획으로, 중기 / 말기 각 시점마다 새로운 README가 작성됨. <br>
> 최하단 update contents 내역표 
---
* 25년 06월 27일 02:57 update
  * 베타 시스템 작동 확인 / 표면적 에러 수정
  * <보완사항> 코드 간결화 / 복잡성 높은 구문 분석 메트릭스 보완

---

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
│   │   ├─ chart.json         # 사진의 표를 그대로 json화 (계정명, 동의어, 성격)
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

**HTML & CSS 구성**

* `public/index.html` : React 번들 삽입용 단일 HTML
* `src/index.css` : 전역 타이포·컬러·Tailwind 지시자
* `src/styles/tabs.css` : 탭‑활성/비활성 상태 스타일

  ```css
  .tab-active    { @apply text-black font-semibold; }
  .tab-inactive  { @apply text-gray-400 backdrop-blur-sm; }
  ```
* 각 탭 버튼(`TabButton.jsx`)은 `activeTab === name ? 'tab-active' : 'tab-inactive'`

---

## 2. 폴더 / 파일별 역할 요약

| 경로                          | 역할                                                                       |
| --------------------------- | ------------------------------------------------------------------------ |
| **src/components/Tabs.jsx** | 9개 탭 렌더링. 클릭 시 `setActiveTab`. 비활성 탭은 `tab-inactive` 클래스로 blur + gray 처리 |
| **src/routes/**             | 탭별 화면. 공통 로직: `InputBox` → `parser()` 호출 → `ResultCard` 표시               |
| **engine/parser.js** | 자연어 분석 → (기초/수정/재고/손실) 분기 → 룰 매트릭스 또는 이자 계산 호출                           |
| **engine/accrual.js** | 수정분개(비용·수익 기간배분, 이자계산) 처리 함수                                             |
| …                           | …                                                                        |

---

## 3. 단계별 작업 가이드

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

---

## 4. 핵심 로직 흐름 (다이어그램)

```
graph TD
IN[입력 텍스트] --> TOK(Tokenizer)
TOK --> CLS(Key Classifier)
CLS --> BRANCH{탭 종류}
BRANCH -->|기초| RULES1[ruleMatrix lookup]
BRANCH -->|수정| ACCRUAL[accrual.js]
BRANCH -->|재고| RULES2
BRANCH -->|손실| RULES3
RULES1 & RULES2 & RULES3 & ACCRUAL --> OUT[분개 객체]
OUT --> UI[ResultCard]
```

---

## 5. 최종 목표 체크리스트 ✅

* Vite(reactJS) 프로젝트 생성 완료
* `dictionary.js` 모든 계정과목 입력되어 있는가
* `ruleMatrix.js` 기본 거래 30개 룰 작성
* `parser.js` 룰 매칭
* Github Pages 주소 UI, 분개 결과 확인

---

## 6. 팝업 내용 초안

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

### UPDATE CONTENTS

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




