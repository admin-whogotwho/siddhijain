import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const money = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, value || 0));

const number = (value) => Math.max(0, Number(value) || 0);
const signedNumber = (value) => Number(value) || 0;

const Input = ({ label, value, onChange, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type="number"
      min="0"
      step="1000"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
    />
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
  </div>
);

function slabTax(income, slabs) {
  let tax = 0;
  let previous = 0;
  for (const slab of slabs) {
    const upper = slab.upper;
    const taxable = Math.max(0, Math.min(income, upper) - previous);
    tax += taxable * slab.rate;
    previous = upper;
    if (income <= upper) break;
  }
  return tax;
}

const newSlabs = [
  { upper: 400000, rate: 0 },
  { upper: 800000, rate: 0.05 },
  { upper: 1200000, rate: 0.10 },
  { upper: 1600000, rate: 0.15 },
  { upper: 2000000, rate: 0.20 },
  { upper: 2400000, rate: 0.25 },
  { upper: Infinity, rate: 0.30 }
];

function oldSlabs(age) {
  if (age >= 80) return [
    { upper: 500000, rate: 0 },
    { upper: 1000000, rate: 0.20 },
    { upper: Infinity, rate: 0.30 }
  ];
  if (age >= 60) return [
    { upper: 300000, rate: 0 },
    { upper: 500000, rate: 0.05 },
    { upper: 1000000, rate: 0.20 },
    { upper: Infinity, rate: 0.30 }
  ];
  return [
    { upper: 250000, rate: 0 },
    { upper: 500000, rate: 0.05 },
    { upper: 1000000, rate: 0.20 },
    { upper: Infinity, rate: 0.30 }
  ];
}

function surchargeRate(income, regime) {
  if (income > 50000000) return regime === 'old' ? 0.37 : 0.25;
  if (income > 20000000) return 0.25;
  if (income > 10000000) return 0.15;
  if (income > 5000000) return 0.10;
  return 0;
}

function calculate(income, regime, age, resident, oldDeductions) {
  const standardDeduction = regime === 'new' ? 75000 : 50000;
  const deductions = regime === 'new' ? 0 : number(oldDeductions);
  const taxableIncome = Math.max(0, income - standardDeduction - deductions);
  const baseTax = slabTax(taxableIncome, regime === 'new' ? newSlabs : oldSlabs(age));

  let rebate = 0;
  if (resident) {
    if (regime === 'new' && taxableIncome <= 1200000) rebate = Math.min(baseTax, 60000);
    if (regime === 'old' && taxableIncome <= 500000) rebate = Math.min(baseTax, 12500);
  }

  let taxAfterRebate = Math.max(0, baseTax - rebate);
  const surcharge = surchargeRate(taxableIncome, regime);

  // New-regime marginal relief around ₹12 lakh.
  if (regime === 'new' && taxableIncome > 1200000) {
    const excessIncome = taxableIncome - 1200000;
    const taxAt12L = slabTax(1200000, newSlabs);
    const marginalReliefLimit = taxAt12L / 0.85;
    if (excessIncome < marginalReliefLimit) {
      taxAfterRebate = Math.min(taxAfterRebate, taxAt12L + excessIncome);
    }
  }

  let taxWithSurcharge = taxAfterRebate * (1 + surcharge);

  // Surcharge marginal relief at ₹50L / ₹1Cr / ₹2Cr / ₹5Cr thresholds.
  const thresholds = regime === 'new'
    ? [5000000, 10000000, 20000000]
    : [5000000, 10000000, 20000000, 50000000];

  for (const threshold of thresholds) {
    if (taxableIncome > threshold) {
      const baseAtThreshold = slabTax(threshold, regime === 'new' ? newSlabs : oldSlabs(age));
      const surchargeAtThreshold = baseAtThreshold * surchargeRate(threshold, regime);
      const cap = baseAtThreshold + surchargeAtThreshold + (taxableIncome - threshold);
      taxWithSurcharge = Math.min(taxWithSurcharge, cap);
    }
  }

  const cess = taxWithSurcharge * 0.04;
  const totalTax = taxWithSurcharge + cess;

  return {
    taxableIncome,
    standardDeduction,
    deductions,
    baseTax,
    rebate,
    surchargeAmount: taxWithSurcharge - taxAfterRebate,
    cess,
    totalTax
  };
}

export default function IncomeTaxCalculatorPage() {
  const [salary, setSalary] = useState('');
  const [houseProperty, setHouseProperty] = useState('');
  const [business, setBusiness] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [oldDeductions, setOldDeductions] = useState('');
  const [age, setAge] = useState('35');
  const [resident, setResident] = useState(true);

  const grossIncome = useMemo(
    () => number(salary) + signedNumber(houseProperty) + signedNumber(business) + number(otherIncome),
    [salary, houseProperty, business, otherIncome]
  );

  const newResult = useMemo(
    () => calculate(grossIncome, 'new', number(age), resident, 0),
    [grossIncome, age, resident]
  );

  const oldResult = useMemo(
    () => calculate(grossIncome, 'old', number(age), resident, oldDeductions),
    [grossIncome, age, resident, oldDeductions]
  );

  return (
    <>
      <Helmet>
        <title>Income Tax Calculator 2026-27 | New & Old Regime</title>
        <meta
          name="description"
          content="Free income tax calculator for Tax Year 2026-27 under the Income-tax Act, 2025, with comparison against the old tax regime for AY 2026-27."
        />
        <link rel="canonical" href="https://www.cssiddhijain.com/calculators/income-tax" />
      </Helmet>

      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Income Tax Calculator</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Income Tax Calculator for 2026–27</h1>
            <p className="text-gray-600 mt-3 max-w-4xl">
              Estimate tax for an individual using the current new tax regime for Tax Year 2026–27 and compare it with the old regime applicable to AY 2026–27.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <section className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">1. Enter your income</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Salary / pension income (₹)" value={salary} onChange={setSalary} hint="Enter gross salary/pension before standard deduction." />
                <SignedInput label="Income / loss from house property (₹)" value={houseProperty} onChange={setHouseProperty} hint="Enter the computed income or allowable loss for this estimate." />
                <SignedInput label="Business / profession income (₹)" value={business} onChange={setBusiness} hint="You may enter a business/profession loss as a negative amount." />
                <Input label="Other normal-rate income (₹)" value={otherIncome} onChange={setOtherIncome} hint="For example, interest. Do not use this for special-rate capital gains or lottery income." />
              </div>

              <div className="border-t border-gray-100 my-7" />

              <h2 className="text-xl font-bold text-gray-900 mb-5">2. Taxpayer details</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Age during the tax year" value={age} onChange={setAge} hint="Age affects old-regime slabs, not new-regime slabs." />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Residential status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setResident(true)}
                      className={`rounded-xl px-4 py-3 border text-sm font-semibold ${resident ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-gray-200 text-gray-700'}`}
                    >
                      Resident
                    </button>
                    <button
                      type="button"
                      onClick={() => setResident(false)}
                      className={`rounded-xl px-4 py-3 border text-sm font-semibold ${!resident ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-gray-200 text-gray-700'}`}
                    >
                      Non-resident
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Input
                  label="Eligible deductions under old regime (₹)"
                  value={oldDeductions}
                  onChange={setOldDeductions}
                  hint="Optional: enter eligible deductions/exemptions that you want to model under the old regime. New-regime deductions are not included in this basic calculator."
                />
              </div>

              <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-4 text-sm text-teal-900">
                <strong>Gross income entered:</strong> {money(grossIncome)}
              </div>
            </section>

            <section className="lg:col-span-2 space-y-4">
              <TaxCard title="New Tax Regime" subtitle="Income-tax Act, 2025 • Tax Year 2026–27" result={newResult} featured />
              <TaxCard title="Old Tax Regime" subtitle="Income-tax Act, 1961 • AY 2026–27" result={oldResult} />
            </section>
          </div>

          <section className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900">How this estimate is calculated</h2>
            <div className="grid md:grid-cols-4 gap-4 mt-5 text-sm">
              <Step n="1" text="Enter income under the relevant heads." />
              <Step n="2" text="Standard deduction is applied where relevant." />
              <Step n="3" text="Applicable slab rates, rebate and surcharge are applied." />
              <Step n="4" text="4% Health & Education Cess is added." />
            </div>
          </section>

          <section className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-800">Scope & disclaimer:</strong> This is a basic estimation tool for individuals. It does not calculate special-rate capital gains, lottery/gaming income, AMT/MAT, dividend-specific rules, DTAA relief, loss carry-forward/set-off, marginal relief for every special-rate situation, TDS/TCS credits, advance tax, interest, or every deduction/exemption. For an actual return, use the Income Tax Department's calculator/utility and verify the facts and applicable provisions.
          </section>
        </div>
      </main>
    </>
  );
}

function SignedInput({ label, value, onChange, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        step="1000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function TaxCard({ title, subtitle, result, featured }) {
  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${featured ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-900 border-gray-200'}`}>
      <div className={`text-sm ${featured ? 'text-slate-300' : 'text-gray-500'}`}>{subtitle}</div>
      <h2 className="text-xl font-bold mt-1">{title}</h2>
      <div className="mt-5">
        <div className={`text-sm ${featured ? 'text-slate-300' : 'text-gray-500'}`}>Estimated total tax</div>
        <div className="text-3xl font-bold mt-1">{money(result.totalTax)}</div>
      </div>
      <div className={`border-t my-5 ${featured ? 'border-slate-700' : 'border-gray-100'}`} />
      <div className="space-y-3 text-sm">
        <Row label="Taxable income" value={money(result.taxableIncome)} muted={featured} />
        <Row label="Standard deduction" value={money(result.standardDeduction)} muted={featured} />
        {result.deductions > 0 && <Row label="Other deductions" value={money(result.deductions)} muted={featured} />}
        <Row label="Income tax before rebate" value={money(result.baseTax)} muted={featured} />
        <Row label={title.startsWith("Old") ? "Rebate u/s 87A" : "Rebate" } value={money(result.rebate)} muted={featured} />
        <Row label="Surcharge" value={money(result.surchargeAmount)} muted={featured} />
        <Row label="Health & Education Cess" value={money(result.cess)} muted={featured} />
      </div>
    </div>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex justify-between gap-4">
      <span className={muted ? 'text-slate-300' : 'text-gray-500'}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Step({ n, text }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-gray-100 p-4">
      <div className="text-teal-700 font-bold mb-1">Step {n}</div>
      <div className="text-gray-600">{text}</div>
    </div>
  );
}
