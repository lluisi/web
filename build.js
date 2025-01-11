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
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 