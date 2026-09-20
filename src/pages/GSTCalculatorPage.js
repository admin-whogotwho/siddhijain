import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value || 0);

const rates = [0, 3, 5, 12, 18, 28, 40];

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
  </div>
);

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('exclusive');
  const [supplyType, setSupplyType] = useState('intra');
  const [rate, setRate] = useState('18');
  const [customRate, setCustomRate] = useState('');
  const [discount, setDiscount] = useState('');

  const result = useMemo(() => {
    const entered = Math.max(0, Number(amount) || 0);
    const discountValue = Math.max(0, Number(discount) || 0);
    const selectedRate = rate === 'custom' ? Math.max(0, Number(customRate) || 0) : Number(rate);
    const netInput = Math.max(0, entered - discountValue);

    if (!entered || selectedRate < 0) {
      return { rate: selectedRate, taxable: 0, gst: 0, total: 0, cgst: 0, sgst: 0, igst: 0 };
    }

    if (mode === 'inclusive') {
      const taxable = netInput / (1 + selectedRate / 100);
      const gst = netInput - taxable;
      const cgst = supplyType === 'intra' ? gst / 2 : 0;
      const sgst = supplyType === 'intra' ? gst / 2 : 0;
      const igst = supplyType === 'inter' ? gst : 0;
      return { rate: selectedRate, taxable, gst, total: netInput, cgst, sgst, igst };
    }

    const taxable = netInput;
    const gst = taxable * selectedRate / 100;
    const cgst = supplyType === 'intra' ? gst / 2 : 0;
    const sgst = supplyType === 'intra' ? gst / 2 : 0;
    const igst = supplyType === 'inter' ? gst : 0;
    return { rate: selectedRate, taxable, gst, total: taxable + gst, cgst, sgst, igst };
  }, [amount, mode, supplyType, rate, customRate, discount]);

  const reset = () => {
    setAmount('');
    setDiscount('');
    setRate('18');
    setCustomRate('');
    setMode('exclusive');
    setSupplyType('intra');
  };

  return (
    <>
      <Helmet>
        <title>GST Calculator 2026 | Inclusive, Exclusive, CGST, SGST & IGST</title>
        <meta
          name="description"
          content="Free Indian GST calculator for GST-inclusive and GST-exclusive amounts. Calculate taxable value, GST, CGST, SGST and IGST."
        />
        <link rel="canonical" href="https://www.cssiddhijain.com/calculators/gst" />
      </Helmet>

      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">GST Calculator</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Calculate GST in seconds</h1>
            <p className="text-gray-600 mt-3 max-w-3xl">
              Add GST to a taxable value or extract GST from a GST-inclusive amount. Select intra-State for CGST + SGST or inter-State for IGST.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <section className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Calculation type">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['exclusive', 'Add GST'],
                      ['inclusive', 'GST included']
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setMode(value)}
                        className={`rounded-xl px-4 py-3 text-sm font-semibold border transition ${mode === value ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Supply type" hint="This determines the tax split.">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['intra', 'Intra-State'],
                      ['inter', 'Inter-State']
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSupplyType(value)}
                        className={`rounded-xl px-4 py-3 text-sm font-semibold border transition ${supplyType === value ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-700 border-gray-200 hover:border-slate-300'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field
                  label={mode === 'exclusive' ? 'Taxable amount (₹)' : 'GST-inclusive amount (₹)'}
                  hint={mode === 'exclusive' ? 'GST will be added to this amount.' : 'GST is already included in this amount.'}
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100000"
                    className={inputClass}
                  />
                </Field>

                <Field label="Discount before GST (₹)" hint="Optional. Discount is deducted before calculating GST.">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </Field>

                <Field label="GST rate" hint="Choose the rate applicable to your specific HSN/SAC and notification.">
                  <select value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass}>
                    {rates.map((item) => <option key={item} value={item}>{item}%</option>)}
                    <option value="custom">Custom rate</option>
                  </select>
                </Field>

                {rate === 'custom' ? (
                  <Field label="Custom GST rate (%)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder="e.g. 5"
                      className={inputClass}
                    />
                  </Field>
                ) : <div />}

                <div className="md:col-span-2 flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </section>

            <section className="lg:col-span-2 bg-slate-900 text-white rounded-2xl shadow-sm p-6 md:p-8">
              <p className="text-sm text-slate-300">Estimated GST</p>
              <div className="text-4xl font-bold mt-2">{formatINR(result.gst)}</div>
              <p className="text-slate-300 text-sm mt-2">At {result.rate}% on {formatINR(result.taxable)} taxable value</p>

              <div className="border-t border-slate-700 my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4"><span className="text-slate-300">Taxable value</span><strong>{formatINR(result.taxable)}</strong></div>
                {supplyType === 'intra' ? (
                  <>
                    <div className="flex justify-between gap-4"><span className="text-slate-300">CGST</span><strong>{formatINR(result.cgst)}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-slate-300">SGST / UTGST</span><strong>{formatINR(result.sgst)}</strong></div>
                  </>
                ) : (
                  <div className="flex justify-between gap-4"><span className="text-slate-300">IGST</span><strong>{formatINR(result.igst)}</strong></div>
                )}
                <div className="flex justify-between gap-4 text-base pt-2"><span className="text-slate-200">Final amount</span><strong>{formatINR(result.total)}</strong></div>
              </div>

              <div className="mt-7 rounded-xl bg-slate-800 p-4 text-xs text-slate-300 leading-relaxed">
                This is a calculation tool, not an HSN/SAC classification engine. GST rates depend on the applicable notification, classification, exemptions, place-of-supply rules and other conditions.
              </div>
            </section>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-600">
            <strong className="text-gray-800">Legal basis:</strong> GST is levied under the CGST/SGST framework for intra-State supplies and IGST for inter-State supplies. The applicable rate must be verified against the current rate notification for the particular supply. The GST Council/CBIC has made rate changes effective from 22 September 2025 for specified goods and services. 
          </div>
        </div>
      </main>
    </>
  );
}
