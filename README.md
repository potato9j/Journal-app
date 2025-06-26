# P2-Accounting-Finance-System

# Journal‑App – Rule‑Based Accounting Entry Generator

> **Stack** : React (Vite, **JavaScript**), GitHub Pages, Pure Client‑Side Rule Engine <br>
> **Goal**: Convert Korean natural‑language transaction sentences into double‑entry journal entries (차변 / 대변) <br>
> **[Without any external APIs]** <br>
> 본 파일은 프로젝트 초기 계획으로, 중기 / 말기 각 시점마다 새로운 README가 작성됨.

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
│   │   ├─ Tabs/               # 상단 9 개 탭 UI
│   │   │   ├─ Tabs.jsx
│   │   │   ├─ Tabs.module.css
│   │   │   └─ TabButton.jsx
│   │   ├─ InputBox.jsx        # “거래를 입력하세요” 공용 입력창
│   │   ├─ InputBox.module.css
│   │   ├─ ChatArea.jsx        # GPT 답변 (분개 결과 log 창)
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
│   │   ├─ Shrinkage.jsx         # 재고자산 감모손실
│   │   └─ Valuation.jsx         # 재고자산 평가손실
│   ├─ styles/
│   │   ├─ variables.css       # CSS 변수
│   │   └─ animations.css
│   ├─ engine/                # 분개 엔진 로직
│   │   ├─ dictionary.js      # 계정과목·동의어 사전
│   │   ├─ ruleMatrix.js      # 동사+대상+방법 → 차·대 매핑
│   │   ├─ accrual.js         # 월할·일할 이자 계산 util
│   │   └─ parser.js          # 자연어 파싱 & 룰 매칭
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
2. **Tailwind 세팅** – `tailwind.config.js` 경로 포함, `src/index.css`에 지시자 추가
3. **상단 Tabs 컴포넌트 구현** – `Tabs.jsx + TabButton.jsx`

   * `activeTab` state 유지
   * 클릭 시 URL 변경 + 다른 탭 `tab-inactive` 클래스 적용
4. **각 routes/** 작성 – 9개 탭 화면. 공통 UI 컴포넌트 사용
5. **dictionary.js & ruleMatrix.js** – 계정표 + 매핑 테이블 작성
6. **parser.js** – 텍스트 → `{ debit, credit, amount }` 로 변환
7. **배포 스크립트 & GitHub Actions** 설정 (위 스니펫)
8. **UI 검수** – 활성 탭 외 나머지 탭 blur/gray 동작 확인

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

## 6. 추가 TODO (향후 개선)

* 분개 결과 → CSV 다운로드
* LocalStorage 거래 히스토리 저장
* 계정과목 다국어(영/한) 토글


