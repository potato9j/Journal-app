import React, { useState } from 'react';
import ChatArea  from '../components/ChatArea.jsx';
import InputBox  from '../components/InputBox.jsx';
import { parseByType } from '../engine/index.js';   // ← 중요!

export default function BasicEntry() {
  const [logs, setLogs] = useState([]);

  const submit = text =>
    setLogs([...logs, parseByType('basic', text)]);

  return (
    <section style={{ padding: '16px' }}>
      <h2>기초 분개</h2>
      <ChatArea logs={logs} />
      <InputBox onSubmit={submit} />
    </section>
  );
}
