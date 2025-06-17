// src/components/AppAboutSection.js

import React from 'react';
import { Helmet } from 'react-helmet-async'; // Import Helmet for meta tags

const AppAboutSection = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Siddhi Jain & Associates | Expert Legal & Compliance</title>
        <meta name="description" content="Learn about Siddhi Jain & Associates' mission, values, and expertise. We are dedicated to providing precise corporate compliance, legal advisory, and tax solutions in India." />
        <link rel="canonical" href="https://www.cssiddhijain.com/about" /> {/* IMPORTANT: Ensure this matches your live domain */}
      </Helmet>

      <section id="about" className="py-20 bg-gray-100 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Siddhi Jain & Associates</h2>
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Siddhi Jain & Associates is a distinguished firm specializing in Company Secretarial services and corporate legal advisory. Led by Siddhi Jain, a highly qualified Company Secretary, our firm is dedicated to empowering businesses with seamless compliance and robust governance frameworks.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              With profound expertise in the Companies Act, FEMA, SEBI Regulations, Income Tax Act, and GST laws, we provide tailored solutions that address the unique challenges of modern businesses. Our commitment is to ensure your enterprise not strictly adheres to regulatory requirements but also thrives with strategic legal support.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Located in Udaipur, Rajasthan, we serve clients across India, offering personalized attention and up-to-date advice to foster sustainable growth and minimize regulatory risks.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppAboutSection;