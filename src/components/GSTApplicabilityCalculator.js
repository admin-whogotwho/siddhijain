// src/components/GSTApplicabilityCalculator.js

import React, { useState } from 'react'; // Make sure this import is present

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
                  Is Recipient a Non-Taxable Online Recipient (NTOR)? </label>
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

export default GSTApplicabilityCalculator;