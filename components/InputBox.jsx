/* 거래 입력창 ───────────────────────────── */
import React, { useState } from 'react';
import styles from './InputBox.module.css';

export default function InputBox({ onSubmit }) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <div className={styles.box}>
      <textarea
        value={text}
        placeholder="거래를 입력하시오"
        onChange={e => setText(e.target.value)}
      />
      <button onClick={submit}>분개 생성</button>
    </div>
  );
}
