// src/pages/GSTApplicabilityCalculatorPage.js

import React from 'react';
import { Helmet } from 'react-helmet-async';
import GSTApplicabilityCalculator from '../components/GSTApplicabilityCalculator'; // Import the GST Applicability Calculator component

const GSTApplicabilityCalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>GST Applicability Calculator Online | Determine GST on Transactions - Siddhi Jain & Associates</title>
        <meta name="description" content="Use our free online GST Applicability Calculator to determine GST type (CGST/SGST/IGST), Place of Supply, and Reverse Charge Mechanism for various transactions." />
        <link rel="canonical" href="https://www.cssiddhijain.com/gst-applicability-calculator" /> {/* IMPORTANT: Replace with your actual live domain and specific calculator URL */}
      </Helmet>

      {/* Hero section or banner for the specific calculator page */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">GST Applicability Calculator</h1>
        <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
          Understand GST on your transactions: Place of Supply, GST Type & Charge Mechanism.
        </p>
      </section>

      {/* Main content area for the calculator */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <GSTApplicabilityCalculator /> {/* Render the actual GST Applicability Calculator component */}
        </div>
      </section>

      {/* Optional: Add more content related to GST Applicability here, e.g., FAQs, articles */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About GST Applicability</h2>
          <p className="text-gray-700 mb-4">
            Under the Goods and Services Tax (GST) regime in India, determining the correct type of GST (CGST, SGST, or IGST) and the applicable charge mechanism (Forward Charge or Reverse Charge) is crucial for compliance. This depends primarily on two factors: the Place of Supply and the nature of the transaction and parties involved.
          </p>
          <p className="text-gray-700 mb-4">
            **Place of Supply** rules define where a supply of goods or services is deemed to have occurred. If the place of supply and the supplier's location are in the same state, it's an intra-state supply (CGST + SGST). If they are in different states or a Union Territory, it's an inter-state supply (IGST). For imports/exports, specific rules apply.
          </p>
          <p className="text-gray-700">
            **Reverse Charge Mechanism (RCM)** shifts the liability to pay GST from the supplier to the recipient of goods or services in specified categories. This ensures tax collection in situations where the supplier might be unorganized or located outside India, among other scenarios.
          </p>
        </div>
      </section>
    </>
  );
};

export default GSTApplicabilityCalculatorPage;