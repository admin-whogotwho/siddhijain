// src/components/TDSCalculator.js

import React, { useState, useEffect } from 'react'; // <--- IMPORTANT: Include this line!
// import { supabase } from '../supabaseClient'; // Only needed if you had actual Supabase integration for searchCaseLaws

// Your TDS Calculator code starts here:
const TDSCalculator = () => {
  const [paymentNature, setPaymentNature] = useState('');
  const [amount, setAmount] = useState('');
  const [panAvailable, setPanAvailable] = useState('yes');
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
    let rate = 0;
    let threshold = 0;
    let isApplicable = false;
    let tdsAmount = null;
    let remarks = '';
    let rateDisplay = '';

    switch (paymentNature) {
      case 'Salary':
        applicableSection = '192';
        threshold = 0;
        rateDisplay = panAvailable === 'yes' ? 'As per individual tax slab' : '20% (Max Marginal Rate)';
        isApplicable = true;
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
          threshold = 50000;
        } else if (residentStatus === 'individual' || residentStatus === 'huf' || residentStatus === 'other') {
          threshold = 40000;
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
        threshold = 30000;
        rate = (residentStatus === 'individual' || residentStatus === 'huf') ? 1 : 2;
        isApplicable = (val > threshold);
        remarks = 'Individual/HUF rate is 1%, others 2%. Note: Higher threshold for aggregate payments (₹1,00,000) not covered by this single transaction calculator.';
        break;
      case 'Insurance Commission':
        applicableSection = '194D';
        threshold = 15000;
        rate = 5;
        isApplicable = (val > threshold);
        remarks = 'Rate is 5% for resident. If company, rate might be 10%.';
        break;
      case 'Commission/Brokerage':
        applicableSection = '194H';
        threshold = 15000;
        rate = 5;
        isApplicable = (val > threshold);
        break;
      case 'Rent (Land/Building/Furniture)':
        applicableSection = '194I';
        threshold = 240000;
        rate = 10;
        isApplicable = (val > threshold);
        remarks = 'This threshold is annual. If payer is Individual/HUF not under tax audit, Sec 194IB applies (5% if rent > ₹50,000/month on monthly payments).';
        break;
      case 'Rent (Plant/Machinery/Equipment)':
        applicableSection = '194I';
        threshold = 240000;
        rate = 2;
        isApplicable = (val > threshold);
        remarks = 'This threshold is annual. If payer is Individual/HUF not under tax audit, Sec 194IB applies (5% if rent > ₹50,000/month on monthly payments).';
        break;
      case 'Professional Fees':
        applicableSection = '194J';
        threshold = 30000;
        rate = 10;
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
        threshold = 5000000;
        rate = 1;
        isApplicable = (val >= threshold);
        remarks = 'Applicable on transfer of immovable property (other than agricultural land).';
        break;
      case 'Rent by Ind/HUF (Not Tax Audit)':
        applicableSection = '194IB';
        threshold = 50000;
        rate = 5;
        isApplicable = (val > threshold);
        remarks = 'Applicable for Individuals/HUF not liable for tax audit, paying rent > ₹50,000 per month. Please enter *monthly* rent amount.';
        break;
      case 'Purchase of Goods':
        applicableSection = '194Q';
        threshold = 5000000;
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
        threshold = 10000;
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
    let simulatedResponse = `No direct case law found for "${queryLower}".\n\n`;
    if (queryLower.includes('software license') || queryLower.includes('software payment')) {
      simulatedResponse = `**Simulated Case Law Reference for Software Payments (TDS Applicability):**\n` +
        `* **Issue:** Whether payment for software is 'royalty' (Sec. 194J) or 'purchase of copyrighted article' (no TDS on purchase), or 'technical services'.\n` +
        `* **Key Principle:** The distinction often lies in whether the payer acquires a copyright or merely a copyrighted article (license to use). Indian courts have given various pronouncements, often distinguishing between 'right to use' and 'transfer of copyright'. If it involves a transfer of part of copyright, it could be royalty. If it's a mere sale of software for use, it generally may not attract TDS under royalty, but if it involves installation, customization, or technical support, it might be professional/technical fees.\n` +
        `* **Relevant Sections:** Section 194J (Fees for Professional/Technical Services), Section 9(1)(vi) (Royalty income for non-residents).\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **CIT vs. Samsung Electronics Co. Ltd. (Supreme Court):** Often cited for principles on royalty. While this case did not directly deal with software, its principles on 'use of patent/secret process' are applied.\n` +
        `    * **Various ITAT / High Court Rulings:** Many rulings exist distinguishing between canned software, customized software, and software maintenance, impacting TDS applicability.\n`;
    } else if (queryLower.includes('reimbursement of expenses') || queryLower.includes('expenditure reimbursement')) {
      simulatedResponse = `**Simulated Case Law Reference for Reimbursement of Expenses (TDS Applicability):**\n` +
        `* **Issue:** Whether pure reimbursements, where the payer is merely passing on actual expenses incurred by the payee, are subject to TDS.\n` +
        `* **Key Principle:** Generally, genuine reimbursements which are incurred by the payee on behalf of the payer and are not part of the 'income' of the payee, may not attract TDS. The essence is whether there's an element of income or profit for the payee. If the payer is merely reimbursing actual out-of-pocket expenses without any value addition by the payee, TDS may not be required. However, if the reimbursement is disguised remuneration or includes a profit element, it would be subject to TDS.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **CIT vs. Hero Honda Motors Ltd. (Delhi High Court):** Often cited in this context, emphasizing that if the payer is only reimbursing the actual expenses without any profit element for the payee, no TDS is required.\n` +
        `    * **Circular No. 715 of 1995:** Clarifies that no TDS is required on reimbursement of actual expenses, but this circular's applicability has been debated in various contexts.\n`;
    } else if (queryLower.includes('non-resident services') || queryLower.includes('payment to nri')) {
      simulatedResponse = `**Simulated Case Law Reference for Payments to Non-Residents (TDS):**\n` +
        `* **Issue:** Applicability of TDS on various payments (e.g., professional fees, technical services, interest, royalty) to non-residents, considering DTAAs (Double Taxation Avoidance Agreements).\n` +
        `* **Key Principle:** For payments to non-residents, TDS applicability depends on whether the income accrues or arises in India, and importantly, the provisions of the applicable DTAA between India and the non-resident's country of residence. If the DTAA provides a lower rate or exemption, the DTAA provisions generally prevail over the Income Tax Act, 1961.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **GE India Technology Centre Pvt. Ltd. vs. CIT (Supreme Court):** Landmark judgment emphasizing the primacy of DTAA over the Income Tax Act in certain situations.\n` +
        `    * **Many ITAT / High Court rulings:** Deal with specific types of services (e.g., cloud computing, marketing services, software services) provided by non-residents and their taxability in India under DTAA provisions.\n`;
    } else if (queryLower.includes('rent of building vs machinery') || queryLower.includes('194i rent')) {
      simulatedResponse = `**Simulated Case Law Reference for Rent under Section 194I (Building vs. Machinery):**\n` +
        `* **Issue:** Distinction between rent of plant and machinery (2% TDS) and rent of land/building/furniture/fittings (10% TDS) under Section 194I.\n` +
        `* **Key Principle:** The determination depends on the primary nature of the asset being rented. If a composite contract involves both, a proper apportionment is critical. If the machinery is affixed to the building and integral to its functioning as a factory, it might be considered part of the building rent. However, if machinery is distinct and separable, its rent would attract 2% TDS.\n` +
        `* **Simulated Cases (Illustrative):**\n` +
        `    * **CBDT Circulars:** Various clarifications have been issued by CBDT. For example, Circular No. 715 of 1995 provided some initial clarity.\n` +
        `    * **High Court and ITAT Rulings:** Numerous judgments exist on whether a composite contract for factory building and machinery should be bifurcated for TDS purposes under 194I.\n`;
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
            PAN Available? </label>
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

export default TDSCalculator;