/**
 * compare-stats.mjs
 * Compares the generated output from openapi-typescript vs @hey-api/openapi-ts
 */
import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function countLines(content) {
  return content.split('\n').length;
}

function getFileStats(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      lines: countLines(content),
      content: content,
    };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function analyzeDirectory(dir) {
  const files = getAllFiles(dir);
  const stats = {
    totalFiles: files.length,
    totalSize: 0,
    totalLines: 0,
    fileTypes: {},
    files: [],
  };

  files.forEach(filePath => {
    const ext = path.extname(filePath);
    const fileStats = getFileStats(filePath);
    
    if (fileStats.exists) {
      stats.totalSize += fileStats.size;
      stats.totalLines += fileStats.lines;
      stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
      
      stats.files.push({
        path: path.relative(dir, filePath),
        size: fileStats.size,
        lines: fileStats.lines,
      });
    }
  });

  return stats;
}

function printHeader(text) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}${'='.repeat(80)}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}${text}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}${'='.repeat(80)}${COLORS.reset}\n`);
}

function printSection(text) {
  console.log(`\n${COLORS.bright}${COLORS.blue}${text}${COLORS.reset}`);
  console.log(`${COLORS.blue}${'-'.repeat(80)}${COLORS.reset}`);
}

function main() {
  printHeader('OpenAPI Code Generator Comparison');

  const openapiTypeScriptDir = 'output-openapi-typescript';
  const heyApiDir = 'output-hey-api';

  console.log(`${COLORS.yellow}Source:${COLORS.reset} swagger.json\n`);

  // Analyze openapi-typescript output
  printSection('1. openapi-typescript Output');
  const openapiStats = analyzeDirectory(openapiTypeScriptDir);
  
  if (openapiStats.totalFiles === 0) {
    console.log(`${COLORS.yellow}⚠ No files found. Run: npm run gen:openapi-typescript${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Total Files:${COLORS.reset} ${openapiStats.totalFiles}`);
    console.log(`${COLORS.green}Total Size:${COLORS.reset} ${formatBytes(openapiStats.totalSize)}`);
    console.log(`${COLORS.green}Total Lines:${COLORS.reset} ${openapiStats.totalLines.toLocaleString()}`);
    console.log(`${COLORS.green}File Types:${COLORS.reset}`, openapiStats.fileTypes);
    
    console.log(`\n${COLORS.bright}Files:${COLORS.reset}`);
    openapiStats.files.forEach(file => {
      console.log(`  - ${file.path} (${formatBytes(file.size)}, ${file.lines} lines)`);
    });
  }

  // Analyze @hey-api/openapi-ts output
  printSection('2. @hey-api/openapi-ts Output');
  const heyApiStats = analyzeDirectory(heyApiDir);
  
  if (heyApiStats.totalFiles === 0) {
    console.log(`${COLORS.yellow}⚠ No files found. Run: npm run gen:hey-api${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Total Files:${COLORS.reset} ${heyApiStats.totalFiles}`);
    console.log(`${COLORS.green}Total Size:${COLORS.reset} ${formatBytes(heyApiStats.totalSize)}`);
    console.log(`${COLORS.green}Total Lines:${COLORS.reset} ${heyApiStats.totalLines.toLocaleString()}`);
    console.log(`${COLORS.green}File Types:${COLORS.reset}`, heyApiStats.fileTypes);
    
    console.log(`\n${COLORS.bright}Files:${COLORS.reset}`);
    heyApiStats.files.forEach(file => {
      console.log(`  - ${file.path} (${formatBytes(file.size)}, ${file.lines} lines)`);
    });
  }

  // Comparison
  if (openapiStats.totalFiles > 0 && heyApiStats.totalFiles > 0) {
    printSection('3. Comparison Summary');
    
    console.log(`${COLORS.bright}File Count:${COLORS.reset}`);
    console.log(`  openapi-typescript: ${openapiStats.totalFiles}`);
    console.log(`  @hey-api/openapi-ts: ${heyApiStats.totalFiles}`);
    console.log(`  Difference: ${heyApiStats.totalFiles - openapiStats.totalFiles > 0 ? '+' : ''}${heyApiStats.totalFiles - openapiStats.totalFiles}`);
    
    console.log(`\n${COLORS.bright}Total Size:${COLORS.reset}`);
    console.log(`  openapi-typescript: ${formatBytes(openapiStats.totalSize)}`);
    console.log(`  @hey-api/openapi-ts: ${formatBytes(heyApiStats.totalSize)}`);
    const sizeDiff = heyApiStats.totalSize - openapiStats.totalSize;
    console.log(`  Difference: ${sizeDiff > 0 ? '+' : ''}${formatBytes(sizeDiff)}`);
    
    console.log(`\n${COLORS.bright}Total Lines:${COLORS.reset}`);
    console.log(`  openapi-typescript: ${openapiStats.totalLines.toLocaleString()}`);
    console.log(`  @hey-api/openapi-ts: ${heyApiStats.totalLines.toLocaleString()}`);
    console.log(`  Difference: ${heyApiStats.totalLines - openapiStats.totalLines > 0 ? '+' : ''}${(heyApiStats.totalLines - openapiStats.totalLines).toLocaleString()}`);

    printSection('4. Key Differences');
    console.log(`
${COLORS.bright}openapi-typescript:${COLORS.reset}
  ✓ Generates TypeScript types/interfaces only
  ✓ Minimal, focused on type safety
  ✓ No runtime code generation
  ✓ Use with your own fetch/axios wrapper

${COLORS.bright}@hey-api/openapi-ts:${COLORS.reset}
  ✓ Generates types AND client code
  ✓ Includes runtime client functions
  ✓ Service classes for each API endpoint
  ✓ Ready-to-use API client with type safety
    `);
  }

  printSection('5. Output Locations');
  console.log(`${COLORS.green}openapi-typescript:${COLORS.reset} ./${openapiTypeScriptDir}/`);
  console.log(`${COLORS.green}@hey-api/openapi-ts:${COLORS.reset} ./${heyApiDir}/`);
  
  console.log('\n');
}

main();
