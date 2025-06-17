// src/pages/ITCAvailmentCalculatorPage.js

import React from 'react';
import { Helmet } from 'react-helmet-async';
import ITCAvailmentCalculator from '../components/ITCAvailmentCalculator'; // Import the ITC Availment Calculator component

const ITCAvailmentCalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>ITC Availment Calculator Online | Input Tax Credit Eligibility - Siddhi Jain & Associates</title>
        <meta name="description" content="Check your Input Tax Credit (ITC) eligibility under GST with our free online calculator. Understand blocked credits and general conditions for ITC availment." />
        <link rel="canonical" href="https://www.cssiddhijain.com/itc-availment-calculator" /> {/* IMPORTANT: Replace with your actual live domain and specific calculator URL */}
      </Helmet>

      {/* Hero section or banner for the specific calculator page */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">ITC Availment Calculator</h1>
        <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
          Determine your Input Tax Credit (ITC) eligibility under GST.
        </p>
      </section>

      {/* Main content area for the calculator */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <ITCAvailmentCalculator /> {/* Render the actual ITC Availment Calculator component */}
        </div>
      </section>

      {/* Optional: Add more content related to ITC Availment here, e.g., FAQs, articles */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Understanding Input Tax Credit (ITC)</h2>
          <p className="text-gray-700 mb-4">
            Input Tax Credit (ITC) is a cornerstone of the Goods and Services Tax (GST) regime in India, aimed at avoiding the cascading effect of taxes. It allows businesses to reduce the tax they pay on their output by the tax they have already paid on inputs (goods or services) used for making outward taxable supplies.
          </p>
          <p className="text-gray-700 mb-4">
            However, the availment of ITC is subject to specific conditions and certain 'blocked credits' as outlined in Section 17(5) of the CGST Act. Understanding these provisions is crucial to ensure proper compliance and maximize tax savings. Our calculator provides a simplified guide to common scenarios.
          </p>
          <p className="text-gray-700">
            Common reasons for ITC ineligibility include: inputs used for personal consumption, goods/services used for making exempt supplies, and specific categories of goods/services like certain motor vehicles, food & beverages, and works contract services for immovable property.
          </p>
        </div>
      </section>
    </>
  );
};

export default ITCAvailmentCalculatorPage;