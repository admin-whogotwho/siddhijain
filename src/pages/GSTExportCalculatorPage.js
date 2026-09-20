import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const money=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(v||0);
const num=v=>Math.max(0,Number(v)||0);
const cls='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const Field=({label,children,hint})=><div><label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>{children}{hint&&<p className="text-xs text-gray-500 mt-1">{hint}</p>}</div>;

export default function GSTExportCalculatorPage(){
 const [value,setValue]=useState('');
 const [itc,setItc]=useState('');
 const [method,setMethod]=useState('lut');
 const [eligibleTurnover,setEligibleTurnover]=useState('');
 const [adjustedTurnover,setAdjustedTurnover]=useState('');
 const [taxRate,setTaxRate]=useState('18');
 const result=useMemo(()=>{
   const v=num(value), credit=num(itc), rate=num(taxRate), et=num(eligibleTurnover)||v, at=num(adjustedTurnover)||v;
   const igst=v*rate/100;
   const estimatedRefund=Math.min(credit, et ? credit*at/et : 0);
   return {igst,estimatedRefund};
 },[value,itc,method,eligibleTurnover,adjustedTurnover,taxRate]);
 return <><Helmet><title>GST Export Calculator | Zero Rated Supply, LUT & IGST Refund</title><meta name="description" content="GST export calculator for zero-rated supplies, LUT without payment of IGST, IGST payment route and indicative refund calculations."/><link rel="canonical" href="https://www.cssiddhijain.com/calculators/gst-export"/></Helmet>
 <main className="min-h-screen bg-slate-50 py-10 px-4"><div className="max-w-6xl mx-auto">
 <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">GST Technical Tool</p><h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">GST Export & Refund Calculator</h1>
 <p className="text-gray-600 mt-3 max-w-4xl">Exports and supplies to SEZ are zero-rated supplies under section 16 of the IGST Act. The exporter can generally use the LUT/bond route and seek refund of eligible accumulated ITC, or the payment-of-IGST route where permitted.</p>
 <div className="grid lg:grid-cols-5 gap-6 mt-8">
 <section className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 md:p-8"><div className="grid md:grid-cols-2 gap-5">
 <Field label="Export / zero-rated turnover (₹)"><input className={cls} type="number" min="0" value={value} onChange={e=>setValue(e.target.value)} placeholder="e.g. 5000000"/></Field>
 <Field label="Eligible accumulated ITC (₹)" hint="Enter only ITC eligible for refund, not blocked/ineligible credit."><input className={cls} type="number" min="0" value={itc} onChange={e=>setItc(e.target.value)} placeholder="e.g. 600000"/></Field>
 <Field label="Export route"><div className="grid grid-cols-2 gap-2">{[['lut','LUT / without IGST'],['igst','Pay IGST']].map(([v,l])=><button type="button" key={v} onClick={()=>setMethod(v)} className={`rounded-xl px-4 py-3 border text-sm font-semibold ${method===v?'bg-teal-600 text-white border-teal-600':'bg-white border-gray-200 text-gray-700'}`}>{l}</button>)}</div></Field>
 <Field label="Indicative IGST rate (%)" hint="Used only for the payment-of-IGST illustration."><input className={cls} type="number" min="0" step="0.01" value={taxRate} onChange={e=>setTaxRate(e.target.value)}/></Field>
 <Field label="Adjusted total turnover (₹)" hint="Optional input for an indicative Rule 89(4) style ratio."><input className={cls} type="number" min="0" value={adjustedTurnover} onChange={e=>setAdjustedTurnover(e.target.value)} placeholder="Use export value if left blank"/></Field>
 <Field label="Eligible zero-rated turnover (₹)" hint="Optional denominator input for an indicative refund ratio."><input className={cls} type="number" min="0" value={eligibleTurnover} onChange={e=>setEligibleTurnover(e.target.value)} placeholder="Use export value if left blank"/></Field>
 </div></section>
 <section className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 md:p-8"><p className="text-sm text-slate-300">{method==='lut'?'Indicative ITC refund':'Indicative IGST on export'}</p><div className="text-4xl font-bold mt-2">{money(method==='lut'?result.estimatedRefund:result.igst)}</div>
 <div className="border-t border-slate-700 my-6"/><div className="space-y-3 text-sm"><Row label="Export value" value={money(num(value))}/><Row label="Eligible ITC entered" value={money(num(itc))}/><Row label="Selected route" value={method==='lut'?'LUT':'Payment of IGST'}/></div>
 <div className="mt-6 rounded-xl bg-slate-800 p-4 text-xs text-slate-300 leading-relaxed">{method==='lut'?'The actual refund is governed by the statutory formula, eligibility, documentary conditions and Rule 89 requirements.':'The actual IGST payment/refund depends on eligibility, invoice/shipping-bill data and the applicable law and notifications.'}</div></section>
 </div>
 <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-600"><strong className="text-gray-800">Important:</strong> This is an indicative export/refund tool. It does not determine export of services conditions, realisation in convertible foreign exchange, intermediary issues, SEZ documentation, shipping-bill matching, Rule 96 restrictions, or the full Rule 89 refund formula.</div>
 </div></main></>;
}
function Row({label,value}){return <div className="flex justify-between gap-4"><span className="text-slate-300">{label}</span><strong>{value}</strong></div>}
