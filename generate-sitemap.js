const { SitemapStream, streamToPromise } = require('sitemap'); // Corrected import
const fs = require('fs');
const path = require('path');

const hostname = 'https://www.cssiddhijain.com'; // Your website's domain

// List ALL your public-facing URLs here
// Adjust changefreq and priority based on how often content changes and its importance
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/calculators', changefreq: 'monthly', priority: 0.7 },
  { url: '/gst-calculator', changefreq: 'monthly', priority: 0.8 },
  { url: '/tds-calculator', changefreq: 'monthly', priority: 0.8 },
  { url: '/itc-calculator', changefreq: 'monthly', priority: 0.8 },
  { url: '/services', changefreq: 'monthly', priority: 0.8 },
  { url: '/company-registration', changefreq: 'monthly', priority: 0.8 },
  { url: '/compliance-services', changefreq: 'monthly', priority: 0.8 },
  { url: '/legal-advisory', changefreq: 'monthly', priority: 0.8 },
  { url: '/ip-rights', changefreq: 'monthly', priority: 0.8 },
  { url: '/nclt-matters', changefreq: 'monthly', priority: 0.8 },
  { url: '/gst-services', changefreq: 'monthly', priority: 0.8 },
  { url: '/startup-india', changefreq: 'monthly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  // Add any other specific pages that have unique URLs
];

async function generateSitemap() {
  const smStream = new SitemapStream({ hostname: hostname });

  // Add each URL to the sitemap stream
  urls.forEach(item => smStream.write(item));
  smStream.end(); // End the stream to signal that no more URLs will be added

  // Convert the stream to a Promise that resolves with the XML string
  const xml = await streamToPromise(smStream).then(data => data.toString());

  // Write the XML string to the public folder
  fs.writeFileSync(path.resolve(__dirname, 'public', 'sitemap.xml'), xml);

  console.log('Sitemap generated successfully in public/sitemap.xml');
}

// Call the async function
generateSitemap().catch(console.error); // Handle potential errors during generation