import React, { useState } from 'react';
import ChatArea  from '../components/ChatArea.jsx';
import InputBox  from '../components/InputBox.jsx';
import { parseByType } from '../engine/index.js';

export default function Valuation() {
  const [logs, setLogs] = useState([]);
  const submit = text =>
    setLogs([...logs, parseByType('valuation', text)]);

  return (
    <section style={{ padding: '16px' }}>
      <h2>재고자산 평가손실 분개</h2>
      <ChatArea logs={logs} />
      <InputBox onSubmit={submit} />
    </section>
  );
}
