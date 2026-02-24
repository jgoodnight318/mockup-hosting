#!/usr/bin/env node
/**
 * Build script for mockup hosting system.
 * Copies mockup HTML files from business-prospector to /public/m/[business-slug]/
 * 
 * Usage: npm run build:mockups
 * 
 * This script:
 * 1. Reads generated mockup HTML files from the business-prospector project
 * 2. Organizes them into /public/m/[business-slug]/index.html structure
 * 3. Maintains a manifest for routing and analytics
 */

const fs = require('fs');
const path = require('path');

const MOCKUPS_SOURCE = path.resolve(
  process.env.HOME || '/Users/larry',
  'business-prospector/data/mockups'
);
const MOCKUPS_DEST = path.resolve(__dirname, '../public/m');
const MANIFEST_FILE = path.resolve(MOCKUPS_DEST, 'manifest.json');

// Ensure destination directory exists
if (!fs.existsSync(MOCKUPS_DEST)) {
  fs.mkdirSync(MOCKUPS_DEST, { recursive: true });
}

// Check if source directory exists
if (!fs.existsSync(MOCKUPS_SOURCE)) {
  console.log(`⚠️  Source mockups directory not found: ${MOCKUPS_SOURCE}`);
  console.log('This is normal on first build. Mockups will be added as they\'re generated.\n');
  
  // Create empty manifest
  const manifest = {
    version: '1.0',
    buildTime: new Date().toISOString(),
    mockups: [],
    total: 0
  };
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  process.exit(0);
}

// Read source mockups
const files = fs.readdirSync(MOCKUPS_SOURCE);
const htmlFiles = files.filter(f => f.endsWith('.html'));

if (htmlFiles.length === 0) {
  console.log('✓ No mockup HTML files to copy yet.');
  process.exit(0);
}

// Process each HTML file
const manifest = {
  version: '1.0',
  buildTime: new Date().toISOString(),
  mockups: [],
  total: 0
};

htmlFiles.forEach(htmlFile => {
  // Extract business slug from filename (format: {id}_{name}.html)
  const match = htmlFile.match(/^(\d+)_(.+)\.html$/);
  if (!match) {
    console.warn(`⚠️  Skipping file with unexpected format: ${htmlFile}`);
    return;
  }

  const [, businessId, businessSlug] = match;
  const slugPath = path.join(MOCKUPS_DEST, businessSlug);
  
  // Create slug directory
  if (!fs.existsSync(slugPath)) {
    fs.mkdirSync(slugPath, { recursive: true });
  }

  // Copy HTML to index.html
  const srcFile = path.join(MOCKUPS_SOURCE, htmlFile);
  const destFile = path.join(slugPath, 'index.html');
  
  try {
    fs.copyFileSync(srcFile, destFile);
    
    const stats = fs.statSync(destFile);
    manifest.mockups.push({
      slug: businessSlug,
      businessId: parseInt(businessId),
      path: `/m/${businessSlug}/`,
      file: htmlFile,
      size: stats.size,
      copiedAt: new Date().toISOString()
    });
    
    console.log(`✓ Copied mockup: /m/${businessSlug}/`);
  } catch (error) {
    console.error(`✗ Error copying mockup ${htmlFile}:`, error.message);
  }
});

// Write manifest
manifest.total = manifest.mockups.length;
fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));

console.log(`\n✓ Build complete: ${manifest.total} mockup(s) deployed`);
console.log(`📍 Manifest: ${MANIFEST_FILE}\n`);
