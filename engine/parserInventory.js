import { calcInventory } from './inventoryUtil.js';

export default function parserInventory(mode, text){
  const res = calcInventory(mode, text);
  if(res.error) return res;

  return mode==='physical'
    ? { debit:'기말재고', credit:'매출원가', amount:res.amount }
    : { debit:'매출원가', credit:'기말재고', amount:res.amount };
}
