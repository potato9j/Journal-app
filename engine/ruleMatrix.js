/* 동사 × 지급방법 × 대상 = 차·대 자동 결정 */
import { ACCOUNT_MAP } from './index.js';

/* ① 동사 → 그룹 */
const V = { '매입':'buy','구입':'buy','매도':'sell','판매':'sell','지급':'pay','수취':'receive' };

/* ② 방법 → 기본 계정 */
const M = {
  '현금':   { buy:{cr:'현금'},      sell:{dr:'현금'},      pay:{cr:'현금'},      receive:{dr:'현금'} },
  '외상':   { buy:{cr:'외상매입금'}, sell:{dr:'외상매출금'} },
  '선급':   { pay:{dr:'선급비용'} },
  '미지급': { pay:{cr:'미지급비용'} }
};

/* ③ 대상 → 기본 차·대 */
const T = {
  buy     : acc => ({dr:acc}),
  sell    : acc => ({cr:acc}),
  pay     : acc => ({dr:acc}),
  receive : acc => ({cr:acc})
};

export function resolveRule(verbKor, targetAcc, methodKor){
  const g = V[verbKor];
  if(!g) return {};
  const m = M[methodKor]?.[g] || {};
  const t = T[g](targetAcc);
  return { debit: t.dr || m.dr, credit: m.cr || t.cr };
}
