// App.js
// Website for Company Secretary Siddhi Jain & Associates
// This application features a professional layout with Home, About, Services, Calculators, and Contact sections.
// It includes three specialized calculators: TDS Calculator, GST Applicability Calculator, and Input Tax Credit Availment Calculator.
// The "Search Case Laws" features in TDS and ITC calculators are simulated for demonstration purposes,
// as real-world implementation requires robust backend integration with legal databases and advanced NLP/LLM capabilities.

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import the configured Supabase client

// --- Calculator Components ---

// 1. TDS Calculator
const TDSCalculator = () => {
  const [paymentNature, setPaymentNature] = useState('');
  const [amount, setAmount] = useState('');
  const [panAvailable, setPanAvailable] = useState('yes');
  // 'resident' is a default; specific payment natures will change this to 'individual', 'huf', 'senior_citizen', 'non-resident'
  const [residentStatus, setResidentStatus] = useState('resident');
  const [tdsResult, setTdsResult] = useState(null);
  const [caseLawQuery, setCaseLawQuery] = useState('');
  const [caseLawResult, setCaseLawResult] = useState('');

  const calculateTDS = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setTdsResult({ applicable: false, message: 'Please enter a valid positive amount.' });
      return;
    }

    let applicableSection = '';
    let rate = 0; // Default numeric rate
    let threshold = 0; // Default threshold
    let isApplicable = false;
    let tdsAmount = null; // Will be a number if calculable, otherwise null
    let remarks = '';
    let rateDisplay = ''; // String to display rate (e.g., "10%", "As per tax slab")

    // Implementing TDS Logic based on Income Tax Act 1961 for common scenarios
    // NOTE: This is a highly simplified representation. Actual tax laws are complex
    // and include many nuances, specific thresholds, and exceptions.
    // PAN non-availability (Sec 206AA): Higher of (specified rate, 20%) applies if PAN not provided.

    switch (paymentNature) {
      case 'Salary':
        applicableSection = '192';
        threshold = 0; // Always applicable on taxable income
        rateDisplay = panAvailable === 'yes' ? 'As per individual tax slab' : '20% (Max Marginal Rate)';
        isApplicable = true; // Assumed taxable income is present
        // TDS for salary is complex and depends on tax slabs, deductions etc.
        // Only provide a concrete amount if PAN is not available (20% flat rate or MMR)
        tdsAmount = panAvailable === 'no' ? val * 0.20 : null;
        remarks = 'TDS on salary depends on tax slab after considering all exemptions and deductions. Actual calculation requires detailed income and deduction information.';
        break;
      case 'Premature EPF Withdrawal':
        applicableSection = '192A';
        threshold = 50000;
        rate = 10;
        isApplicable = (val > threshold);
        break;
      case 'Interest on Securities':
        applicableSection = '193';
        threshold = 10000;
        rate = 10;
        isApplicable = (val > threshold);
        break;
      case 'Dividend':
        applicableSection = '194';
        threshold = 5000;
        rate = 10;
        isApplicable = (val > threshold);
        break;
      case 'Interest (Other than Securities)':
        applicableSection = '194A';
        if (residentStatus === 'senior_citizen') {
          threshold = 50000; // For banks, co-op, post offices for senior citizens
        } else if (residentStatus === 'individual' || residentStatus === 'huf' || residentStatus === 'other') {
          threshold = 40000; // For banks, co-op, post offices for others
        }
        rate = 10;
        isApplicable = (val > threshold);
        remarks = `Threshold is ₹${threshold.toLocaleString()} for this category. Threshold varies for senior citizens and type of payer (bank vs other).`;
        break;
      case 'Winnings from Lottery/Games':
        applicableSection = '194B/194BA/194BB';
        threshold = 10000;
        rate = 30;
        isApplicable = (val > threshold);
        remarks = 'Applicable for lotteries, crossword puzzles, online games, horse races.';
        break;
      case 'Contract Payments':
        applicableSection = '194C';
        threshold = 30000; // Single transaction; Aggregate 1,00,000 (complex for simple calculator)
        rate = (residentStatus === 'individual' || residentStatus === 'huf') ? 1 : 2; // 1% for Ind/HUF, 2% for others
        isApplicable = (val > threshold);
        remarks = 'Individual/HUF rate is 1%, others 2%. Note: Higher threshold for aggregate payments (₹1,00,000) not covered by this single transaction calculator.';
        break;
      case 'Insurance Commission':
        applicableSection = '194D';
        threshold = 15000;
        rate = 5;
        isApplicable = (val > threshold);
        remarks = 'Rate is 5% for resident. If company, rate might be 10%.'; // Simplified to 5% for demo
        break;
      case 'Commission/Brokerage':
        applicableSection = '194H';
        threshold = 15000;
        rate = 5;
        isApplicable = (val > threshold);
        break;
      case 'Rent (Land/Building/Furniture)':
        applicableSection = '194I';
        threshold = 240000; // Annual threshold
        rate = 10;
        isApplicable = (val > threshold);
        remarks = 'This threshold is annual. If payer is Individual/HUF not under tax audit, Sec 194IB applies (5% if rent > ₹50,000/month on monthly payments).';
        break;
      case 'Rent (Plant/Machinery/Equipment)':
        applicableSection = '194I';
        threshold = 240000; // Annual threshold
        rate = 2;
        isApplicable = (val > threshold);
        remarks = 'This threshold is annual. If payer is Individual/HUF not under tax audit, Sec 194IB applies (5% if rent > ₹50,000/month on monthly payments).';
        break;
      case 'Professional Fees':
        applicableSection = '194J';
        threshold = 30000;
        rate = 10; // For professional services, royalty (other than films), non-compete fees
        isApplicable = (val > threshold);
        remarks = 'Rate is 2% for fees for technical services, call center, film royalty.';
        break;
      case 'Fees for Technical Services':
        applicableSection = '194J';
        threshold = 30000;
        rate = 2;
        isApplicable = (val > threshold);
        remarks = 'Rate is 2% for fees for technical services, call center, film royalty.';
        break;
      case 'Purchase of Immovable Property':
        applicableSection = '194IA';
        threshold = 5000000; // 50 Lakhs
        rate = 1;
        isApplicable = (val >= threshold); // >= threshold
        remarks = 'Applicable on transfer of immovable property (other than agricultural land).';
        break;
      case 'Rent by Ind/HUF (Not Tax Audit)':
        applicableSection = '194IB';
        threshold = 50000; // Per month threshold
        rate = 5;
        isApplicable = (val > threshold);
        remarks = 'Applicable for Individuals/HUF not liable for tax audit, paying rent > ₹50,000 per month. Please enter *monthly* rent amount.';
        break;
      case 'Purchase of Goods':
        applicableSection = '194Q';
        threshold = 5000000; // 50 Lakhs
        rate = 0.1;
        isApplicable = (val > threshold);
        remarks = 'Applicable if turnover of buyer exceeds ₹10 Cr in preceding FY. Excludes cases where TDS is under 194O.';
        break;
      case 'Benefits/Perquisites (Business/Profession)':
        applicableSection = '194R';
        threshold = 20000;
        rate = 10;
        isApplicable = (val > threshold);
        remarks = 'Deduction on benefit/perquisite arising from business or profession.';
        break;
      case 'Virtual Digital Asset Transfer':
        applicableSection = '194S';
        threshold = 10000; // 50000 for specified persons
        rate = 1;
        isApplicable = (val > threshold);
        remarks = 'Threshold varies for specified persons (buyers).';
        break;
      case 'Payments to Non-Residents':
        applicableSection = '195';
        threshold = 0;
        rateDisplay = 'As per Act / DTAA';
        isApplicable = true;
        tdsAmount = null;
        remarks = 'Applicability and rate depend on nature of income (e.g., interest, royalty, FTS) and Double Taxation Avoidance Agreement (DTAA). Specific details are required for calculation.';
        break;
      default:
        applicableSection = 'N/A';
        rate = 0;
        threshold = 0;
        isApplicable = false;
        remarks = 'Select a specific payment nature for detailed calculation.';
    }

    if (panAvailable === 'no' && typeof rate === 'number' && isApplicable) {
      const originalRate = rate;
      rate = Math.max(originalRate, 20);
      tdsAmount = val * (rate / 100);
      rateDisplay = `${originalRate}% (increased to ${rate}% due to Sec 206AA)`;
      remarks = (remarks ? remarks + '. ' : '') + `PAN not available: TDS @ ${rate}% (or 20% if higher as per Sec 206AA).`;
    } else if (isApplicable && typeof rate === 'number') {
      tdsAmount = val * (rate / 100);
      rateDisplay = `${rate}%`;
    }

    setTdsResult({
      applicable: isApplicable,
      section: applicableSection,
      rate: rateDisplay || 'N/A',
      amount: typeof tdsAmount === 'number' ? tdsAmount.toFixed(2) : tdsAmount,
      message: `TDS is ${isApplicable ? 'applicable' : 'not applicable'} for this payment.`,
      remarks: remarks || 'Standard rules apply.'
    });
  };

  const searchCaseLaws = async () => {
    if (!caseLawQuery.trim()) {
      setCaseLawResult('Please describe your confusion about the nature of payment to search for case laws.');
      return;
    }
    setCaseLawResult('Searching for relevant case laws... (This feature requires a robust backend integration with legal databases like Manupatra, SCC Online, or IndiaKanoon, combined with advanced AI/NLP capabilities for real-time, accurate results. The following is a simulated response based on common scenarios.)');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const queryLower = caseLawQuery.toLowerCase();
    let simulatedResponse = `No direct case law found for "${caseLawQuery}".\n\n`;

    if (queryLower.includes('software license') || queryLower.includes('software payment')) {
      simulatedResponse = `**Simulated Case Law Reference for Software Payments (TDS Applicability):**\n` +
        `* **Issue:** Whether payment for software is 'royalty' (Sec. 194J) or 'purchase of copyrighted article' (no TDS on purchase), or 'technical services'.\n` +
        `* **Key Principle:** The distinction often lies in whether the payer acquires a copyright or merely a copyrighted article (license to use). Indian courts have given various pronouncements, often distinguishing between 'right to use' and 'transfer of copyright'. If it involves a transfer of part of copyright, it could be royalty. If it's a mere sale of software for use, it generally may not attract TDS under royalty, but if it involves installation, customization, or technical support, it might be professional/technical fees.\n` +
        `* **Relevant Sections:** Section 194J (Fees for Professional/Technical Services), Section 9(1)(vi) (Royalty income for non-residents).\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **CIT vs. Samsung Electronics Co. Ltd. (Supreme Court):** Often cited for principles on royalty. While this case did not directly deal with software, its principles on 'use of patent/secret process' are applied.\n` +
        `    * **Various ITAT / High Court Rulings:** Many rulings exist distinguishing between canned software, customized software, and software maintenance, impacting TDS applicability.\n`;
    } else if (queryLower.includes('reimbursement of expenses') || queryLower.includes('expenditure reimbursement')) {
      simulatedResponse = `**Simulated Case Law Reference for Reimbursement of Expenses (TDS Applicability):**\n` +
        `* **Issue:** Whether pure reimbursements, where the payer is merely passing on actual expenses incurred by the payee, are subject to TDS.\n` +
        `* **Key Principle:** Generally, genuine reimbursements which are incurred by the payee on behalf of the payer and are not part of the 'income' of the payee, may not attract TDS. The essence is whether there's an element of income or profit for the payee. If the payer is merely reimbursing actual out-of-pocket expenses without any value addition by the payee, TDS may not be required. However, if the reimbursement is disguised remuneration or includes a profit element, it would be subject to TDS.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **CIT vs. Hero Honda Motors Ltd. (Delhi High Court):** Often cited in this context, emphasizing that if the payer is only reimbursing the actual expenses without any profit element for the payee, no TDS is required.\n` +
        `    * **Circular No. 715 of 1995:** Clarifies that no TDS is required on reimbursement of actual expenses, but this circular's applicability has been debated in various contexts.\n`;
    } else if (queryLower.includes('non-resident services') || queryLower.includes('payment to nri')) {
      simulatedResponse = `**Simulated Case Law Reference for Payments to Non-Residents (TDS):**\n` +
        `* **Issue:** Applicability of TDS on various payments (e.g., professional fees, technical services, interest, royalty) to non-residents, considering DTAAs (Double Taxation Avoidance Agreements).\n` +
        `* **Key Principle:** For payments to non-residents, TDS applicability depends on whether the income accrues or arises in India, and importantly, the provisions of the applicable DTAA between India and the non-resident's country of residence. If the DTAA provides a lower rate or exemption, the DTAA provisions generally prevail over the Income Tax Act, 1961.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **GE India Technology Centre Pvt. Ltd. vs. CIT (Supreme Court):** Landmark judgment emphasizing the primacy of DTAA over the Income Tax Act in certain situations.\n` +
        `    * **Many ITAT / High Court rulings:** Deal with specific types of services (e.g., cloud computing, marketing services, software services) provided by non-residents and their taxability in India under DTAA provisions.\n`;
    } else if (queryLower.includes('rent of building vs machinery') || queryLower.includes('194i rent')) {
      simulatedResponse = `**Simulated Case Law Reference for Rent under Section 194I (Building vs. Machinery):**\n` +
        `* **Issue:** Distinction between rent of plant and machinery (2% TDS) and rent of land/building/furniture/fittings (10% TDS) under Section 194I.\n` +
        `* **Key Principle:** The determination depends on the primary nature of the asset being rented. If a composite contract involves both, a proper apportionment is critical. If the machinery is affixed to the building and integral to its functioning as a factory, it might be considered part of the building rent. However, if machinery is distinct and separable, its rent would attract 2% TDS.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **CBDT Circulars:** Various clarifications have been issued by CBDT. For example, Circular No. 715 of 1995 provided some initial clarity.\n` +
        `    * **High Court and ITAT Rulings:** Numerous judgments exist on whether a composite contract for factory building and machinery should be bifurcated for TDS purposes under 194I.\n`;
    }
    else {
      simulatedResponse += `**General Guidance:** For specific and complex scenarios, analyzing the exact nature of the transaction, terms of the agreement, and latest judicial pronouncements is essential. The Income Tax Act, 1961, along with various CBDT Circulars, Notifications, and judicial precedents from High Courts and Tribunals, governs TDS applicability. This tool provides a simplified overview.`;
    }

    setCaseLawResult(simulatedResponse +
      `\n\n**Disclaimer:** These are *simulated* examples for illustrative purposes only. They do not constitute legal advice. For actual legal interpretations, current tax rates, specific case law applicability, and precise guidance under the Income Tax Act, 1961, please consult a qualified tax professional or legal expert. Real-time access to and interpretation of legal databases requires specialized commercial tools and human expertise.`
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-8 font-inter">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">TDS Calculator (Income Tax Act, 1961)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="paymentNature" className="block text-gray-700 text-sm font-bold mb-2">
            Nature of Payment:
          </label>
          <select
            id="paymentNature"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={paymentNature}
            onChange={(e) => {
              setPaymentNature(e.target.value);
              if (!['Contract Payments', 'Interest (Other than Securities)', 'Payments to Non-Residents'].includes(e.target.value)) {
                setResidentStatus('resident');
              }
            }}
          >
            <option value="">-- Select --</option>
            <option value="Salary">Salary - Sec 192</option>
            <option value="Premature EPF Withdrawal">Premature EPF Withdrawal - Sec 192A</option>
            <option value="Interest on Securities">Interest on Securities - Sec 193</option>
            <option value="Dividend">Dividend - Sec 194</option>
            <option value="Interest (Other than Securities)">Interest (Other than Securities) - Sec 194A</option>
            <option value="Winnings from Lottery/Games">Winnings from Lottery/Games - Sec 194B/BA/BB</option>
            <option value="Contract Payments">Contract Payments - Sec 194C</option>
            <option value="Insurance Commission">Insurance Commission - Sec 194D</option>
            <option value="Commission/Brokerage">Commission/Brokerage - Sec 194H</option>
            <option value="Rent (Land/Building/Furniture)">Rent (Land/Building/Furniture) - Sec 194I</option>
            <option value="Rent (Plant/Machinery/Equipment)">Rent (Plant/Machinery/Equipment) - Sec 194I</option>
            <option value="Professional Fees">Professional Fees - Sec 194J</option>
            <option value="Fees for Technical Services">Fees for Technical Services - Sec 194J</option>
            <option value="Purchase of Immovable Property">Purchase of Immovable Property - Sec 194IA</option>
            <option value="Rent by Ind/HUF (Not Tax Audit)">Rent by Ind/HUF (Not Tax Audit) - Sec 194IB</option>
            <option value="Purchase of Goods">Purchase of Goods - Sec 194Q</option>
            <option value="Benefits/Perquisites (Business/Profession)">Benefits/Perquisites (Business/Profession) - Sec 194R</option>
            <option value="Virtual Digital Asset Transfer">Virtual Digital Asset Transfer - Sec 194S</option>
            <option value="Payments to Non-Residents">Payments to Non-Residents - Sec 195</option>
            <option value="Others">Others (General)</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
            Amount (₹):
            {(paymentNature === 'Rent by Ind/HUF (Not Tax Audit)') && <span className="text-sm text-gray-500 ml-2">(Enter Monthly Rent)</span>}
            {(paymentNature === 'Rent (Land/Building/Furniture)' || paymentNature === 'Rent (Plant/Machinery/Equipment)') && <span className="text-sm text-gray-500 ml-2">(Enter Annual Rent)</span>}
          </label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 50000"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            PAN Available?
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio text-indigo-600 rounded-full"
                name="panAvailable"
                value="yes"
                checked={panAvailable === 'yes'}
                onChange={(e) => setPanAvailable(e.target.value)}
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 rounded-full"
                name="panAvailable"
                value="no"
                checked={panAvailable === 'no'}
                onChange={(e) => setPanAvailable(e.target.value)}
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>
        {(paymentNature === 'Contract Payments' || paymentNature === 'Interest (Other than Securities)' || paymentNature === 'Payments to Non-Residents') && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payer/Payee Type / Status:
            </label>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 rounded-full"
                  name="residentStatus"
                  value="individual"
                  checked={residentStatus === 'individual'}
                  onChange={(e) => setResidentStatus(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Individual/HUF</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 rounded-full"
                  name="residentStatus"
                  value="other"
                  checked={residentStatus === 'other'}
                  onChange={(e) => setResidentStatus(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Company/Firm/Other</span>
              </label>
              {paymentNature === 'Interest (Other than Securities)' && (
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 rounded-full"
                    name="residentStatus"
                    value="senior_citizen"
                    checked={residentStatus === 'senior_citizen'}
                    onChange={(e) => setResidentStatus(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Senior Citizen (for Interest)</span>
                </label>
              )}
              {paymentNature === 'Payments to Non-Residents' && (
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 rounded-full"
                    name="residentStatus"
                    value="non-resident"
                    checked={residentStatus === 'non-resident'}
                    onChange={(e) => setResidentStatus(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Non-Resident</span>
                </label>
              )}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={calculateTDS}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md"
      >
        Calculate TDS
      </button>

      {tdsResult && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-800">TDS Calculation Result:</h4>
          <p className="text-gray-800 mt-2">
            **Status:** <span className={`font-bold ${tdsResult.applicable ? 'text-green-700' : 'text-red-700'}`}>
              {tdsResult.applicable ? 'Applicable' : 'Not Applicable'}
            </span>
          </p>
          {tdsResult.applicable && (
            <>
              <p className="text-gray-800">
                **Section:** <span className="font-bold">{tdsResult.section}</span>
              </p>
              <p className="text-gray-800">
                **Rate:** <span className="font-bold">{tdsResult.rate}</span>
              </p>
              {typeof tdsResult.amount === 'number' && (
                <p className="text-gray-800">
                  **Estimated TDS Amount:** <span className="font-bold text-green-700">₹{tdsResult.amount}</span>
                </p>
              )}
              {typeof tdsResult.amount !== 'number' && tdsResult.amount && (
                 <p className="text-gray-800">
                   **TDS Amount:** <span className="font-bold text-blue-700">{tdsResult.amount}</span>
                 </p>
              )}
            </>
          )}
          <p className="text-sm text-gray-600 mt-1">**Message:** {tdsResult.message}</p>
          {tdsResult.remarks && (
            <p className="text-sm text-gray-700 mt-2">**Remarks:** {tdsResult.remarks}</p>
          )}
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Confused about Nature of Payments & TDS Applicability?</h4>
        <p className="text-gray-700 mb-4">
          Describe your specific scenario or confusion to find relevant decided case laws for guidance:
        </p>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 mb-4 rounded-md"
          rows="4"
          placeholder="e.g., Is payment for software license considered royalty or professional fees? What about services provided by a foreign entity without PE in India? Is reimbursement of actual expenses subject to TDS?"
          value={caseLawQuery}
          onChange={(e) => setCaseLawQuery(e.target.value)}
        ></textarea>
        <button
          onClick={searchCaseLaws}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md"
        >
          Search Case Laws
        </button>
        {caseLawResult && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-gray-800 whitespace-pre-wrap">
            {caseLawResult}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        *Disclaimer: The TDS calculations provided are indicative and based on simplified assumptions for common scenarios under the Income Tax Act, 1961. This calculator does not cover all sections, intricacies, exceptions, or latest amendments to the Income Tax Act. The "Search Case Laws" feature is simulated and provides illustrative examples; it is not a real-time legal research tool. Actual TDS implications are highly complex and depend on specific facts, latest amendments, notifications, and judicial precedents. Always consult a qualified tax professional for precise TDS advice and legal interpretations.
      </p>
    </div>
  );
};

// 2. GST Applicability Calculator
const GSTApplicabilityCalculator = () => {
  const [supplyType, setSupplyType] = useState('');
  const [supplierState, setSupplierState] = useState('');
  const [recipientState, setRecipientState] = useState('');
  const [recipientRegistration, setRecipientRegistration] = useState('');
  const [transactionLocation, setTransactionLocation] = useState('');
  const [serviceNature, setServiceNature] = useState('');
  const [isSupplierForeign, setIsSupplierForeign] = useState('no');
  const [isRecipientNTOR, setIsRecipientNTOR] = useState('no');
  const [supplyValue, setSupplyValue] = useState('');
  const [gstApplicabilityResult, setGstApplicabilityResult] = useState(null);

  const indianStates = [
    { name: '-- Select State --', value: '' },
    { name: 'Andhra Pradesh', value: 'AP' }, { name: 'Arunachal Pradesh', value: 'AR' },
    { name: 'Assam', value: 'AS' }, { name: 'Bihar', value: 'BR' },
    { name: 'Chhattisgarh', value: 'CG' }, { name: 'Goa', value: 'GA' },
    { name: 'Gujarat', value: 'GJ' }, { name: 'Haryana', value: 'HR' },
    { name: 'Himachal Pradesh', value: 'HP' }, { name: 'Jharkhand', value: 'JH' },
    { name: 'Karnataka', value: 'KA' }, { name: 'Kerala', value: 'KL' },
    { name: 'Madhya Pradesh', value: 'MP' }, { name: 'Maharashtra', value: 'MH' },
    { name: 'Manipur', value: 'MN' }, { name: 'Meghalaya', value: 'ML' },
    { name: 'Mizoram', value: 'MZ' }, { name: 'Nagaland', value: 'NL' },
    { name: 'Odisha', value: 'OR' }, { name: 'Punjab', value: 'PB' },
    { name: 'Rajasthan', value: 'RJ' }, { name: 'Sikkim', value: 'SK' },
    { name: 'Tamil Nadu', value: 'TN' }, { name: 'Telangana', value: 'TS' },
    { name: 'Tripura', value: 'TR' }, { name: 'Uttar Pradesh', value: 'UP' },
    { name: 'Uttarakhand', value: 'UK' }, { name: 'West Bengal', value: 'WB' },
    { name: 'Andaman and Nicobar Islands', value: 'AN' }, { name: 'Chandigarh', value: 'CH' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', value: 'DD' }, { name: 'Lakshadweep', value: 'LD' },
    { name: 'Delhi', value: 'DL' }, { name: 'Puducherry', value: 'PY' },
    { name: 'Ladakh', value: 'LA' }, { name: 'Jammu and Kashmir', value: 'JK' },
  ];

  const calculateGSTApplicability = () => {
    const value = parseFloat(supplyValue);
    if (isNaN(value) || value <= 0) {
      setGstApplicabilityResult({ applicable: false, message: 'Please enter a valid positive supply value.' });
      return;
    }

    if (!supplyType || !recipientRegistration || !transactionLocation) {
        setGstApplicabilityResult({ applicable: false, message: 'Please select all required fields.' });
        return;
    }

    let applicabilityMessage = '';
    let chargeMechanism = 'Forward Charge (FCM)';
    let gstType = '';
    let placeOfSupply = '';
    let specialRemarks = '';
    let isApplicable = true;

    if (transactionLocation === 'Domestic') {
        if (!supplierState || !recipientState) {
            setGstApplicabilityResult({ applicable: false, message: 'Please select both Supplier and Recipient States for Domestic transaction.' });
            return;
        }
        if (supplierState === recipientState) {
            placeOfSupply = `Location of Recipient (Intra-state: ${recipientState})`;
            gstType = 'CGST + SGST';
            applicabilityMessage = 'GST is applicable.';
        } else {
            placeOfSupply = `Location of Recipient (Inter-state: ${recipientState})`;
            gstType = 'IGST';
            applicabilityMessage = 'GST is applicable.';
        }

        if (supplyType === 'services') {
            if (serviceNature === 'immovable_property_related' && recipientState) {
                placeOfSupply = `Location of Immovable Property (State: ${recipientState})`;
            } else if (serviceNature === 'OIDAR_services') {
                 placeOfSupply = `Location of Recipient (Online)`;
            } else if (recipientRegistration === 'unregistered' && !recipientState) {
                 placeOfSupply = `Location of Supplier (as recipient address not available)`;
            }
        }
    } else if (transactionLocation === 'Export') {
      placeOfSupply = 'Outside India';
      gstType = 'IGST (Zero-Rated)';
      applicabilityMessage = 'GST is applicable as Zero-Rated Supply. ITC can be claimed. Can be made with or without LUT/Bond.';
      specialRemarks = 'No GST charged on invoice, but ITC is available. Recipient is outside India.';
    } else if (transactionLocation === 'Import') {
      placeOfSupply = 'Location of Importer (India)';
      gstType = 'IGST (on import)';
      applicabilityMessage = 'GST is applicable on import of goods/services.';
      specialRemarks = 'For goods, IGST is paid at customs. For services, Reverse Charge Mechanism generally applies to the recipient in India.';
    }

    const isRegisteredRecipient = recipientRegistration === 'registered';

    if (transactionLocation === 'Import' && supplyType === 'services') {
      chargeMechanism = 'Reverse Charge (RCM)';
      specialRemarks = (specialRemarks ? specialRemarks + '. ' : '') + 'Recipient is liable to pay GST under RCM.';
    }
    else if (serviceNature === 'OIDAR_services' && isSupplierForeign === 'yes') {
        if (isRecipientNTOR === 'yes') {
            chargeMechanism = 'Forward Charge (FCM) by Foreign Supplier';
            applicabilityMessage = 'GST (IGST) is applicable. Foreign OIDAR service provider is liable to collect and remit GST if service is to a Non-Taxable Online Recipient (NTOR) in India.';
            specialRemarks = (specialRemarks ? specialRemarks + '. ' : '') + 'Foreign OIDAR service provider must register and pay GST in India (Forward Charge) if recipient is Non-Taxable Online Recipient (NTOR).';
        } else if (isRegisteredRecipient) {
            chargeMechanism = 'Reverse Charge (RCM)';
            specialRemarks = (specialRemarks ? specialRemarks + '. ' : '') + 'Recipient (registered person) is liable to pay GST under RCM for OIDAR services received from foreign supplier.';
        } else {
            chargeMechanism = 'Not applicable directly (complex)';
            isApplicable = false;
            applicabilityMessage = 'Complex scenario for OIDAR from foreign supplier to unregistered non-NTOR. Consult professional.';
        }
    }
    else if (isRegisteredRecipient && transactionLocation === 'Domestic' && supplyType === 'services') {
      switch (serviceNature) {
        case 'legal_services':
        case 'gta_services':
        case 'security_services':
        case 'director_services':
        case 'sponsorship_services':
        case 'insurance_agent_services':
        case 'recovery_agent_services':
        case 'rental_motor_vehicle':
          chargeMechanism = 'Reverse Charge (RCM)';
          specialRemarks = (specialRemarks ? specialRemarks + '. ' : '') + `Recipient (registered person) is liable to pay GST under RCM for ${serviceNature.replace(/_/g, ' ')}.`;
          break;
        default:
          chargeMechanism = 'Forward Charge (FCM)';
          specialRemarks = (specialRemarks ? specialRemarks + '. ' : '') + 'Supplier is liable to pay GST under Forward Charge.';
          break;
      }
    } else {
        chargeMechanism = 'Forward Charge (FCM)';
        specialRemarks = (specialRemarks ? specialRemarks + '. ' : '') + 'Supplier is liable to pay GST under Forward Charge.';
    }

    setGstApplicabilityResult({
      applicable: isApplicable,
      message: applicabilityMessage,
      charge: chargeMechanism,
      gstType: gstType,
      placeOfSupply: placeOfSupply,
      specialRemarks: specialRemarks,
    });
  };

  const serviceNatureOptions = [
    { label: "None / Not Applicable", value: "" },
    { label: "Online Information and Database Access or Retrieval (OIDAR) Services", value: "OIDAR_services" },
    { label: "Services related to Immovable Property", value: "immovable_property_related" },
    { label: "Legal Services by Advocate/Firm", value: "legal_services" },
    { label: "Goods Transport Agency (GTA) Services", value: "gta_services" },
    { label: "Security Services (except Govt.)", value: "security_services" },
    { label: "Services by Director of a Company/Body Corporate", value: "director_services" },
    { label: "Sponsorship Services", value: "sponsorship_services" },
    { label: "Services by Insurance Agent", value: "insurance_agent_services" },
    { label: "Services by Recovery Agent", value: "recovery_agent_services" },
    { label: "Rental of Motor Vehicle (by person other than body corporate to body corporate)", value: "rental_motor_vehicle" },
    { label: "Other Services", value: "other_services" },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-8 font-inter">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">GST Applicability Calculator (GST Act)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="supplyType" className="block text-gray-700 text-sm font-bold mb-2">
            Nature of Supply:
          </label>
          <select
            id="supplyType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={supplyType}
            onChange={(e) => { setSupplyType(e.target.value); setServiceNature(''); }}
          >
            <option value="">-- Select --</option>
            <option value="goods">Goods</option>
            <option value="services">Services</option>
          </select>
        </div>
        <div>
          <label htmlFor="transactionLocation" className="block text-gray-700 text-sm font-bold mb-2">
            Transaction Location:
          </label>
          <select
            id="transactionLocation"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={transactionLocation}
            onChange={(e) => {
              setTransactionLocation(e.target.value);
              setSupplierState('');
              setRecipientState('');
              setServiceNature('');
              setIsSupplierForeign('no');
              setIsRecipientNTOR('no');
            }}
          >
            <option value="">-- Select --</option>
            <option value="Domestic">Domestic (Within India)</option>
            <option value="Export">Export of Goods/Services (Outside India)</option>
            <option value="Import">Import of Goods/Services (Into India)</option>
          </select>
        </div>
        {transactionLocation === 'Domestic' && (
          <>
            <div>
              <label htmlFor="supplierState" className="block text-gray-700 text-sm font-bold mb-2">
                Supplier's State:
              </label>
              <select
                id="supplierState"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
                value={supplierState}
                onChange={(e) => setSupplierState(e.target.value)}
              >
                {indianStates.map(state => (
                  <option key={state.value} value={state.value}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="recipientState" className="block text-gray-700 text-sm font-bold mb-2">
                Recipient's State:
              </label>
              <select
                id="recipientState"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
                value={recipientState}
                onChange={(e) => setRecipientState(e.target.value)}
              >
                {indianStates.map(state => (
                  <option key={state.value} value={state.value}>{state.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor="recipientRegistration" className="block text-gray-700 text-sm font-bold mb-2">
            Recipient's GST Registration Status:
          </label>
          <select
            id="recipientRegistration"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={recipientRegistration}
            onChange={(e) => setRecipientRegistration(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="registered">Registered Person (Has GSTIN)</option>
            <option value="unregistered">Unregistered Person/Consumer</option>
          </select>
        </div>

        {supplyType === 'services' && (
          <div>
            <label htmlFor="serviceNature" className="block text-gray-700 text-sm font-bold mb-2">
              Specific Service Nature (if applicable):
            </label>
            <select
              id="serviceNature"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
              value={serviceNature}
              onChange={(e) => setServiceNature(e.target.value)}
            >
              {serviceNatureOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}

        {(transactionLocation === 'Import' || serviceNature === 'OIDAR_services') && (
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Is Supplier located in Foreign/Non-Taxable Territory?
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 rounded-full"
                  name="isSupplierForeign"
                  value="no"
                  checked={isSupplierForeign === 'no'}
                  onChange={(e) => setIsSupplierForeign(e.target.value)}
                />
                <span className="ml-2 text-gray-700">No (Indian Supplier)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 rounded-full"
                  name="isSupplierForeign"
                  value="yes"
                  checked={isSupplierForeign === 'yes'}
                  onChange={(e) => setIsSupplierForeign(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Yes (Foreign Supplier)</span>
              </label>
            </div>
          </div>
        )}

        {serviceNature === 'OIDAR_services' && isSupplierForeign === 'yes' && recipientRegistration === 'unregistered' && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Is Recipient a Non-Taxable Online Recipient (NTOR)?
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 rounded-full"
                    name="isRecipientNTOR"
                    value="yes"
                    checked={isRecipientNTOR === 'yes'}
                    onChange={(e) => setIsRecipientNTOR(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Yes (NTOR: for non-business purpose)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 rounded-full"
                    name="isRecipientNTOR"
                    value="no"
                    checked={isRecipientNTOR === 'no'}
                    onChange={(e) => setIsRecipientNTOR(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">No (Otherwise, e.g., for business purpose)</span>
                </label>
              </div>
            </div>
        )}

        <div>
          <label htmlFor="supplyValue" className="block text-gray-700 text-sm font-bold mb-2">
            Supply Value (₹):
          </label>
          <input
            type="number"
            id="supplyValue"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={supplyValue}
            onChange={(e) => setSupplyValue(e.target.value)}
            placeholder="e.g., 25000"
          />
        </div>
      </div>
      <button
        onClick={calculateGSTApplicability}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md"
      >
        Check GST Applicability
      </button>

      {gstApplicabilityResult && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-800">GST Applicability Result:</h4>
          {gstApplicabilityResult.applicable ? (
            <>
              <p className="text-gray-800 mt-2">
                **GST Status:** <span className="font-bold text-green-700">Applicable</span>
              </p>
              <p className="text-gray-800">
                **Place of Supply:** <span className="font-bold">{gstApplicabilityResult.placeOfSupply}</span>
              </p>
              <p className="text-gray-800">
                **Charge Mechanism:** <span className="font-bold">{gstApplicabilityResult.charge}</span>
              </p>
              {gstApplicabilityResult.gstType && (
                <p className="text-gray-800">
                  **Type of GST:** <span className="font-bold">{gstApplicabilityResult.gstType}</span>
                </p>
              )}
              <p className="text-gray-800">
                **Remarks:** {gstApplicabilityResult.specialRemarks || 'Standard applicability applies.'}
              </p>
            </>
          ) : (
            <p className="text-gray-800 mt-2">
              <span className="font-bold text-red-700">Not Applicable:</span> {gstApplicabilityResult.message}
            </p>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4">
        *Disclaimer: This calculator provides indicative GST applicability based on simplified rules under the GST Act. This calculator does not cover all intricacies, specific exemptions, or latest amendments to the GST Act. Place of Supply and Reverse Charge Mechanism rules are highly complex and depend on specific facts, notifications, and circulars. Always consult a qualified GST professional for precise advice.
      </p>
    </div>
  );
};

// 3. Input Tax Credit (ITC) Availment Calculator
const ITCAvailmentCalculator = () => {
  const [supplyCategory, setSupplyCategory] = useState('');
  const [purposeOfUse, setPurposeOfUse] = useState('');
  const [isRecipientBlocked, setIsRecipientBlocked] = useState('no'); // Is recipient a composition dealer?
  const [itcAvailmentResult, setItcAvailmentResult] = useState(null);
  const [disputeQuery, setDisputeQuery] = useState('');
  const [disputeCaseLawResult, setDisputeCaseLawResult] = useState('');

  const checkITC = () => {
    let eligible = true;
    let message = 'Input Tax Credit is generally eligible subject to fulfillment of conditions.';
    let conditions = [];

    // Simplified ITC Logic (based on GST Act rules, especially Section 16 & 17(5) for blocked credits)

    if (!supplyCategory || !purposeOfUse) {
        setItcAvailmentResult({ eligible: false, message: 'Please select supply category and purpose of use.' });
        return;
    }

    // General conditions (simulated for display purposes)
    conditions.push('Possession of tax invoice/debit note.');
    conditions.push('Receipt of goods/services.');
    conditions.push('Tax charged is paid by supplier to Government.');
    conditions.push('Recipient has filed GSTR-3B.');

    // Blocked Credits under Section 17(5) (Illustrative examples)
    if (purposeOfUse === 'personal') {
      eligible = false;
      message = 'ITC is blocked for goods/services used for personal consumption as per Section 17(5).';
    } else if (purposeOfUse === 'exempt_supply') {
      eligible = false;
      message = 'ITC is not available for goods/services used exclusively for making exempt supplies.';
    } else if (supplyCategory === 'motor_vehicles_transport') {
      eligible = false;
      message = 'ITC on motor vehicles for transport of persons (up to 13 Seats) is generally blocked, with exceptions.';
      conditions.push('Exceptions: Further supply of such vehicles, transport of passengers, imparting training on driving/flying/navigating, etc.');
    } else if (supplyCategory === 'food_beverages_catering') {
      eligible = false;
      message = 'ITC on food, beverages, outdoor catering, beauty treatment, health services, cosmetic & plastic surgery is generally blocked, with exceptions.';
      conditions.push('Exceptions: Where category of outward supply is same or where input is mandatory under law.');
    } else if (supplyCategory === 'works_contract_immovable') {
      eligible = false;
      message = 'ITC on works contract services for construction of immovable property (other than plant & machinery) is blocked.';
    } else if (supplyCategory === 'membership_fees') {
      eligible = false;
      message = 'ITC on membership of a club, health and fitness centre is blocked.';
    } else if (supplyCategory === 'travel_benefits') {
      eligible = false;
      message = 'ITC on travel benefits to employees on leave (LTC/Home Travel Concession) is blocked.';
    }

    // If recipient is a composition dealer, they are not eligible for ITC
    if (isRecipientBlocked === 'yes') {
      eligible = false;
      message = 'ITC is not available as the recipient is a composition scheme taxpayer.';
    }

    setItcAvailmentResult({ eligible, message, conditions });
  };

  const searchDisputeCaseLaws = async () => {
    if (!disputeQuery.trim()) {
      setDisputeCaseLawResult('Please describe the disputed nature of the goods/services or specific scenario for ITC to search for case laws.');
      return;
    }
    setDisputeCaseLawResult('Searching for relevant case laws... (This feature requires a robust backend integration with legal databases like LegitQuest, Manupatra, or Westlaw India, combined with advanced AI/NLP capabilities for real-time, accurate results. The following is a simulated response based on common ITC disputes.)');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const queryLower = disputeQuery.toLowerCase();
    let simulatedResponse = `No direct ITC case law found for "${disputeQuery}".\n\n`;

    if (queryLower.includes('employee benefits') || queryLower.includes('staff welfare')) {
      simulatedResponse = `**Simulated Case Law Reference for ITC on Employee Benefits/Staff Welfare:**\n` +
        `* **Issue:** ITC on various expenses related to employee welfare (e.g., cab services, food, medical facilities, club memberships).\n` +
        `* **Key Principle:** Generally, ITC is denied on personal consumption, and many employee benefits fall under blocked credits (Sec. 17(5)). However, if providing such benefits is statutorily mandatory or if they are in the course or furtherance of business where output supply is taxable, ITC *may* be available in specific circumstances. The link to business purpose is crucial.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **High Court / AAAR Rulings:** Numerous rulings from Advance Rulings Authorities and High Courts exist on ITC for employee transportation, canteen services, etc., with varying interpretations based on specific facts and whether such supply is mandatorily provided under any law.\n`;
    } else if (queryLower.includes('repairs and maintenance') || queryLower.includes('renovation of building')) {
      simulatedResponse = `**Simulated Case Law Reference for ITC on Repairs/Renovation of Immovable Property:**\n` +
        `* **Issue:** ITC on works contract services, goods/services for construction, repair, or renovation of immovable property.\n` +
        `* **Key Principle:** ITC is generally blocked on works contract services for construction of an immovable property (other than plant and machinery) except where it is an input service for further supply of works contract service. This also extends to goods or services or both supplied for construction of an immovable property on own account. The distinction between 'repair' (eligible for ITC if not capitalised) and 'construction' (blocked) is often a point of dispute.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **Various ITAT / AAAR Rulings:** Deal with the classification of expenditure (revenue vs. capital) and whether ITC is blocked under Section 17(5)(c) or 17(5)(d) for construction/renovation activities.\n`;
    } else if (queryLower.includes('marketing services overseas') || queryLower.includes('advertisement abroad')) {
        simulatedResponse = `**Simulated Case Law Reference for ITC on Marketing Services from Overseas (Import of Services):**\n` +
          `* **Issue:** ITC on import of marketing, advertising, or brand promotion services where GST is paid under Reverse Charge Mechanism (RCM).\n` +
          `* **Key Principle:** When a registered person in India imports services, GST is payable under RCM. Generally, ITC of such RCM paid GST is available to the recipient, provided the services are used in the course or furtherance of business and are not otherwise blocked credits under Section 17(5). Disputes often arise regarding the 'purpose' of the service and whether it directly relates to taxable outward supplies.\n` +
          `* **Simulated Cases (Illustrative):**\n` +
          `    * **AAR/AAAR Rulings:** Many advance rulings have been pronounced on the eligibility of ITC for various imported services like online advertisement, cloud services, etc.\n`;
    }
    else {
      simulatedResponse += `**General Guidance:** ITC eligibility is a highly litigious area. Various factors like the nature of supply, purpose of use, type of recipient/supplier, and specific conditions/exceptions under Section 17(5) and other rules of the GST Act are crucial. Judicial pronouncements from High Courts, Tribunals, and Advance Ruling Authorities often provide clarity on disputed matters. This tool provides a simplified overview.`;
    }

    setDisputeCaseLawResult(simulatedResponse +
      `\n\n**Disclaimer:** These are *simulated* examples for illustrative purposes only. They do not constitute legal advice. For actual legal interpretations, current ITC eligibility, specific case law applicability, and precise guidance under the GST Act, please consult a qualified GST professional. Real-time access to and interpretation of legal databases requires specialized commercial tools and human expertise.`
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl font-inter">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Input Tax Credit (ITC) Availment Calculator (GST Act)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="supplyCategory" className="block text-gray-700 text-sm font-bold mb-2">
            Nature/Category of Goods/Services:
          </label>
          <select
            id="supplyCategory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={supplyCategory}
            onChange={(e) => setSupplyCategory(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="raw_materials">Raw Materials / Inputs for Production</option>
            <option value="capital_goods">Capital Goods (Machinery, Equipment)</option>
            <option value="office_supplies">Office Supplies / General Services</option>
            <option value="professional_fees">Professional / Consultancy Fees</option>
            <option value="motor_vehicles_transport">Motor Vehicles for Transport of Persons (up to 13 Seats)</option>
            <option value="food_beverages_catering">Food, Beverages, Outdoor Catering, Health Services</option>
            <option value="works_contract_immovable">Works Contract for Immovable Property (Other than Plant & Machinery)</option>
            <option value="membership_fees">Membership of Club, Health/Fitness Centre</option>
            <option value="travel_benefits">Travel Benefits to Employees on Leave (LTC/Home Travel Concession)</option>
            <option value="other">Other Business Expense</option>
          </select>
        </div>
        <div>
          <label htmlFor="purposeOfUse" className="block text-gray-700 text-sm font-bold mb-2">
            Purpose of Use:
          </label>
          <select
            id="purposeOfUse"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
            value={purposeOfUse}
            onChange={(e) => setPurposeOfUse(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="business">For Business / Furtherance of Business (Taxable Supplies)</option>
            <option value="personal">For Personal Consumption</option>
            <option value="exempt_supply">For Making Exempt Supplies</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Is the Recipient a Composition Scheme Taxpayer?
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio text-indigo-600 rounded-full"
                name="isRecipientBlocked"
                value="no"
                checked={isRecipientBlocked === 'no'}
                onChange={(e) => setIsRecipientBlocked(e.target.value)}
              />
              <span className="ml-2 text-gray-700">No (Regular Taxpayer)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 rounded-full"
                name="isRecipientBlocked"
                value="yes"
                checked={isRecipientBlocked === 'yes'}
                onChange={(e) => setIsRecipientBlocked(e.target.value)}
              />
              <span className="ml-2 text-gray-700">Yes (Composition Taxpayer)</span>
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={checkITC}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md"
      >
        Check ITC Availment
      </button>

      {itcAvailmentResult && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-800">ITC Availment Result:</h4>
          <p className="text-gray-800 mt-2">
            ITC is{' '}
            <span className={`font-bold ${itcAvailmentResult.eligible ? 'text-green-700' : 'text-red-700'}`}>
              {itcAvailmentResult.eligible ? 'Eligible' : 'Not Eligible'}
            </span>
            .
          </p>
          <p className="text-sm text-gray-600 mt-1">{itcAvailmentResult.message}</p>
          {itcAvailmentResult.eligible && itcAvailmentResult.conditions.length > 0 && (
            <div className="mt-2 text-sm text-gray-700">
              <p className="font-semibold">General Conditions to be fulfilled for ITC Availment:</p>
              <ul className="list-disc list-inside ml-4">
                {itcAvailmentResult.conditions.map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Disputed Nature of Goods/Services or ITC Availment?</h4>
        <p className="text-gray-700 mb-4">
          Describe the dispute or the specific goods/services to search for relevant decided case laws for guidance:
        </p>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 mb-4 rounded-md"
          rows="4"
          placeholder="e.g., ITC on repairs of rented office building that are capitalized. ITC for common expenses used for both taxable and exempt supplies. ITC on services for employee transport."
          value={disputeQuery}
          onChange={(e) => setDisputeQuery(e.target.value)}
        ></textarea>
        <button
          onClick={searchDisputeCaseLaws}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md"
        >
          Search Case Laws
        </button>
        {disputeCaseLawResult && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-gray-800 whitespace-pre-wrap">
            {disputeCaseLawResult}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        *Disclaimer: The ITC availment guidance is indicative and based on simplified interpretations for common scenarios under the GST Act. The "Search Case Laws" feature is simulated and provides illustrative examples; it is not a real-time legal research tool. Actual ITC eligibility and legal interpretations are highly complex and depend on specific facts, latest amendments, notifications, circulars, and judicial precedents. Always consult a qualified GST professional for precise ITC eligibility and legal advice.
        </p>
      </div>
    );
  };


// LegalUpdates component
const LegalUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming your table name in Supabase is 'Siddhi Jain Law Updates'
        // If it's different, e.g., 'legal_updates', change the string below
        const { data, error } = await supabase
          .from("Siddhi Jain Law Updates") // !!! IMPORTANT: Update this table name if it's different in your Supabase project !!!
          .select("*")
          .order("published_on", { ascending: false }); // Order by date, newest first

        if (error) {
          console.error("❌ Error fetching updates from Supabase:", error.message);
          setError("Failed to load legal updates. Please try again later.");
          setUpdates([]); // Clear any old simulated data on error
        } else {
          setUpdates(data);
        }
      } catch (e) {
        console.error("Error with Supabase fetch:", e.message);
        setError("An unexpected error occurred while fetching updates.");
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []); // Empty dependency array means this runs once on mount

   return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {/* 📜 Latest Legal Updates */}
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow h-auto max-h-[500px] overflow-y-auto pr-2">
        <h3 className="text-2xl font-bold text-indigo-700 mb-4">📌 Latest Legal Updates</h3>
        {loading && <p className="text-center text-gray-500">Loading updates...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && updates.length === 0 && <p className="text-center text-gray-500">No legal updates available at the moment. Please check back later!</p>}
        {!loading && !error && updates.length > 0 && (
          <ul className="space-y-4">
            {updates.map((update) => (
              <li key={update.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <h4 className="font-bold text-lg mb-1">{update.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{new Date(update.published_on).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 line-clamp-3">{update.summary}</p>
                {update.source_link && (
                  <a
                    href={update.source_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline text-sm mt-2 inline-block"
                  >
                    Read more
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📝 Our Latest Blog (Static Placeholder for now, can be connected to Supabase later) */}
      <div className="bg-white p-6 rounded-lg shadow text-center flex flex-col justify-center items-center h-auto max-h-[500px]">
        <h3 className="text-2xl font-bold text-indigo-700 mb-2">📝 Our Latest Blog</h3>
        <p className="text-gray-600 max-w-md">
          Coming soon: Expert insights and thought leadership from Siddhi Jain & Associates.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Stay tuned as we share case studies, legal updates, and strategic tips.
        </p>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [session, setSession] = useState(null);
  const [authMessage, setAuthMessage] = useState(''); // For auth related messages
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile navigation
  const [activeCalculatorTab, setActiveCalculatorTab] = useState('tds'); // For the calculator tabs

  useEffect(() => {
    // Fetch initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error getting initial session:", error.message);
      }
    };
    getInitialSession();

    // Listen for auth state changes
    // CORRECTED LINE: Destructure 'subscription' directly from 'data'
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the listener on component unmount
    // CORRECTED LINE: Call unsubscribe on the 'subscription' object
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <section id="home" className="min-h-[calc(100vh-80px)] py-20 bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center text-center px-4 md:px-6">
              <div className="container mx-auto max-w-4xl">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight animate-fade-in">
                  Siddhi Jain & Associates
                </h2>
                <p className="text-2xl md:text-3xl font-light mb-8">
                  Your Partner in Corporate Compliance & Legal Advisory
                </p>
                <p className="text-lg md:text-xl mb-10 opacity-90">
                  Guiding businesses through comprehensive corporate law, tax, and regulatory compliance, ensuring seamless operations and robust governance in India.
                </p>
                <button
                  onClick={() => setActiveSection('services')}
                  className="bg-white text-indigo-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Explore Our Expertise
                </button>
                <LegalUpdates /> {/* Legal Updates component fetches from Supabase */}
              </div>
            </section>
          </>
        );
      case 'about':
        return (
          <section id="about" className="py-20 bg-gray-100 px-4 md:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Siddhi Jain & Associates</h2>
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  Siddhi Jain & Associates is a distinguished firm specializing in Company Secretarial services and corporate legal advisory. Led by Siddhi Jain, a highly qualified Company Secretary, our firm is dedicated to empowering businesses with seamless compliance and robust governance frameworks.
                </p>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  With profound expertise in the Companies Act, FEMA, SEBI Regulations, Income Tax Act, and GST laws, we provide tailored solutions that address the unique challenges of modern businesses. Our commitment is to ensure your enterprise not only adheres to regulatory requirements but also thrives with strategic legal support.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Located in Udaipur, Rajasthan, we serve clients across India, offering personalized attention and up-to-date advice to foster sustainable growth and minimize regulatory risks.
                </p>
              </div>
            </div>
          </section>
        );
      case 'services':
        return (
          <section id="services" className="py-20 bg-gray-50 px-4 md:px-6">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Company Formation & Structuring</h3>
                  <p className="text-gray-700">Expert guidance on selecting the right business structure, incorporation, and registration.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">ROC & MCA Compliances</h3>
                  <p className="text-gray-700">Ensuring timely and accurate filing of all statutory returns and forms with the Registrar of Companies and Ministry of Corporate Affairs.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Secretarial Audit & Due Diligence</h3>
                  <p className="text-gray-700">Conducting comprehensive secretarial audits and legal due diligence for regulatory compliance and risk assessment.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Corporate Governance Advisory</h3>
                  <p className="text-gray-700">Advising on best practices for corporate governance, board management, and stakeholder relations.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">FEMA & RBI Compliances</h3>
                  <p className="text-gray-700">Expert guidance on Foreign Exchange Management Act (FEMA) and Reserve Bank of India (RBI) regulations for foreign investments and remittances.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Intellectual Property Rights</h3>
                  <p className="text-gray-700">Assistance with trademark, copyright, and patent registration, protection, and advisory.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Legal Drafting & Vetting</h3>
                  <p className="text-gray-700">Preparation and review of legal documents, agreements, contracts, and corporate resolutions.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Tax Advisory (TDS & GST)</h3>
                  <p className="text-gray-700">Consultancy on TDS and GST implications, compliances, and optimization strategies.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Winding Up & Strike Off</h3>
                  <p className="text-gray-700">Assistance with closure of companies, strike off procedures, and liquidation processes.</p>
                </div>
              </div>
              <div className="text-center mt-10">
                <button
                  onClick={() => setActiveSection('contact')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Schedule a Consultation
                </button>
              </div>
            </div>
          </section>
        );
      case 'calculators':
    return (
      <section id="calculators" className="py-20 px-4 md:px-8 lg:px-16 bg-white animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Calculators</h2>

          {/* Calculator Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveCalculatorTab('tds')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300
                ${activeCalculatorTab === 'tds' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              TDS Calculator
            </button>
            <button
              onClick={() => setActiveCalculatorTab('gst')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300
                ${activeCalculatorTab === 'gst' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              GST Applicability
            </button>
            <button
              onClick={() => setActiveCalculatorTab('itc')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300
                ${activeCalculatorTab === 'itc' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              ITC Availment
            </button>
          </div>

          {/* Render Active Calculator */}
          {activeCalculatorTab === 'tds' && <TDSCalculator />}
          {activeCalculatorTab === 'gst' && <GSTApplicabilityCalculator />}
          {activeCalculatorTab === 'itc' && <ITCAvailmentCalculator />}

        </div>
      </section>
    );
      case 'contact':
        return (
          <section id="contact" className="py-20 bg-gray-100 px-4 md:px-6">
            <div className="container mx-auto max-w-2xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Siddhi Jain & Associates</h2>
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <p className="text-lg text-gray-700 mb-6 text-center">
                  We are here to assist you with all your corporate compliance and legal advisory needs. Reach out to us using the information below or the contact form:
                </p>
                <form
                  action="https://formspree.io/f/mwpboqlo" // Replace with your actual Formspree endpoint
                  method="POST"
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                      Your Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                      Phone Number (Optional):
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                      Your Inquiry:
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 rounded-md"
                      placeholder="Describe your query or service requirement..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg w-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 rounded-md"
                  >
                    Send Message
                  </button>
                </form>
                <div className="mt-8 text-center text-gray-700 border-t pt-6">
                  <p className="font-semibold text-lg">Siddhi Jain & Associates</p>
                  <p className="mt-2">22/E Aashirvad Nagar University Road,</p>
                  <p>Udaipur, Rajasthan, India - 313001</p>
                  <p className="mt-4">Email: <a href="mailto:fcssiddhijain@gmail.com" className="text-indigo-600 hover:underline">fcssiddhijain@gmail.com</a></p>
                  <p>Phone: <a href="tel:+918454079700" className="text-indigo-600 hover:underline">+91 8454079700</a></p>
                </div>
                <div className="mt-8 border-t pt-6 text-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">Client Login / Signup</h4>
                  {!session ? (
                    <Auth setAuthMessage={setAuthMessage} /> // Pass setAuthMessage to Auth component
                  ) : (
                    <div className="text-center">
                      <p className="text-lg text-green-700 font-semibold mb-4">
                        Welcome, {session.user.email}! You are logged in.
                      </p>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={async () => {
                          const { error } = await supabase.auth.signOut();
                          if (error) {
                            console.error('Error logging out:', error.message);
                            setAuthMessage(`Error logging out: ${error.message}`);
                          } else {
                            setSession(null);
                            setAuthMessage('Logged out successfully.');
                          }
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                  {authMessage && <p className={`text-sm mt-2 ${authMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{authMessage}</p>}
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  // Auth component for Supabase authentication
  const Auth = ({ setAuthMessage }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (event) => {
      event.preventDefault();
      setLoading(true);
      setAuthMessage(''); // Clear previous messages

      let authPromise;
      if (isSignUp) {
        authPromise = supabase.auth.signUp({ email, password });
      } else {
        authPromise = supabase.auth.signInWithPassword({ email, password });
      }

      const { data, error } = await authPromise;

      if (error) {
        setAuthMessage(`Error ${isSignUp ? 'signing up' : 'logging in'}: ${error.message}`);
      } else if (data.user) {
        setAuthMessage(`${isSignUp ? 'Sign up successful! Please check your email for verification.' : 'Logged in successfully!'}`);
      }
      setLoading(false);
    };

    return (
      <form onSubmit={handleAuth} className="flex flex-col items-center space-y-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-sm rounded-md"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-sm rounded-md"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md w-full max-w-sm"
          disabled={loading}
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
        </button>
        <button
          type="button"
          className="text-indigo-600 hover:text-indigo-800 text-sm mt-2"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setAuthMessage(''); // Clear message on toggle
            setEmail(''); // Clear inputs on toggle
            setPassword('');
          }}
        >
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </form>
    );
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      {/* Navigation Bar */}
<nav className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo/Brand Name */}
        <div className="text-2xl font-bold text-indigo-300">
            Siddhi Jain & Associates
        </div>

        {/* Mobile Menu Button */}
        <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            )}
            </svg>
        </button>

        {/* Navigation Links */}
        <div
            // This class makes the menu visible/hidden based on screen size and isMobileMenuOpen state
            className={`w-full md:flex md:items-center md:w-auto mt-4 md:mt-0 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        >
            <button
            onClick={() => { setActiveSection('home'); setIsMobileMenuOpen(false); }} // Added setIsMobileMenuOpen(false)
            className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                ${activeSection === 'home' ? 'text-indigo-300 font-semibold' : ''}`}
            >
            Home
            </button>
            <button
            onClick={() => { setActiveSection('about'); setIsMobileMenuOpen(false); }} // Added setIsMobileMenuOpen(false)
            className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                ${activeSection === 'about' ? 'text-indigo-300 font-semibold' : ''}`}
            >
            About
            </button>
            <button
            onClick={() => { setActiveSection('services'); setIsMobileMenuOpen(false); }} // Added setIsMobileMenuOpen(false)
            className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                ${activeSection === 'services' ? 'text-indigo-300 font-semibold' : ''}`}
            >
            Services
            </button>
            <button
            onClick={() => { setActiveSection('calculators'); setIsMobileMenuOpen(false); }} // Added setIsMobileMenuOpen(false)
            className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                ${activeSection === 'calculators' ? 'text-indigo-300 font-semibold' : ''}`}
            >
            Calculators
            </button>
            <button
            onClick={() => { setActiveSection('contact'); setIsMobileMenuOpen(false); }} // Added setIsMobileMenuOpen(false)
            className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                ${activeSection === 'contact' ? 'text-indigo-300 font-semibold' : ''}`}
            >
            Contact
            </button>
        </div>
    </div>
</nav>

      {/* Render Active Section */}
      {renderSection()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Siddhi Jain & Associates. All rights reserved.</p>
          <p className="text-xs mt-2 opacity-75">Professional Compliance. Strategic Advisory.</p>
        </div>
      </footer>

      {/* Global styles for smooth scrolling and base font */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;