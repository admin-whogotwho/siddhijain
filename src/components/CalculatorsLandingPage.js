// src/components/CalculatorsLandingPage.js

import React, { useState } from 'react'; // Import useState for the tabs
import { Helmet } from 'react-helmet-async'; // Import Helmet for meta tags
// import { Link } from 'react-router-dom'; // No direct links needed for tabs here, but keep if you add 'Go to full page' links

// IMPORT YOUR CALCULATOR COMPONENTS HERE
// These components (TDSCalculator, GSTApplicabilityCalculator, ITCAvailmentCalculator)
// are still currently in your App.backup.js. We will extract them to their own files soon!
// For now, assume they will be imported from src/components/TDSCalculator.js, etc.
import TDSCalculator from './TDSCalculator'; // You will create this file
import GSTApplicabilityCalculator from './GSTApplicabilityCalculator'; // You will create this file
import ITCAvailmentCalculator from './ITCAvailmentCalculator'; // You will create this file


const CalculatorsLandingPage = () => {
  // State for managing the active tab within this landing page
  const [activeCalculatorTab, setActiveCalculatorTab] = useState('tds'); // Default to TDS tab

  return (
    <>
      <Helmet>
        <title>Online Calculators - TDS, GST, ITC | Siddhi Jain & Associates</title>
        <meta name="description" content="Use our free online calculators for TDS, GST Applicability, and Input Tax Credit (ITC) Availment. Quick tools for tax and compliance estimations." />
        <link rel="canonical" href="https://www.cssiddhijain.com/calculators" /> {/* IMPORTANT: Ensure this matches your live domain */}
      </Helmet>

      <section id="calculators" className="py-20 px-4 md:px-8 lg:px-16 bg-white animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Calculators</h2>

          {/* Calculator Tabs - these will still control the internal display on this page */}
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

          {/* Render Active Calculator based on tab selection */}
          {activeCalculatorTab === 'tds' && <TDSCalculator />}
          {activeCalculatorTab === 'gst' && <GSTApplicabilityCalculator />}
          {activeCalculatorTab === 'itc' && <ITCAvailmentCalculator />}

        </div>
      </section>
    </>
  );
};

export default CalculatorsLandingPage;