// App.js
// Website for Company Secretary Siddhi Jain & Associates
// This application features a professional layout with Home, About, Services, Calculators, and Contact sections.
// It includes three specialized calculators: TDS Calculator, GST Applicability Calculator, and Input Tax Credit Availment Calculator.
// The "Search Case Laws" features in TDS and ITC calculators are simulated for demonstration purposes,
// as real-world implementation requires robust backend integration with legal databases and advanced NLP/LLM capabilities.

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import the configured Supabase client
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import routing components

// --- Page Components ---
// Import all page components
import TDSCalculatorPage from './pages/TDSCalculatorPage';
import GSTApplicabilityCalculatorPage from './pages/GSTApplicabilityCalculatorPage';
import ITCAvailmentCalculatorPage from './pages/ITCAvailmentCalculatorPage';

// Home Page Component
const HomePage = () => { // Removed setActiveSection prop as it's not directly used for scrolling now
    const [legalUpdates, setLegalUpdates] = useState([]);
    const [loadingUpdates, setLoadingUpdates] = useState(true);

    useEffect(() => {
        const fetchLegalUpdates = async () => {
            setLoadingUpdates(true);
            try {
                const { data, error } = await supabase
                    .from('Siddhi Jain Law Updates')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(3); // Fetch latest 3 updates

                if (error) {
                    throw error;
                }
                setLegalUpdates(data);
            } catch (error) {
                console.error('Error fetching legal updates:', error.message);
                // Optionally set an error state here to display a message to the user
            } finally {
                setLoadingUpdates(false);
            }
        };

        fetchLegalUpdates();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <>
            <Helmet>
                <title>Siddhi Jain & Associates | Company Secretary in Udaipur</title>
                <meta name="description" content="Siddhi Jain & Associates: Leading Company Secretaries in Udaipur offering expert services in Corporate Law, Secretarial Compliance, FEMA, RBI, Startup India, and Corporate Advisory." />
                <link rel="canonical" href="https://www.cssiddhijain.com/" /> {/* IMPORTANT: Replace with your actual live domain */}
            </Helmet>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 to-black text-white h-screen flex items-center justify-center p-4">
                <div className="text-center z-10 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 animate-slide-in-top">
                        <span className="text-teal-400">Siddhi Jain</span> & Associates
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-in-bottom animation-delay-200">
                        Your Partner in Corporate Law & Secretarial Compliance
                    </p>
                    <a // Changed to <a> tag for hash navigation
                        href="#contact-section" // Link to the contact section ID
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in animation-delay-400"
                    >
                        Get in Touch
                    </a>
                </div>
                {/* Background overlay for visual effect */}
                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            </section>

            {/* About Section (brief) */}
            <section id="about-section" className="py-16 px-4 md:px-8 bg-gray-100"> {/* Added ID for navigation */}
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-up">About Us</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8 animate-fade-in-up animation-delay-200">
                        Siddhi Jain & Associates is a leading firm of Company Secretaries based in Udaipur, dedicated to providing comprehensive corporate law, secretarial compliance, and advisory services. We empower businesses with strategic legal and compliance solutions, ensuring seamless operations and sustainable growth.
                    </p>
                    <a // Changed to <a> tag for hash navigation
                        href="#about-section" // Link to the about section ID
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up animation-delay-400"
                    >
                        Learn More
                    </a>
                </div>
            </section>

            {/* Services Section (brief overview) */}
            <section id="services-section" className="py-16 px-4 md:px-8 bg-white"> {/* Added ID for navigation */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-12 animate-fade-in-up">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ServiceCard
                            title="Corporate Law & Compliance"
                            description="Expert guidance on Companies Act, secretarial audits, board meetings, and regulatory filings."
                            icon="🏢"
                        />
                        <ServiceCard
                            title="FEMA & RBI Matters"
                            description="Advisory and compliance services for foreign exchange laws and RBI regulations."
                            icon="💰"
                        />
                        <ServiceCard
                            title="Startup India Advisory"
                            description="Comprehensive support for startups, from incorporation to funding compliance."
                            icon="🚀"
                        />
                        <ServiceCard
                            title="Intellectual Property Rights"
                            description="Assistance with trademark, copyright, and patent registration and protection."
                            icon="💡"
                        />
                        <ServiceCard
                            title="Legal Due Diligence"
                            description="Thorough examination of legal records to identify risks and ensure compliance."
                            icon="⚖️"
                        />
                        <ServiceCard
                            title="NCLT & Tribunal Matters"
                            description="Representation and advisory for cases before NCLT and other tribunals."
                            icon="🏛️"
                        />
                    </div>
                    <div className="text-center mt-12">
                        <a // Changed to <a> tag for hash navigation
                            href="#services-section" // Link to the services section ID
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up animation-delay-200"
                        >
                            View All Services
                        </a>
                    </div>
                </div>
            </section>

            {/* Latest Legal Updates Section */}
            <section id="legal-updates" className="py-16 px-4 md:px-8 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-12 animate-fade-in-up">Latest Legal Updates</h2>
                    {loadingUpdates ? (
                        <p className="text-center text-lg text-gray-600">Loading latest updates...</p>
                    ) : legalUpdates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {legalUpdates.map((update) => (
                                <div key={update.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{update.title}</h3>
                                    <p className="text-gray-700 text-sm mb-3">{new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-gray-700 mb-4 line-clamp-3">{update.summary}</p>
                                    {update.link && (
                                        <a href={update.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">Read More &rarr;</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-600">No legal updates available at the moment.</p>
                    )}
                    {/* Optional: Button to view all updates if you create a dedicated page */}
                    {legalUpdates.length > 0 && (
                        <div className="text-center mt-12">
                            {/* If you create a /legal-updates page, change this to <Link to="/legal-updates"> */}
                            <a href="#top" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
                                View All Updates
                            </a>
                        </div>
                    )}
                </div>
            </section>


            {/* Testimonials or Call to Action */}
            <section id="contact-section" className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-16 px-4 text-center"> {/* Added ID for navigation */}
                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
                <p className="text-xl mb-8">Let us handle your compliance complexities, so you can focus on growth.</p>
                <a // Changed to <a> tag for hash navigation
                    href="#contact-section" // Link to the contact section ID (can be same as hero if desired)
                    className="bg-white text-teal-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                >
                    Contact Our Experts
                </a>
            </section>
        </>
    );
};

// Service Card Component for reusability
const ServiceCard = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
    </div>
);

// About Page Component
const AboutPage = () => (
    <>
        <Helmet>
            <title>About Us | Siddhi Jain & Associates - Company Secretaries</title>
            <meta name="description" content="Learn about Siddhi Jain & Associates, a leading Company Secretary firm in Udaipur. Our mission, vision, and commitment to excellence in corporate compliance and advisory." />
            <link rel="canonical" href="https://www.cssiddhijain.com/about" /> {/* IMPORTANT: Replace with your actual live domain */}
        </Helmet>
        <section className="bg-gradient-to-r from-blue-700 to-purple-800 text-white py-16 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">About Siddhi Jain & Associates</h1>
            <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
                Building Trust Through Compliance and Expert Advisory
            </p>
        </section>

        <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Our Journey & Philosophy</h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    Siddhi Jain & Associates stands as a beacon of excellence in the realm of corporate legal and secretarial services. Founded with a vision to simplify complex compliance landscapes for businesses, we have grown to be a trusted partner for numerous clients across various industries. Our philosophy is rooted in proactive compliance, strategic advisory, and unwavering commitment to client success.
                </p>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    We believe that robust compliance is not just a legal obligation but a foundation for sustainable business growth. By staying abreast of the latest regulatory changes and leveraging our deep expertise, we provide insightful solutions that mitigate risks and create opportunities for our clients.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2">Our Mission</h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    To empower businesses with seamless, efficient, and proactive corporate law and secretarial compliance services, fostering an environment of legal certainty and growth.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2">Our Vision</h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    To be the most trusted and sought-after corporate advisory firm, recognized for our ethical practices, professional excellence, and significant contribution to our clients' success.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2">Our Core Values</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-6">
                    <li>**Integrity:** Upholding the highest ethical standards in all our dealings.</li>
                    <li>**Excellence:** Delivering services with utmost precision, quality, and professionalism.</li>
                    <li>**Client-Centricity:** Prioritizing client needs and building lasting relationships through tailored solutions.</li>
                    <li>**Innovation:** Continuously evolving our practices to embrace new technologies and regulatory landscapes.</li>
                    <li>**Knowledge:** Fostering a culture of continuous learning and expertise development.</li>
                </ul>
            </div>
        </section>
    </>
);

// Services Page Component (Detailed)
const ServicesPage = () => (
    <>
        <Helmet>
            <title>Our Services | Corporate Law & Secretarial Compliance - Siddhi Jain & Associates</title>
            <meta name="description" content="Explore comprehensive corporate law, secretarial, FEMA, RBI, IPR, and NCLT services offered by Siddhi Jain & Associates to support your business compliance and growth." />
            <link rel="canonical" href="https://www.cssiddhijain.com/services" /> {/* IMPORTANT: Replace with your actual live domain */}
        </Helmet>
        <section className="bg-gradient-to-r from-green-700 to-teal-800 text-white py-16 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">Our Comprehensive Services</h1>
            <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
                Tailored Solutions for Your Business Compliance and Growth
            </p>
        </section>

        <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DetailedServiceCard
                        title="Corporate Law & Secretarial Compliance"
                        items={[
                            "Company/LLP Incorporation & Registration",
                            "Annual Filings & Compliances under Companies Act, 2013",
                            "Maintenance of Statutory Records",
                            "Drafting of Board Resolutions, Minutes, Notices",
                            "Corporate Governance Advisory",
                            "Secretarial Audit & Due Diligence"
                        ]}
                        icon="🏢"
                    />
                    <DetailedServiceCard
                        title="FEMA & RBI Matters"
                        items={[
                            "Overseas Direct Investment (ODI)",
                            "Foreign Direct Investment (FDI) in India",
                            "External Commercial Borrowings (ECB)",
                            "Liaison/Branch/Project Office Setup",
                            "Compounding of Contraventions under FEMA",
                            "RBI Approvals & Reporting"
                        ]}
                        icon="💰"
                    />
                    <DetailedServiceCard
                        title="Startup India Advisory & Registration"
                        items={[
                            "Startup Recognition under DPIIT",
                            "Advisory on Startup Benefits & Schemes",
                            "Funding Compliances & Documentation",
                            "ESOP Structuring & Implementation",
                            "IPR Protection for Startups"
                        ]}
                        icon="🚀"
                    />
                    <DetailedServiceCard
                        title="Intellectual Property Rights (IPR)"
                        items={[
                            "Trademark Registration & Protection",
                            "Copyright Registration",
                            "Patent Filing Assistance",
                            "IPR Due Diligence",
                            "IPR Licensing & Assignment"
                        ]}
                        icon="💡"
                    />
                    <DetailedServiceCard
                        title="Legal Due Diligence & Advisory"
                        items={[
                            "Pre-acquisition Due Diligence",
                            "Compliance Due Diligence",
                            "Contract Drafting & Review",
                            "Legal Opinion & Advisory",
                            "Corporate Restructuring Advisory"
                        ]}
                        icon="⚖️"
                    />
                    <DetailedServiceCard
                        title="NCLT & Other Tribunal Matters"
                        items={[
                            "Representation before NCLT/NCLAT",
                            "Mergers, Amalgamations & Demergers",
                            "Insolvency & Bankruptcy Code (IBC) Advisory",
                            "Compromises & Arrangements",
                            "Appearance before various regulatory authorities (ROC, RD, OL, SEBI)"
                        ]}
                        icon="🏛️"
                    />
                </div>
            </div>
        </section>
    </>
);

// Detailed Service Card Component
const DetailedServiceCard = ({ title, items, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up">
        <div className="text-5xl text-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center border-b pb-2">{title}</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
);

// Contact Page Component
const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'submitting'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        try {
            const { error } = await supabase
                .from('contacts')
                .insert([
                    { name: formData.name, email: formData.email, message: formData.message },
                ]);

            if (error) {
                throw error;
            }
            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' }); // Clear form
        } catch (error) {
            console.error('Error submitting contact form:', error.message);
            setSubmitStatus('error');
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | Get in Touch with Siddhi Jain & Associates</title>
                <meta name="description" content="Reach out to Siddhi Jain & Associates for expert corporate law and secretarial compliance services. Contact us today for consultations." />
                <link rel="canonical" href="https://www.cssiddhijain.com/contact" /> {/* IMPORTANT: Replace with your actual live domain */}
            </Helmet>
            <section className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">Contact Us</h1>
                <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
                    We're here to help. Reach out for consultations and expert advice.
                </p>
            </section>

            <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 rounded-md"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 rounded-md"
                                placeholder="Your Email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 rounded-md"
                                placeholder="Your Message"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className={`bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 rounded-md ${submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={submitStatus === 'submitting'}
                        >
                            {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>
                        {submitStatus === 'success' && (
                            <p className="text-green-600 mt-4 text-center font-semibold">Message sent successfully!</p>
                        )}
                        {submitStatus === 'error' && (
                            <p className="text-red-600 mt-4 text-center font-semibold">Failed to send message. Please try again later.</p>
                        )}
                    </form>

                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Office</h3>
                        <p className="text-lg text-gray-700 mb-2">
                            <span className="font-semibold">Siddhi Jain & Associates</span><br />
                            22/E Aashirvad Nagar University Road<br />
                            Udaipur, Rajasthan-313001
                        </p>
                        <p className="text-lg text-gray-700 mb-2">
                            Email: <a href="mailto:fcssiddhijain@gmail.com" className="text-orange-600 hover:underline">fcssiddhijain@gmail.com</a>
                        </p>
                        <p className="text-lg text-gray-700">
                            Phone: <a href="tel:+918454079700" className="text-orange-600 hover:underline">+91 8454079700</a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};


// New Calculators Page Component
const CalculatorsPage = () => {
    return (
        <>
            <Helmet>
                <title>GST & TDS Calculators Online | Tax Tools - Siddhi Jain & Associates</title>
                <meta name="description" content="Access free online GST and TDS calculators by Siddhi Jain & Associates. Tools to determine GST applicability, ITC eligibility, and TDS deductions." />
                <link rel="canonical" href="https://www.cssiddhijain.com/calculators" /> {/* IMPORTANT: Replace with your actual live domain */}
            </Helmet>
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">Our Calculators</h1>
                <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
                    Simplify your tax and compliance calculations with our free online tools.
                </p>
            </section>

            <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choose a Calculator</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CalculatorLinkCard
                            title="TDS Calculator"
                            description="Calculate TDS (Tax Deducted at Source) on various payments as per Income Tax Act, 1961."
                            link="/calculators/tds"
                            icon="📊"
                        />
                        <CalculatorLinkCard
                            title="GST Applicability Calculator"
                            description="Determine GST type (CGST/SGST/IGST), Place of Supply, and Reverse Charge Mechanism for transactions."
                            link="/calculators/gst-applicability"
                            icon="🧾"
                        />
                        <CalculatorLinkCard
                            title="ITC Availment Calculator"
                            description="Check Input Tax Credit (ITC) eligibility and understand blocked credits under GST."
                            link="/calculators/itc-availment"
                            icon="💡"
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

const CalculatorLinkCard = ({ title, description, link, icon }) => {
    return (
        <Link to={link} className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition duration-300 ease-in-out h-full">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 flex-grow">{description}</p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">
                    Use Calculator
                </button>
            </div>
        </Link>
    );
};


function App() {
    // setActiveSection is largely superseded by react-router-dom for full page navigation
    // but kept for potential hash-based scrolling on home page and mobile menu state management.
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // The useEffect for hash change is now less critical since primary navigation is via Router Link/navigate
    // but can be kept for direct hash links or initial load behavior if desired.
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                // For internal section scrolling, we might still want to track active section
                // This might need refinement if you want active styling for sections on the home page when scrolled
                // For now, it mainly reflects the hash.
                setActiveSection(hash);
            } else if (window.location.pathname === '/') {
                setActiveSection('home');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Call on mount
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);


    return (
        <div className="min-h-screen flex flex-col">
            <HelmetProvider>
                {/* Navigation Bar */}
                <nav className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
                    <div className="container mx-auto flex justify-between items-center flex-wrap">
                        <Link to="/" className="flex items-center text-2xl font-bold text-teal-400 hover:text-teal-300 transition duration-200" onClick={() => { setIsMobileMenuOpen(false); }}>
                            {/* Logo: Make sure cs-logo.png is in your public folder */}
                            <img src="/cs-logo.png" alt="CS Logo" className="h-8 w-auto mr-3 object-contain" />
                            Siddhi Jain & Associates
                        </Link>

                        <div className="block md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-white focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                                </svg>
                            </button>
                        </div>

                        <div
                            className={`w-full md:flex md:items-center md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                        >
                            {/* Use Link components for routing, and navigate + setActiveSection for visual highlighting/mobile menu close */}
                            <Link
                                to="/"
                                className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                                    ${activeSection === 'home' ? 'text-indigo-300 font-semibold' : ''}`}
                                onClick={() => { setActiveSection('home'); setIsMobileMenuOpen(false); }}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                                    ${activeSection === 'about' ? 'text-indigo-300 font-semibold' : ''}`}
                                onClick={() => { setActiveSection('about'); setIsMobileMenuOpen(false); }}
                            >
                                About
                            </Link>
                            <Link
                                to="/services"
                                className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                                    ${activeSection === 'services' ? 'text-indigo-300 font-semibold' : ''}`}
                                onClick={() => { setActiveSection('services'); setIsMobileMenuOpen(false); }}
                            >
                                Services
                            </Link>
                            {/* Calculators Link */}
                            <Link
                                to="/calculators"
                                className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                                    ${activeSection === 'calculators' ? 'text-indigo-300 font-semibold' : ''}`}
                                onClick={() => { setActiveSection('calculators'); setIsMobileMenuOpen(false); }}
                            >
                                Calculators
                            </Link>
                            <Link
                                to="/contact"
                                className={`block md:inline-block mt-2 md:mt-0 ml-0 md:ml-6 py-2 px-3 rounded hover:bg-gray-700 transition duration-200
                                    ${activeSection === 'contact' ? 'text-indigo-300 font-semibold' : ''}`}
                                onClick={() => { setActiveSection('contact'); setIsMobileMenuOpen(false); }}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main content area managed by react-router-dom */}
                <main className="flex-grow">
                    <Routes>
                        {/* Ensure home page has a base path. We don't use setActiveSection for route changes, only for styling/mobile menu */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/calculators" element={<CalculatorsPage />} />
                        <Route path="/calculators/tds" element={<TDSCalculatorPage />} />
                        <Route path="/calculators/gst-applicability" element={<GSTApplicabilityCalculatorPage />} />
                        <Route path="/calculators/itc-availment" element={<ITCAvailmentCalculatorPage />} />
                        {/* Fallback for unknown routes - could be a 404 page */}
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white p-8 text-center mt-auto">
                    <div className="container mx-auto px-4">
                        <p className="text-sm">&copy; {new Date().getFullYear()} Siddhi Jain & Associates. All rights reserved.</p>
                        <p className="text-xs mt-2 opacity-75">Professional Compliance. Strategic Advisory.</p>
                    </div>
                </footer>

                {/* Global styles for smooth scrolling and base font */}
                <style>{`
                    html {
                        scroll-behavior: smooth;
                    }
                    body {
                        font-family: 'Inter', sans-serif;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slide-in-top {
                        from { opacity: 0; transform: translateY(-50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slide-in-bottom {
                        from { opacity: 0; transform: translateY(50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                    .animate-fade-in-up { animation: fade-in 0.8s ease-out forwards; }
                    .animate-slide-in-top { animation: slide-in-top 0.8s ease-out forwards; }
                    .animate-slide-in-bottom { animation: slide-in-bottom 0.8s ease-out forwards; }
                    .animation-delay-200 { animation-delay: 0.2s; }
                    .animation-delay-400 { animation-delay: 0.4s; }
                `}</style>
            </HelmetProvider>
        </div>
    );
}

// Wrap App with Router for routing to work
const RootApp = () => (
    <Router>
        <App />
    </Router>
);

export default RootApp;