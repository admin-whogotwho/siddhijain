import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const money = v => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(v||0);
const n = v => Math.max(0, Number(v)||0);
const payments = [
 {id:'contractor',name:'Contractor / work / labour',old:'194C',neo:'393(1) Table 6(i)',rate:2,threshold:30000,note:'1% for individual/HUF contractor; 2% for other contractors. Single-payment and annual aggregate thresholds apply.'},
 {id:'194M',name:'Individual/HUF: work / professional / commission',old:'194M',neo:'393(1) Table 6(ii)',rate:2,threshold:5000000,note:'For an individual/HUF payer covered by this provision; aggregate threshold ₹50 lakh.'},
 {id:'professional',name:'Professional / technical fees / royalty / director fees',old:'194J',neo:'393(1) Table 6(iii)',rate:10,threshold:50000,note:'2% applies to specified technical fees/certain royalty; 10% to other covered professional/director/royalty payments.'},
 {id:'commission',name:'Commission / brokerage',old:'194H',neo:'393(1) Table 1(ii)',rate:2,threshold:20000,note:'Common resident commission/brokerage provision.'},
 {id:'insurance',name:'Insurance commission',old:'194D',neo:'393(1) Table 1(i)',rate:10,threshold:20000,note:'Rate is subject to the rate-in-force rules.'},
 {id:'interest',name:'Interest other than securities',old:'194A',neo:'393(1) Table 5',rate:10,threshold:10000,note:'Threshold varies by payer/payee category, including banking-company and senior-citizen cases.'},
 {id:'rentIB',name:'Rent by individual/HUF not covered by 194-I',old:'194IB',neo:'393(1) Table 2(i)',rate:2,threshold:50000,note:'Rent threshold is ₹50,000 for a month or part of a month.'},
 {id:'rentPlant',name:'Rent — machinery / plant / equipment',old:'194-I',neo:'393(1) Table 2(ii)',rate:2,threshold:50000,note:'2% for machinery, plant or equipment under the new table.'},
 {id:'rentProperty',name:'Rent — land / building / furniture / fittings',old:'194-I',neo:'393(1) Table 2(ii)',rate:10,threshold:50000,note:'10% for land, building, furniture or fittings under the new table.'},
 {id:'property',name:'Purchase of immovable property',old:'194-IA',neo:'393(1) Table 3(i)',rate:1,threshold:5000000,note:'1% of consideration or stamp-duty value, whichever is higher, subject to the statutory threshold and aggregation rules.'},
 {id:'life',name:'Life-insurance policy payout',old:'194DA',neo:'393(1) Table 8(i)',rate:2,threshold:100000,note:'2% of the income component, subject to the statutory conditions.'},
 {id:'unit',name:'Specified mutual-fund units',old:'194K',neo:'393(1) Table 4(i)',rate:10,threshold:10000,note:'10% with the specified threshold.'},
 {id:'dividend',name:'Dividend',old:'194',neo:'393(1) Table 7',rate:10,threshold:0,note:'10% for the covered resident dividend payment.'},
 {id:'goods',name:'Purchase of goods',old:'194Q',neo:'393(1) Table 8(ii)',rate:0.1,threshold:5000000,note:'0.1% on the amount exceeding ₹50 lakh, subject to the statutory conditions.'},
 {id:'benefit',name:'Business/profession benefit or perquisite',old:'194R',neo:'393(1) Table 8(iv)',rate:10,threshold:20000,note:'10% on the value/aggregate value of covered benefits or perquisites exceeding the threshold.'},
 {id:'ecom',name:'E-commerce participant payment',old:'194O',neo:'393(1) Table 8(v)',rate:0.1,threshold:500000,note:'0.1%; special threshold applies for resident individual/HUF participants.'},
 {id:'vda',name:'Virtual digital asset transfer',old:'194S',neo:'393(1) Table 8(vi)',rate:1,threshold:10000,note:'1%; threshold differs for specified persons and other persons.'},
 {id:'partner',name:'Partner salary / remuneration / commission / bonus / interest',old:'194T',neo:'393(3) Table 7',rate:10,threshold:20000,note:'10%; effective from 1 April 2025 under the old Act and carried into the new framework.'},
 {id:'lottery',name:'Lottery / crossword / games winnings',old:'194B',neo:'393(3) Table 1',rate:30,threshold:10000,note:'Rate in force; ₹10,000 single-transaction threshold.'},
 {id:'horse',name:'Horse-race winnings',old:'194BB',neo:'393(3) Table 3',rate:30,threshold:10000,note:'Rate in force; ₹10,000 single-transaction threshold.'},
 {id:'lotteryComm',name:'Lottery-ticket commission',old:'194G',neo:'393(3) Table 4',rate:2,threshold:20000,note:'2% subject to the threshold.'},
 {id:'cash',name:'Cash withdrawal',old:'194N',neo:'393(3) Table 5',rate:2,threshold:10000000,note:'2% subject to the detailed cash-withdrawal conditions and special thresholds.'}
];

