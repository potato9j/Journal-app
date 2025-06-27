/* 수정 분개: 월할/일할 이자 + 감가상각 */
import { accrualAdjust } from './accrual.js';
import { straightLine, declining, unitsOfProd } from './depreciationUtil.js';
import { parseKNumber } from '../utils/number.js';

export default function parseAdjust(text){
  const s = text.replace(/\s+/g,'');

  /* 월할 이자 */
  if(/연이자율/.test(s) && /월할/.test(s)){
    const principal = parseKNumber(s);
    const rate = /연이자율(\d+(\.\d+)?)/.exec(s)?.[1];
    const start= /(작년\d+월\d+일)/.exec(s)?.[1];
    const end  = /(\d+월\d+일)/.exec(s)?.[1];
    if(principal&&rate&&start&&end)
      return accrualAdjust(principal, Number(rate), start, end);
  }

  /* 정액·정률·생산량법 감가상각 */
  if(/감가상각/.test(s)){
    const cost     = parseKNumber(/원가(\d[\d,]*)/.exec(s)?.[1]||'');
    const salvage  = parseKNumber(/잔존가치(\d[\d,]*)/.exec(s)?.[1]||'0');
    const life     = Number(/내용연수(\d+)/.exec(s)?.[1]);
    const passed   = Number(/경과(\d+)년/.exec(s)?.[1]||'1');
    let amort=0;

    if(/정액법/.test(s))
      amort = straightLine(cost,salvage,life,passed);
    else if(/정률법/.test(s))
      amort = declining(cost,salvage,life,passed);
    else if(/생산량법/.test(s)){
      const total = parseKNumber(/총생산량(\d[\d,]*)/.exec(s)?.[1]||'');
      const used  = parseKNumber(/사용량(\d[\d,]*)/.exec(s)?.[1]||'');
      amort = unitsOfProd(cost,salvage,total,used);
    }

    return { debit:'감가상각비', credit:'감가상각누계액', amount:Math.round(amort) };
  }

  return { error:'수정분개 규칙 미지원' };
}
