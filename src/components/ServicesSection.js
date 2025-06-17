// src/components/ServicesSection.js

import React from 'react';
import { Helmet } from 'react-helmet-async'; // Import Helmet for meta tags
import { Link } from 'react-router-dom'; // Import Link for navigation

const ServicesSection = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Corporate, Legal & Tax Advisory | Siddhi Jain & Associates</title>
        <meta name="description" content="Explore the range of services offered by Siddhi Jain & Associates: Company Law, Secretarial Audit, FEMA, SEBI, GST, Intellectual Property, and Business Advisory." />
        <link rel="canonical" href="https://www.cssiddhijain.com/services" /> {/* IMPORTANT: Ensure this matches your live domain */}
      </Helmet>

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
            {/* Changed button to Link from react-router-dom */}
            <Link
              to="/contact" // This is the route for your Contact page
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;