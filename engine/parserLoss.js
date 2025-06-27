export default function parserLoss(kind, text){
  const cost = Number(text.match(/원가(\d[\d,]*)/ )?.[1]?.replace(/,/g,'')||0);
  const nrv  = Number(text.match(/NRV(\d[\d,]*)/ )?.[1]?.replace(/,/g,'')||0);
  if(!cost||!nrv) return { error:'원가·NRV가 필요' };

  const lossAmt = cost-nrv;
  if(lossAmt<=0) return { error:'평가손실 없음' };

  return kind==='shrinkage'
    ? { debit:'재고자산감모손실', credit:'재고자산', amount:lossAmt }
    : { debit:'재고자산평가손실', credit:'재고자산평가충당금', amount:lossAmt };
}
