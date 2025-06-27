/* 차변/대변 결과 카드 ─────────────────── */
import React from 'react';
import styles from './ResultCard.module.css';

export default function ResultCard({ entry }) {
  if (!entry) return null;
  if (entry.error) return <div className={styles.card}>{entry.error}</div>;

  return (
    <div className={styles.card}>
      차변: <b>{entry.debit}</b> ｜ 대변: <b>{entry.credit}</b> ｜ 금액:
      <b>{entry.amount.toLocaleString()}</b>원
    </div>
  );
}
