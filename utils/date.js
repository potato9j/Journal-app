/* ─────────────────────────────────────────────
   한글 날짜 문자열 → JS Date 변환
   "작년10월1일"  => Date(prevYear, 9, 1)
   "3월15일"      => Date(currYear, 2, 15)
   + 두 날짜 간 '개월 차이' 계산
───────────────────────────────────────────── */

/**
 * "작년10월1일", "12월31일" 같이 쓰인 한글 날짜를 Date 객체로 변환
 * @param {string} kor  한글 날짜 문자열
 * @returns {Date}
 */
export function parseKDate(kor) {
  const now = new Date();
  const year = /작년/.test(kor) ? now.getFullYear() - 1 : now.getFullYear();
  const month = /(\d+)월/.exec(kor)?.[1];
  const day = /(\d+)일/.exec(kor)?.[1];
  return new Date(year, Number(month) - 1, Number(day));
}

/**
 * 두 Date 객체 간 전체 개월 수 차이 반환
 * @param {Date} a
 * @param {Date} b
 * @returns {number}
 */
export function diffInMonths(a, b) {
  return (
    (b.getFullYear() - a.getFullYear()) * 12 +
    (b.getMonth() - a.getMonth())
  );
}
