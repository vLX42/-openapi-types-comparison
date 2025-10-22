#!/usr/bin/env node
/**
 * view-samples.mjs
 * Shows sample code snippets from both generators for easy comparison
 */
import fs from 'fs';

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

function extractSample(content, startLine, endLine) {
  const lines = content.split('\n');
  return lines.slice(startLine - 1, endLine).join('\n');
}

function main() {
  printHeader('Code Sample Comparison');

  try {
    // Read openapi-typescript output
    const openapiContent = fs.readFileSync('output-openapi-typescript/types.ts', 'utf8');
    
    printSection('1. openapi-typescript Sample (First 40 lines)');
    console.log(extractSample(openapiContent, 1, 40));

    // Show a specific schema definition
    printSection('Sample Type Definition (openapi-typescript)');
    const schemaMatch = openapiContent.match(/export interface BulkVoyageCreateDto[\s\S]{0,500}/);
    if (schemaMatch) {
      console.log(schemaMatch[0]);
    } else {
      console.log('Looking for components/schemas definitions...');
      console.log(extractSample(openapiContent, 100, 150));
    }

  } catch (err) {
    console.log(`${COLORS.yellow}⚠ openapi-typescript output not found. Run: npm run gen:openapi-typescript${COLORS.reset}`);
  }

  try {
    // Read @hey-api/openapi-ts outputs
    const heyApiTypes = fs.readFileSync('output-hey-api/types.gen.ts', 'utf8');
    const heyApiSdk = fs.readFileSync('output-hey-api/sdk.gen.ts', 'utf8');
    
    printSection('2. @hey-api/openapi-ts Types Sample (First 40 lines)');
    console.log(extractSample(heyApiTypes, 1, 40));

    printSection('Sample Type Definition (@hey-api/openapi-ts)');
    const heySchemaMatch = heyApiTypes.match(/export type BulkVoyageCreateDto[\s\S]{0,500}/);
    if (heySchemaMatch) {
      console.log(heySchemaMatch[0]);
    } else {
      console.log('Looking for type definitions...');
      console.log(extractSample(heyApiTypes, 50, 100));
    }

    printSection('3. @hey-api/openapi-ts SDK Sample (Service Functions)');
    console.log(extractSample(heyApiSdk, 1, 50));

    printSection('Sample Service Function (@hey-api/openapi-ts)');
    console.log(extractSample(heyApiSdk, 100, 150));

  } catch (err) {
    console.log(`${COLORS.yellow}⚠ @hey-api/openapi-ts output not found. Run: npm run gen:hey-api${COLORS.reset}`);
  }

  printSection('Key Observations');
  console.log(`
${COLORS.bright}openapi-typescript:${COLORS.reset}
  • Exports TypeScript interfaces and types
  • Uses 'paths' object structure matching OpenAPI spec
  • Type-only - no executable code
  • Minimal and focused on type definitions

${COLORS.bright}@hey-api/openapi-ts:${COLORS.reset}
  • Exports types AND service functions
  • SDK class with methods for each endpoint
  • Includes runtime client code
  • Ready-to-use API client with type inference

${COLORS.yellow}To explore the full generated code:${COLORS.reset}
  ${COLORS.green}code output-openapi-typescript/types.ts${COLORS.reset}
  ${COLORS.green}code output-hey-api/types.gen.ts${COLORS.reset}
  ${COLORS.green}code output-hey-api/sdk.gen.ts${COLORS.reset}
  `);

  console.log('\n');
}

main();
