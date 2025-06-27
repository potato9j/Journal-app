/* ─────────────────────────────────────────────
   월할(또는 일할) 이자 발생액 계산 유틸

   ▸ 월할 : (원금 × 연이자율 ÷ 12) × 경과개월
   ▸ 일할 : 필요 시 diffInDays 함수로 일수 계산 후
            (원금 × 연이자율 ÷ 365) × 경과일수
───────────────────────────────────────────── */

import { parseKDate, diffInMonths /* diffInDays */ } from '../utils/date.js';

/**
 * 월할 이자 조정 분개 생성
 * @param {number} principal      원금
 * @param {number} rateAnnual     연이자율(%) 예: 14.4
 * @param {string} startKorDate   "작년10월1일" 등 한글 날짜
 * @param {string} endKorDate     "12월31일" 등 한글 날짜
 * @returns {{debit:string, credit:string, amount:number}}
 */
export function accrualAdjust(principal, rateAnnual, startKorDate, endKorDate) {
  const start  = parseKDate(startKorDate);  // utils/date.js
  const end    = parseKDate(endKorDate);

  /* 경과 개월 수 계산 */
  const months = diffInMonths(start, end);
  const monthlyRate = rateAnnual / 12 / 100;

  const interest = Math.round(principal * monthlyRate * months);

  return {
    debit:  '이자비용',
    credit: '미지급이자',
    amount: interest
  };
}

/* 필요하다면 일할 계산용 diffInDays, accrualAdjustDaily 등을
   이 파일에 확장해 넣으면 됩니다. */
