/* 루트 컨테이너: Tabs + Routes + 팝업 */
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tabs from './components/Tabs/Tabs.jsx';
import styles from './components/Popup.module.css';
import {
  BasicEntry, AdjustingEntry, FIFO, LIFO,
  MovingAvg, WeightedAvg, Physical,
  Shrinkage, Valuation
} from './routes/index.js';   // barrel export (아래 참고)

/* 팝업 내용 정의 */
const POP = {
  about: (
    <>
      <h3>제작 정보</h3>
      <ul>
        <li>React + Vite + CSS Modules</li>
        <li>RuleMatrix·Algorithm 기반 분개 엔진 (JS)</li>
      </ul>
    </>
  ),
  help: (
    <>
      <h3>사용법</h3>
      <p>공용 입력창에 거래를 입력하세요.<br/>
         새로운 거래를 입력하면 이전 결과는 저장되지 않습니다.</p>
    </>
  ),
  support: (
    <>
      <h3>지원 연락처</h3>
      <p>potato9j@naver.com / 이정욱</p>
    </>
  )
};

export default function App() {
  const [pop,setPop] = useState(null);
  const close = () => setPop(null);

  return (
    <>
      <Tabs onPopup={setPop}/>
      <Routes>
        <Route path="/"           element={<Navigate to="/basic" />} />
        <Route path="/basic"      element={<BasicEntry />} />
        <Route path="/adjust"     element={<AdjustingEntry />} />
        <Route path="/fifo"       element={<FIFO />} />
        <Route path="/lifo"       element={<LIFO />} />
        <Route path="/moving"     element={<MovingAvg />} />
        <Route path="/weighted"   element={<WeightedAvg />} />
        <Route path="/physical"   element={<Physical />} />
        <Route path="/shrinkage"  element={<Shrinkage />} />
        <Route path="/valuation"  element={<Valuation />} />
      </Routes>

      {pop && (
        <div className={styles.back} onClick={close}>
          <div className={styles.box} onClick={e=>e.stopPropagation()}>
            {POP[pop]}
            <button onClick={close}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
}
