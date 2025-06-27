/* 감가상각 계산 util ───────────────────── */

/* 정액법: (원가-잔존)/내용연수 */
export function straightLine(cost, salvage, life, passed){
  return ((cost - salvage) / life) * passed;
}

/* 정률법: 장부가×정률, 정률 = 1 - (잔존/원가)^(1/내용연수) */
export function declining(cost, salvage, life, year){
  const rate = 1 - Math.pow(salvage / cost, 1 / life);
  return (cost * Math.pow(1 - rate, year - 1)) * rate;
}

/* 생산량법: (원가-잔존)/총생산량 × 사용량 */
export function unitsOfProd(cost, salvage, totalUnits, usedUnits){
  return ((cost - salvage) / totalUnits) * usedUnits;
}
