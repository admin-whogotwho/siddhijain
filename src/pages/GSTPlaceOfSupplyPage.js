import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const states = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Other State/UT'];

const Field = ({label, children, hint}) => <div><label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>{children}{hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}</div>;
const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

export default function GSTPlaceOfSupplyPage() {
  const [supplier, setSupplier] = useState('Rajasthan');
  const [recipient, setRecipient] = useState('Maharashtra');
  const [kind, setKind] = useState('goods');
  const [recipientRegistered, setRecipientRegistered] = useState(true);
  const [category, setCategory] = useState('general');
  const [deliveryState, setDeliveryState] = useState('Maharashtra');
  const [immovableState, setImmovableState] = useState('Rajasthan');
  const [eventState, setEventState] = useState('Gujarat');
  const [recipientLocation, setRecipientLocation] = useState('Maharashtra');
  const [exportService, setExportService] = useState(false);

  const result = useMemo(() => {
    let pos = '';
    let rule = '';
    let note = '';
    if (exportService) {
      pos = recipientLocation;
      rule = 'Section 13, IGST Act — cross-border services';
      note = 'For services supplied to a recipient outside India, the general rule commonly looks to the recipient location, but specific categories under section 13 can override it.';
    } else if (kind === 'goods') {
      if (category === 'billToShipTo') {
        pos = deliveryState;
        rule = 'Section 10(1)(b), IGST Act — bill-to / ship-to';
        note = 'Where goods are supplied by transfer of documents/title or by direction of a third person, the place of supply follows the principal place involved under the statutory rule.';
      } else if (category === 'installation') {
        pos = deliveryState;
        rule = 'Section 10(1)(d), IGST Act — installation/assembly';
        note = 'Goods installed or assembled at a site generally take the place of supply as that site.';
      } else if (category === 'onBoard') {
        pos = supplier;
        rule = 'Section 10(1)(e), IGST Act — goods on board a conveyance';
        note = 'For goods supplied on board a conveyance, the statutory place-of-supply rule applies.';
      } else {
        pos = deliveryState;
        rule = 'Section 10(1)(a), IGST Act — movement of goods';
        note = 'For a normal movement-of-goods transaction, the place of supply is generally where the movement terminates for delivery.';
      }
    } else {
      if (category === 'immovable') {
        pos = immovableState;
        rule = 'Section 12(3), IGST Act — immovable property';
        note = 'Services directly in relation to immovable property, including certain accommodation and construction-related services, use the location of the property.';
      } else if (category === 'event') {
        pos = eventState;
        rule = 'Section 12(6), IGST Act — events';
        note = 'Admission to or organisation of specified events follows the statutory event-location rules.';
      } else if (category === 'transportGoods') {
        pos = recipientRegistered ? recipient : recipientLocation;
        rule = 'Section 12(8), IGST Act — transportation of goods';
        note = 'The precise result depends on the recipient status and the statutory rule applicable to the transportation service.';
      } else if (category === 'banking') {
        pos = recipientLocation;
        rule = 'Section 12(12), IGST Act — banking/financial services';
        note = 'For banking and financial services, the location of the recipient on the supplier’s records is relevant.';
      } else if (category === 'insurance') {
        pos = recipientRegistered ? recipient : recipientLocation;
        rule = 'Section 12(13), IGST Act — insurance';
        note = 'Insurance services have a specific statutory rule based on the recipient/location records.';
      } else if (category === 'intermediary') {
        pos = supplier;
        rule = exportService ? 'Section 13(8)(b), IGST Act — intermediary services' : 'Section 12(2), IGST Act — domestic general rule';
        note = 'Intermediary services have a specific place-of-supply rule. Do not apply the general export-service rule without checking the specific provision.';
      } else {
        pos = recipientRegistered ? recipient : recipientLocation;
        rule = exportService ? 'Section 13(2), IGST Act — general cross-border service rule' : 'Section 12(2), IGST Act — general domestic service rule';
        note = 'For the general service rule, the recipient location is ordinarily relevant, subject to the specific service categories in sections 12 and 13.';
      }
    }
    const interState = pos && supplier !== pos;
    return {pos, rule, note, interState};
  }, [supplier, recipient, kind, recipientRegistered, category, deliveryState, immovableState, eventState, recipientLocation, exportService]);

  const categories = kind === 'goods'
    ? [['general','Normal movement'],['billToShipTo','Bill-to / ship-to'],['installation','Installation / assembly'],['onBoard','Goods on board conveyance']]
    : [['general','General service'],['immovable','Immovable property'],['event','Event / admission'],['transportGoods','Transport of goods'],['banking','Banking / financial service'],['insurance','Insurance'],['intermediary','Intermediary service']];

  return <><Helmet><title>GST Place of Supply Calculator | Sections 10, 12 & 13 IGST Act</title><meta name="description" content="GST place of supply decision tool for goods, services, domestic and cross-border transactions under the IGST Act."/><link rel="canonical" href="https://www.cssiddhijain.com/calculators/gst-place-of-supply"/></Helmet>
  <main className="min-h-screen bg-slate-50 py-10 px-4"><div className="max-w-6xl mx-auto">
    <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">GST Technical Tool</p>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Place of Supply Calculator</h1>
    <p className="text-gray-600 mt-3 max-w-4xl">A guided place-of-supply decision tool for common goods and services transactions. It identifies the relevant IGST Act provision and whether the transaction is generally intra-State or inter-State.</p>
    <div className="grid lg:grid-cols-5 gap-6 mt-8">
      <section className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Supplier location"><select className={inputClass} value={supplier} onChange={e=>setSupplier(e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="Recipient location"><select className={inputClass} value={recipient} onChange={e=>setRecipient(e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="Supply"><select className={inputClass} value={kind} onChange={e=>{setKind(e.target.value);setCategory('general')}}><option value="goods">Goods</option><option value="services">Services</option></select></Field>
          <Field label="Recipient status"><div className="grid grid-cols-2 gap-2">{[[true,'Registered'],[false,'Unregistered']].map(([v,l])=><button key={l} type="button" onClick={()=>setRecipientRegistered(v)} className={`rounded-xl px-4 py-3 border text-sm font-semibold ${recipientRegistered===v?'bg-teal-600 text-white border-teal-600':'bg-white border-gray-200 text-gray-700'}`}>{l}</button>)}</div></Field>
          <Field label="Transaction category"><select className={inputClass} value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></Field>
          <Field label="Cross-border service?"><div className="grid grid-cols-2 gap-2">{[[false,'Domestic'],[true,'Cross-border']].map(([v,l])=><button key={l} type="button" onClick={()=>setExportService(v)} className={`rounded-xl px-4 py-3 border text-sm font-semibold ${exportService===v?'bg-slate-800 text-white border-slate-800':'bg-white border-gray-200 text-gray-700'}`}>{l}</button>)}</div></Field>
          {kind==='goods' && <Field label="Delivery / termination state"><select className={inputClass} value={deliveryState} onChange={e=>setDeliveryState(e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></Field>}
          {kind==='services' && category==='immovable' && <Field label="Property location"><select className={inputClass} value={immovableState} onChange={e=>setImmovableState(e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></Field>}
          {kind==='services' && category==='event' && <Field label="Event location"><select className={inputClass} value={eventState} onChange={e=>setEventState(e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></Field>}
          {kind==='services' && <Field label="Recipient location on records"><select className={inputClass} value={recipientLocation} onChange={e=>setRecipientLocation(e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></Field>}
        </div>
      </section>
      <section className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 md:p-8">
        <p className="text-sm text-slate-300">Indicative place of supply</p><div className="text-3xl font-bold mt-2">{result.pos || '—'}</div>
        <div className="mt-5 rounded-xl bg-slate-800 p-4"><div className="text-xs text-slate-400">Relevant provision</div><div className="font-semibold mt-1">{result.rule}</div></div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-700 pt-5"><span className="text-slate-300">Nature of supply</span><strong>{result.interState ? 'Generally inter-State' : 'Generally intra-State'}</strong></div>
        <p className="mt-5 text-sm text-slate-300 leading-relaxed">{result.note}</p>
      </section>
    </div>
    <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-600"><strong className="text-gray-800">Important:</strong> This tool covers common statutory patterns. Place of supply can change for specific services, intermediary transactions, transport, OIDAR, vessels/aircraft, fairs/exhibitions, goods supplied to unregistered recipients, and other special rules. Verify the exact facts before issuing an invoice.</div>
  </div></main></>;
}
