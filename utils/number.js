/* ─────────────────────────────────────────────
   한글 금액 문자열 → Number 변환 유틸
   예) "5만원" → 50000,  "2,300,000원" → 2300000
───────────────────────────────────────────── */
export function parseKNumber(str) {
  // 1) 숫자 추출 (쉼표 제거)
  const raw = /(\d[\d,]*)/.exec(str)?.[1]?.replace(/,/g, '');
  if (!raw) return 0;

  // 2) 단위 체크 (만원)
  return /만원/.test(str) ? Number(raw) * 10000 : Number(raw);
}
