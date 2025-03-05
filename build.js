const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');

async function build() {
  try {
    // Read template
    const template = await fs.readFile('template.html', 'utf-8');
    const compiledTemplate = Handlebars.compile(template);

    // Build for each language
    const languages = ['en', 'ca'];
    
    for (const lang of languages) {
      // Read language content
      const content = JSON.parse(
        await fs.readFile(`content/${lang}.json`, 'utf-8')
      );

      // Add language-specific flags
      content.isEn = lang === 'en';
      content.isCa = lang === 'ca';

      // Generate HTML
      const html = compiledTemplate(content);

      // Create output directory if it doesn't exist
      const outputDir = lang === 'en' ? '.' : lang;
      await fs.mkdir(outputDir, { recursive: true });

      // Write file
      await fs.writeFile(
        path.join(outputDir, 'index.html'),
        html
      );

      console.log(`Built ${lang} version`);
    }

    // Copy static files to root directory
    await copyStaticFiles();
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

async function copyStaticFiles() {
  // Copy to root directory instead of dist
  await fs.writeFile('robots.txt', 
    'User-agent: *\n' +
    'Allow: /\n' +
    'Allow: /ca/\n\n' +
    'Sitemap: https://www.lluisingles.com/sitemap.xml\n'
  );

  await fs.writeFile('sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    '  <url>\n' +
    '    <loc>https://lluisingles.com/</loc>\n' +
    '    <lastmod>2024-03-21</lastmod>\n' +
    '    <changefreq>monthly</changefreq>\n' +
    '    <priority>1.0</priority>\n' +
    '    <xhtml:link rel="alternate" hreflang="en" href="https://lluisingles.com/"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="ca" href="https://lluisingles.com/ca/"/>\n' +
    '  </url>\n' +
    '  <url>\n' +
    '    <loc>https://lluisingles.com/ca/</loc>\n' +
    '    <lastmod>2024-03-21</lastmod>\n' +
    '    <changefreq>monthly</changefreq>\n' +
    '    <priority>0.9</priority>\n' +
    '    <xhtml:link rel="alternate" hreflang="en" href="https://lluisingles.com/"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="ca" href="https://lluisingles.com/ca/"/>\n' +
    '  </url>\n' +
    '</urlset>'
  );

  console.log('Generated static files');
}

build(); 
