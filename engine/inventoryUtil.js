/* ─────────────────────────────────────────────
   재고 흐름 계산 유틸
   mode: 'fifo' | 'lifo' | 'moving' | 'weighted' | 'physical'
───────────────────────────────────────────── */

/* 1. 입력 문자열을 배열로 파싱 */
function parseLedger(raw) {
  // 예시: "1월1일 매입 100개 1000원 / 1월10일 판매 60개"
  const list = raw.split('/').map(s => s.trim());
  const out = [];
  for (const s of list) {
    if (/매입|구입/.test(s)) {
      const qty   = Number(/(\d+)\s*개/.exec(s)?.[1]);
      const price = Number(/(\d+)\s*원/.exec(s)?.[1]);
      if (qty && price) out.push({ type:'in',  qty, price });
    } else if (/판매|매도|출고/.test(s)) {
      const qty = Number(/(\d+)\s*개/.exec(s)?.[1]);
      if (qty) out.push({ type:'out', qty });
    }
  }
  return out;
}

/* 2. FIFO/LIFO 출고 처리 함수 */
function popLayers(stack, qty, lifo = false) {
  let remain = qty, value = 0;
  while (remain > 0 && stack.length) {
    const layer = lifo ? stack.pop() : stack[0];
    const take  = Math.min(layer.qty, remain);
    value      += take * layer.price;
    layer.qty  -= take;
    remain     -= take;
    if (layer.qty === 0 && !lifo) stack.shift();
  }
  return value;
}

/* 3. 메인 계산 함수 */
export function calcInventory(mode, raw) {
  const ledger = parseLedger(raw);
  const stack  = [];    // {qty, price}
  let cogs = 0;         // 매출원가

  for (const tx of ledger) {
    if (tx.type === 'in') {
      stack.push({ ...tx });
    } else { // out
      if (mode === 'fifo' || mode === 'physical') {
        cogs += popLayers(stack, tx.qty, false);
      } else if (mode === 'lifo') {
        cogs += popLayers(stack, tx.qty, true);
      } else {
        /* 평균법 */
        const totQty = stack.reduce((v,l)=>v+l.qty,0);
        const totVal = stack.reduce((v,l)=>v+l.qty*l.price,0);
        const avg    = totVal / totQty || 0;
        cogs += tx.qty * avg;
        popLayers(stack, tx.qty, false);
      }
    }
  }

  const ending = stack.reduce((v,l)=>v+l.qty*l.price,0);

  return mode === 'physical'
    ? { amount: ending }   // 실지재고조사법: 기말재고
    : { amount: cogs };    // 나머지: 매출원가
}
