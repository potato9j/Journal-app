import React, { useState } from 'react';
import ChatArea  from '../components/ChatArea.jsx';
import InputBox  from '../components/InputBox.jsx';
import { parseByType } from '../engine/index.js';

export default function Shrinkage() {
  const [logs, setLogs] = useState([]);
  const submit = text =>
    setLogs([...logs, parseByType('shrinkage', text)]);

  return (
    <section style={{ padding: '16px' }}>
      <h2>재고자산 감모손실 분개</h2>
      <ChatArea logs={logs} />
      <InputBox onSubmit={submit} />
    </section>
  );
}