export default function TDSCalculatorPage(){
 const [id,setId]=useState('contractor');
 const [amount,setAmount]=useState('');
 const [date,setDate]=useState('2026-09-20');
 const [payee,setPayee]=useState('individual');
 const [pan,setPan]=useState(true);
 const [technical,setTechnical]=useState(false);
 const p=payments.find(x=>x.id===id)||payments[0];
 const result=useMemo(()=>{
   const amountValue=n(amount);
   let base=amountValue;
   let rate=p.rate;
   if(id==='contractor') rate=payee==='individual'||payee==='huf'?1:2;
   if(id==='professional') rate=technical?2:10;
   if(id==='goods') base=Math.max(0,amountValue-5000000);
   else if(id==='property') base=amountValue>5000000?amountValue:0;
   else if(id==='contractor') base=amountValue>30000?amountValue:0;
   else if(['commission','insurance','life','unit','benefit','partner','lotteryComm','rentIB','rentPlant','rentProperty','ecom','vda'].includes(id) && p.threshold && amountValue<=p.threshold) base=0;
   else if(['lottery','horse'].includes(id)) base=amountValue>10000?amountValue:0;
   else if(id==='cash') base=amountValue>10000000?amountValue:0;
   let warning='';
   if(!pan){ rate=Math.max(rate,20); warning='PAN not furnished: higher-rate provisions may apply. Verify the exact applicable provision before deduction.'; }
   return {tds:base*rate/100,base,rate,newAct:date>='2026-04-01',warning};
 },[amount,date,id,p,payee,pan,technical]);
 return <><Helmet><title>TDS Calculator 2026 | Old Section / New Section Income-tax Act</title><meta name="description" content="TDS calculator covering common payments with old Income-tax Act sections and corresponding Income-tax Act 2025 section 393 table references, thresholds and rates."/><link rel="canonical" href="https://www.cssiddhijain.com/calculators/tds"/></Helmet>
 <main className="min-h-screen bg-slate-50 py-10 px-4"><div className="max-w-7xl mx-auto">
 <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Income-tax Technical Tool</p>
 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">TDS Calculator — Old Section / New Section</h1>
 <p className="text-gray-600 mt-3 max-w-5xl">Select the expenditure, enter the amount and choose the payment date. The tool shows the corresponding old section / new section reference and an indicative TDS amount. From 1 April 2026, many non-salary TDS provisions are consolidated in section 393 of the Income-tax Act, 2025; salary TDS is under section 392. Payments or credits up to 31 March 2026 continue under the Income-tax Act, 1961.</p>
 <div className="grid lg:grid-cols-5 gap-6 mt-8">
 <section className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
 <div className="grid md:grid-cols-2 gap-5">
 <Field label="Nature of expenditure / payment"><select className={inputClass} value={id} onChange={e=>setId(e.target.value)}>{payments.map(x=><option key={x.id} value={x.id}>{x.name} — {x.old} / {x.neo}</option>)}</select></Field>
 <Field label="Amount / payment value (₹)"><input className={inputClass} type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. 100000"/></Field>
 <Field label="Credit / payment date" hint="Use the earlier applicable credit/payment event where required."><input className={inputClass} type="date" value={date} onChange={e=>setDate(e.target.value)}/></Field>
 <Field label="Payee type"><select className={inputClass} value={payee} onChange={e=>setPayee(e.target.value)}><option value="individual">Individual</option><option value="huf">HUF</option><option value="entity">Company / firm / other entity</option></select></Field>
 <Field label="PAN furnished?"><div className="grid grid-cols-2 gap-2">{[[true,'Yes'],[false,'No']].map(([v,l])=><button type="button" key={l} onClick={()=>setPan(v)} className={`rounded-xl px-4 py-3 border text-sm font-semibold ${pan===v?'bg-teal-600 text-white border-teal-600':'bg-white border-gray-200 text-gray-700'}`}>{l}</button>)}</div></Field>
 {id==='professional'&&<Field label="Professional / technical classification"><div className="grid grid-cols-2 gap-2">{[[true,'Technical / certain royalty — 2%'],[false,'Other covered payments — 10%']].map(([v,l])=><button type="button" key={l} onClick={()=>setTechnical(v)} className={`rounded-xl px-3 py-3 border text-xs font-semibold ${technical===v?'bg-slate-800 text-white border-slate-800':'bg-white border-gray-200 text-gray-700'}`}>{l}</button>)}</div></Field>}
 </div>
 <div className="mt-7 rounded-2xl bg-slate-50 border border-gray-100 p-5"><div className="grid md:grid-cols-2 gap-5"><div><div className="text-xs uppercase tracking-wide text-gray-500">Old Act section</div><div className="text-xl font-bold text-gray-900 mt-1">{p.old}</div></div><div><div className="text-xs uppercase tracking-wide text-gray-500">New Act section</div><div className="text-xl font-bold text-gray-900 mt-1">{p.neo}</div></div></div><p className="text-sm text-gray-600 mt-4">{p.note}</p></div>
 </section>
 <section className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 md:p-8"><p className="text-sm text-slate-300">Estimated TDS</p><div className="text-4xl font-bold mt-2">{money(result.tds)}</div><p className="text-slate-300 text-sm mt-2">At {result.rate}% on {money(result.base)}</p><div className="border-t border-slate-700 my-6"/><div className="space-y-3 text-sm"><Row label="Old section" value={p.old}/><Row label="New section" value={p.neo}/><Row label="Applicable Act" value={result.newAct?'Income-tax Act, 2025':'Income-tax Act, 1961'}/><Row label="Threshold" value={p.threshold ? money(p.threshold) : 'No general threshold'}/></div>{result.warning&&<div className="mt-6 rounded-xl bg-amber-900/40 p-4 text-xs text-amber-100">{result.warning}</div>}</section>
 </div>
 <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5"><h2 className="text-lg font-bold text-gray-900">Common TDS provisions covered</h2><div className="grid md:grid-cols-3 gap-3 mt-4 text-sm">{payments.map(x=><div key={x.id} className="rounded-xl border border-gray-100 bg-slate-50 p-3"><div className="font-bold text-teal-700">{x.name}</div><div className="text-gray-500 mt-1">{x.old} / {x.neo}</div><div className="text-gray-600 mt-1">{x.rate}% base rate</div></div>)}</div></div>
 <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed"><strong className="text-gray-800">Scope:</strong> This is a practical estimator for common TDS payments. Salary TDS requires an annual projected-income computation under section 192 / 392; non-resident payments require section 195 / section 393(2), DTAA and rate-in-force analysis; PAN, lower/nil certificates, specified-person status, aggregation, exceptions and special rates can change the result. The Income Tax Department confirms that payments/credits on or after 1 April 2026 use the corresponding Income-tax Act, 2025 provisions.</div>
 </div></main></>;
}
function Field({label,children,hint}){return <div><label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>{children}{hint&&<p className="text-xs text-gray-500 mt-1">{hint}</p>}</div>}
function Row({label,value}){return <div className="flex justify-between gap-4"><span className="text-slate-300">{label}</span><strong>{value}</strong></div>}
const inputClass='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
