// src/pages/TDSCalculatorPage.js

import React from 'react';
import { Helmet } from 'react-helmet-async';
import TDSCalculator from '../components/TDSCalculator'; // Import the TDS Calculator component

const TDSCalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>TDS Calculator Online | Calculate TDS Easily - Siddhi Jain & Associates</title>
        <meta name="description" content="Use our free online TDS Calculator to quickly determine Tax Deducted at Source for various payments like rent, professional fees, and contracts. Accurate and easy-to-use." />
        <link rel="canonical" href="https://www.cssiddhijain.com/tds-calculator" /> {/* IMPORTANT: Replace with your actual live domain and specific calculator URL */}
      </Helmet>

      {/* Hero section or banner for the specific calculator page */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">TDS Calculator</h1>
        <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
          Simplify your Tax Deducted at Source calculations.
        </p>
      </section>

      {/* Main content area for the calculator */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <TDSCalculator /> {/* Render the actual TDS Calculator component */}
        </div>
      </section>

      {/* Optional: Add more content related to TDS here, e.g., FAQs, articles */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Understanding TDS</h2>
          <p className="text-gray-700 mb-4">
            Tax Deducted at Source (TDS) is a system where the person making a payment deducts tax at the time of making certain payments. The deducted tax is then deposited with the government. This mechanism ensures a regular flow of revenue to the government and broadens the tax base.
          </p>
          <p className="text-gray-700 mb-4">
            Common types of payments subject to TDS include salary, interest, commission, brokerage, professional fees, rent, etc. The rates of TDS vary depending on the nature of the payment and the status of the recipient (e.g., individual, company, resident, non-resident), and whether a Permanent Account Number (PAN) is provided.
          </p>
          <p className="text-gray-700">
            It's crucial for both deductee (recipient of payment) and deductor (payer) to comply with TDS provisions to avoid penalties and ensure smooth tax compliance.
          </p>
        </div>
      </section>
    </>
  );
};

export default TDSCalculatorPage;