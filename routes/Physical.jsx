import React, { useState } from 'react';
import ChatArea  from '../components/ChatArea.jsx';
import InputBox  from '../components/InputBox.jsx';
import { parseByType } from '../engine/index.js';

export default function Physical() {
  const [logs, setLogs] = useState([]);
  const submit = text =>
    setLogs([...logs, parseByType('physical', text)]);

  return (
    <section style={{ padding: '16px' }}>
      <h2>실지재고조사법 분개</h2>
      <ChatArea logs={logs} />
      <InputBox onSubmit={submit} />
    </section>
  );
}
