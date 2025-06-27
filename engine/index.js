/* 탭 종류별 파서 라우팅 ───────────────────── */
import chart         from './chart.json'     assert { type:'json' };
import parseBasic    from './parserBasic.js';
import parseAdjust   from './parserAdjust.js';
import parseInventory from './parserInventory.js';
import parseLoss     from './parserLoss.js';

/* 동의어 → 계정명 Map (빠른 검색) */
export const ACCOUNT_MAP = (() => {
  const map = new Map();
  chart.forEach(acc => acc.aliases.forEach(a => map.set(a, acc.name)));
  return map;
})();

/** @typedef {'basic'|'adjust'|'fifo'|'lifo'|'moving'|'weighted'|'physical'|'shrinkage'|'valuation'} TabKind */

/**
 * 탭 구분 + 입력문 → 분개 결과
 * @param {TabKind} kind
 * @param {string}  text
 */
export function parseByType(kind, text){
  switch(kind){
    case 'basic':     return parseBasic(text);
    case 'adjust':    return parseAdjust(text);
    case 'fifo':
    case 'lifo':
    case 'moving':
    case 'weighted':
    case 'physical':  return parseInventory(kind, text);
    case 'shrinkage':
    case 'valuation': return parseLoss(kind, text);
    default:          return { error:'지원되지 않는 탭' };
  }
}
