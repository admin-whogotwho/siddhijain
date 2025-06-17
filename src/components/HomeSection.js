// src/components/HomeSection.js

import React from 'react'; // Make sure React is imported
import { Link } from 'react-router-dom'; // Import Link for navigation
// No need to import Helmet here for the HomeSection,
// as its primary meta tags are handled by public/index.html

// If LegalUpdates is a separate component, ensure it's imported:
// import LegalUpdates from './LegalUpdates'; // Adjust path if necessary

const HomeSection = () => {
  // If you had any useState or useEffect specific to the HomeSection here in your App.backup.js,
  // you would paste them here.

  return (
    <>
      {/* REMOVED HELMET: The main homepage meta tags are handled by public/index.html */}

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
          {/* Changed button to Link from react-router-dom */}
          <Link
            to="/services" // This is the route for your Services page
            className="bg-white text-indigo-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Explore Our Expertise
          </Link>
          {/* Ensure LegalUpdates component is imported at the top if it's a separate file */}
          {/* If LegalUpdates was also defined inline in App.backup.js, we'll need to extract it to its own file too */}
          <LegalUpdates />
        </div>
      </section>
    </>
  );
};

export default HomeSection;