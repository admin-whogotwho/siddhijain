const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

const hostname = 'https://www.cssiddhijain.com';

const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/services', changefreq: 'monthly', priority: 0.9 },
  { url: '/calculators', changefreq: 'monthly', priority: 0.8 },
  { url: '/calculators/gst', changefreq: 'monthly', priority: 0.9 },
  { url: '/calculators/income-tax', changefreq: 'monthly', priority: 0.9 },
  { url: '/calculators/gst-place-of-supply', changefreq: 'monthly', priority: 0.9 },
  { url: '/calculators/gst-import', changefreq: 'monthly', priority: 0.8 },
  { url: '/calculators/gst-export', changefreq: 'monthly', priority: 0.8 },
  { url: '/calculators/gst-blocked-itc', changefreq: 'monthly', priority: 0.9 },
  { url: '/calculators/tds', changefreq: 'monthly', priority: 0.8 },
  { url: '/calculators/gst-applicability', changefreq: 'monthly', priority: 0.8 },
  { url: '/calculators/itc-availment', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
];

async function generateSitemap() {
  const smStream = new SitemapStream({ hostname });
  urls.forEach(item => smStream.write(item));
  smStream.end();
  const xml = await streamToPromise(smStream).then(data => data.toString());
  fs.writeFileSync(path.resolve(__dirname, 'public', 'sitemap.xml'), xml);
  console.log('Sitemap generated successfully in public/sitemap.xml');
}

generateSitemap().catch(console.error);