import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const money = v => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(v||0);
const num = v => Math.max(0, Number(v)||0);
const Field = ({label,children,hint}) => <div><label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>{children}{hint&&<p className="text-xs text-gray-500 mt-1">{hint}</p>}</div>;
const cls = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

export default function GSTImportCalculatorPage(){
 const [assessable,setAssessable]=useState('');
 const [bcd,setBcd]=useState('10');
 const [sws,setSws]=useState('10');
 const [igst,setIgst]=useState('18');
 const [cess,setCess]=useState('');
 const [otherDuty,setOtherDuty]=useState('');
 const result=useMemo(()=>{
   const av=num(assessable), b=num(bcd), s=num(sws), i=num(igst), c=num(cess), o=num(otherDuty);
   const bcdAmt=av*b/100;
   const swsAmt=bcdAmt*s/100;
   const dutyBase=av+bcdAmt+swsAmt+o;
   const igstAmt=dutyBase*i/100;
   const cessAmt=dutyBase*c/100;
   return {bcdAmt,swsAmt,dutyBase,igstAmt,cessAmt,total:bcdAmt+swsAmt+o+igstAmt+cessAmt};
 },[assessable,bcd,sws,igst,cess,otherDuty]);
 return <><Helmet><title>GST Import Calculator | Customs Value, BCD, SWS & IGST</title><meta name="description" content="Calculate indicative IGST and customs tax on imports into India using assessable value, BCD, Social Welfare Surcharge and IGST."/><link rel="canonical" href="https://www.cssiddhijain.com/calculators/gst-import"/></Helmet>
 <main className="min-h-screen bg-slate-50 py-10 px-4"><div className="max-w-6xl mx-auto">
 <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">GST Technical Tool</p><h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">GST Import Calculator</h1>
 <p className="text-gray-600 mt-3 max-w-4xl">Estimate import IGST and the principal customs components from the assessable value. All imports are treated as inter-State supplies for GST purposes and IGST is levied in addition to customs duties.</p>
 <div className="grid lg:grid-cols-5 gap-6 mt-8">
 <section className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 md:p-8"><div className="grid md:grid-cols-2 gap-5">
 <Field label="Assessable value (₹)" hint="Use the customs assessable value, not merely the commercial invoice value."><input className={cls} type="number" min="0" value={assessable} onChange={e=>setAssessable(e.target.value)} placeholder="e.g. 1000000"/></Field>
 <Field label="Basic Customs Duty / BCD (%)"><input className={cls} type="number" min="0" step="0.01" value={bcd} onChange={e=>setBcd(e.target.value)}/></Field>
 <Field label="Social Welfare Surcharge on BCD (%)"><input className={cls} type="number" min="0" step="0.01" value={sws} onChange={e=>setSws(e.target.value)}/></Field>
 <Field label="IGST rate (%)"><input className={cls} type="number" min="0" step="0.01" value={igst} onChange={e=>setIgst(e.target.value)}/></Field>
 <Field label="Compensation / other cess (%)" hint="Enter only where applicable."><input className={cls} type="number" min="0" step="0.01" value={cess} onChange={e=>setCess(e.target.value)} placeholder="0"/></Field>
 <Field label="Other duty included in IGST base (₹)" hint="Optional; use only where applicable under customs law."><input className={cls} type="number" min="0" value={otherDuty} onChange={e=>setOtherDuty(e.target.value)} placeholder="0"/></Field>
 </div></section>
 <section className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 md:p-8"><p className="text-sm text-slate-300">Estimated import taxes</p><div className="text-4xl font-bold mt-2">{money(result.total)}</div>
 <div className="border-t border-slate-700 my-6"/><div className="space-y-3 text-sm">
 <Row label="BCD" value={money(result.bcdAmt)}/><Row label="SWS" value={money(result.swsAmt)}/><Row label="IGST base" value={money(result.dutyBase)}/><Row label="IGST" value={money(result.igstAmt)}/><Row label="Cess" value={money(result.cessAmt)}/>
 </div><div className="mt-6 rounded-xl bg-slate-800 p-4 text-xs text-slate-300 leading-relaxed">IGST paid on imports can generally form part of eligible ITC, subject to the normal ITC conditions and restrictions.</div>
 </section></div>
 <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-600"><strong className="text-gray-800">Important:</strong> This is an estimator, not a customs duty assessment engine. BCD, SWS, exemptions, preferential rates, valuation, anti-dumping/safeguard duties, compensation cess and the correct IGST rate depend on the tariff classification, notification and facts.</div>
 </div></main></>;
}
function Row({label,value}){return <div className="flex justify-between gap-4"><span className="text-slate-300">{label}</span><strong>{value}</strong></div>}
