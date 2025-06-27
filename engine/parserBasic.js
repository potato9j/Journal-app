/* 기초 분개: 메트릭스 자동 매핑 */
import { ACCOUNT_MAP } from './index.js';
import { resolveRule } from './ruleMatrix.js';
import { parseKNumber } from '../utils/number.js';

export default function parseBasic(text){
  const s = text.replace(/\s+/g,'');
  const amount = parseKNumber(s);

  const verb   = /(매입|구입|매도|판매|지급|수취)/.exec(s)?.[1];
  const method = /(현금|외상|선급|미지급)/.exec(s)?.[1];
  const alias  = [...ACCOUNT_MAP.keys()].find(k => s.includes(k));
  if(!(verb&&method&&alias)) return { error:'요소 식별 실패' };

  const { debit, credit } = resolveRule(verb, ACCOUNT_MAP.get(alias), method);
  return debit && credit ? { debit, credit, amount } : { error:'룰 결정 실패' };
}
