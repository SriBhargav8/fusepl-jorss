import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SOURCE_DIR = path.join(process.cwd(), 'src/content/guides/sources');
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/guides/pages');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function processFiles() {
  const files = fs.readdirSync(SOURCE_DIR);
  
  files.forEach(file => {
    if (!file.endsWith('.md')) return;
    
    console.log(`Processing ${file}...`);
    const filePath = path.join(SOURCE_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split by ---PAGE-BREAK---
    const pages = content.split('---PAGE-BREAK---');
    
    pages.forEach(page => {
      const trimmedPage = page.trim();
      if (!trimmedPage) return;
      
      try {
        const { data } = matter(trimmedPage);
        const slug = data.slug;
        
        if (!slug) {
          console.error(`Missing slug in page: ${data.title || 'Untitled'}`);
          return;
        }
        
        const outputPath = path.join(OUTPUT_DIR, `${slug}.md`);
        fs.writeFileSync(outputPath, trimmedPage);
        console.log(`  Generated: ${slug}.md`);
      } catch (err) {
        console.error(`Error parsing page in ${file}:`, err.message);
      }
    });
  });
}

processFiles();
console.log('Done!');
