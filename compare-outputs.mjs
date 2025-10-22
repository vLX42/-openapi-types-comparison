/**
 * compare-outputs.mjs
 * Shows detailed code comparison between the two generators
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
  magenta: '\x1b[35m',
};

function printHeader(text) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}${'='.repeat(80)}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}${text}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}${'='.repeat(80)}${COLORS.reset}\n`);
}

function printSection(text) {
  console.log(`\n${COLORS.bright}${COLORS.blue}${text}${COLORS.reset}`);
  console.log(`${COLORS.blue}${'-'.repeat(80)}${COLORS.reset}`);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

function showFilePreview(filePath, lines = 50) {
  const content = readFile(filePath);
  if (!content) {
    console.log(`${COLORS.yellow}File not found: ${filePath}${COLORS.reset}`);
    return;
  }

  const allLines = content.split('\n');
  const preview = allLines.slice(0, lines).join('\n');
  const totalLines = allLines.length;
  
  console.log(preview);
  
  if (totalLines > lines) {
    console.log(`${COLORS.yellow}... (${totalLines - lines} more lines)${COLORS.reset}`);
  }
}

function getAllFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else {
        files.push(path.relative(dir, fullPath));
      }
    });
  }
  
  walk(dir);
  return files.sort();
}

function main() {
  printHeader('Detailed Code Comparison: openapi-typescript vs @hey-api/openapi-ts');

  const openapiTypeScriptDir = 'output-openapi-typescript';
  const heyApiDir = 'output-hey-api';

  // Show openapi-typescript output
  printSection('1. openapi-typescript Generated Files');
  const openapiFiles = getAllFiles(openapiTypeScriptDir);
  
  if (openapiFiles.length === 0) {
    console.log(`${COLORS.yellow}⚠ No files generated. Run: npm run gen:openapi-typescript${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Files generated:${COLORS.reset}`);
    openapiFiles.forEach(file => console.log(`  - ${file}`));
    
    console.log(`\n${COLORS.bright}Preview of types.ts (first 100 lines):${COLORS.reset}\n`);
    showFilePreview(path.join(openapiTypeScriptDir, 'types.ts'), 100);
  }

  // Show @hey-api/openapi-ts output
  printSection('2. @hey-api/openapi-ts Generated Files');
  const heyApiFiles = getAllFiles(heyApiDir);
  
  if (heyApiFiles.length === 0) {
    console.log(`${COLORS.yellow}⚠ No files generated. Run: npm run gen:hey-api${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Files generated:${COLORS.reset}`);
    heyApiFiles.forEach(file => console.log(`  - ${file}`));
    
    // Show preview of key files
    const keyFiles = [
      'types.gen.ts',
      'index.ts',
      'services.gen.ts',
      'sdk.gen.ts'
    ];
    
    keyFiles.forEach(file => {
      const filePath = path.join(heyApiDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`\n${COLORS.bright}Preview of ${file} (first 50 lines):${COLORS.reset}\n`);
        showFilePreview(filePath, 50);
      }
    });
  }

  // Summary
  printSection('3. Key Observations');
  console.log(`
${COLORS.bright}openapi-typescript:${COLORS.reset}
  • Generates a single types.ts file
  • Contains TypeScript type definitions only
  • Types map directly to OpenAPI schemas
  • No runtime code, pure type definitions
  • Lightweight and minimal approach
  • You need to write your own API client

${COLORS.bright}@hey-api/openapi-ts:${COLORS.reset}
  • Generates multiple files (types, services, SDK, etc.)
  • Includes both types AND runtime client code
  • Service functions for each API endpoint
  • Ready-to-use client with proper typing
  • More opinionated structure
  • Batteries-included approach

${COLORS.yellow}Use Case Recommendations:${COLORS.reset}
  • Use ${COLORS.green}openapi-typescript${COLORS.reset} if you want minimal types and full control over client implementation
  • Use ${COLORS.green}@hey-api/openapi-ts${COLORS.reset} if you want a complete, ready-to-use API client
  `);

  console.log('\n');
}

main();
