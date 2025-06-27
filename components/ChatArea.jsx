/* 채팅 형태 결과 영역 ─────────────────── */
import React, { useEffect, useRef } from 'react';
import ResultCard from './ResultCard.jsx';
import styles from './ChatArea.module.css';

export default function ChatArea({ logs }) {
  const ref = useRef(null);

  /* 새 결과가 추가될 때마다 스크롤 맨 아래로 */
  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  return (
    <div ref={ref} className={styles.area}>
      {logs.map((e, i) => (
        <div key={i}>
          <div className={styles.time}>
            {new Date().toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <ResultCard entry={e} />
        </div>
      ))}
    </div>
  );
}
