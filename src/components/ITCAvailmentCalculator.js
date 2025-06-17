// src/components/ITCAvailmentCalculator.js

import React, { useState } from 'react'; // Make sure all necessary React hooks are imported

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
    let simulatedResponse = `No direct ITC case law found for "${queryLower}".\n\n`;
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
              Is the Recipient a Composition Scheme Taxpayer? </label>
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
            . </p>
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

export default ITCAvailmentCalculator;