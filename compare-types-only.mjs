/**
 * compare-types-only.mjs
 * Compares ONLY the type definitions from both generators
 * Ignores client/runtime code since @hey-api can be configured to skip those
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

function printHeader(text) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}${'='.repeat(80)}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}${text}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}${'='.repeat(80)}${COLORS.reset}\n`);
}

function printSection(text) {
  console.log(`\n${COLORS.bright}${COLORS.blue}${text}${COLORS.reset}`);
  console.log(`${COLORS.blue}${'-'.repeat(80)}${COLORS.reset}`);
}

function analyzeTypeStructure(content, generatorName) {
  const analysis = {
    interfaces: (content.match(/export interface \w+/g) || []).length,
    types: (content.match(/export type \w+/g) || []).length,
    enums: (content.match(/export enum \w+/g) || []).length,
    schemas: 0,
    paths: 0,
  };

  // Check for specific patterns
  if (content.includes('export interface paths')) {
    analysis.paths = 1;
  }
  if (content.includes('export interface components')) {
    analysis.schemas = 1;
  }

  return analysis;
}

function extractSample(content, pattern, context = 300) {
  const match = content.match(pattern);
  if (match) {
    const index = match.index;
    return content.substring(index, index + context);
  }
  return null;
}

function main() {
  printHeader('Type Definitions Comparison (Types Only)');

  console.log(`${COLORS.yellow}Note:${COLORS.reset} This comparison focuses on TYPE DEFINITIONS only.`);
  console.log(`${COLORS.yellow}      Both tools can generate types, but @hey-api also generates client code.${COLORS.reset}`);
  console.log(`${COLORS.yellow}      We're comparing the types output to types output.${COLORS.reset}\n`);

  const openapiTypesFile = 'output-openapi-typescript/types.ts';
  const heyApiTypesFile = 'output-hey-api/types.gen.ts';

  // Analyze openapi-typescript
  printSection('1. openapi-typescript Type Definitions');
  const openapiStats = getFileStats(openapiTypesFile);
  
  if (!openapiStats.exists) {
    console.log(`${COLORS.yellow}⚠ File not found. Run: npm run gen:openapi-typescript${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}File:${COLORS.reset} types.ts`);
    console.log(`${COLORS.green}Size:${COLORS.reset} ${formatBytes(openapiStats.size)}`);
    console.log(`${COLORS.green}Lines:${COLORS.reset} ${openapiStats.lines.toLocaleString()}`);
    
    const structure = analyzeTypeStructure(openapiStats.content, 'openapi-typescript');
    console.log(`\n${COLORS.bright}Type Structure:${COLORS.reset}`);
    console.log(`  Interfaces: ${structure.interfaces}`);
    console.log(`  Types: ${structure.types}`);
    console.log(`  Enums: ${structure.enums}`);
    
    console.log(`\n${COLORS.bright}Organization:${COLORS.reset}`);
    console.log(`  ✓ Paths-based structure (maps to OpenAPI paths)`);
    console.log(`  ✓ Components-based structure (schemas, responses, etc.)`);
    console.log(`  ✓ Uses TypeScript interfaces and type references`);
    
    console.log(`\n${COLORS.bright}Sample (first 40 lines):${COLORS.reset}\n`);
    const preview = openapiStats.content.split('\n').slice(0, 40).join('\n');
    console.log(preview);
  }

  // Analyze @hey-api/openapi-ts
  printSection('2. @hey-api/openapi-ts Type Definitions');
  const heyApiStats = getFileStats(heyApiTypesFile);
  
  if (!heyApiStats.exists) {
    console.log(`${COLORS.yellow}⚠ File not found. Run: npm run gen:hey-api${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}File:${COLORS.reset} types.gen.ts`);
    console.log(`${COLORS.green}Size:${COLORS.reset} ${formatBytes(heyApiStats.size)}`);
    console.log(`${COLORS.green}Lines:${COLORS.reset} ${heyApiStats.lines.toLocaleString()}`);
    
    const structure = analyzeTypeStructure(heyApiStats.content, '@hey-api/openapi-ts');
    console.log(`\n${COLORS.bright}Type Structure:${COLORS.reset}`);
    console.log(`  Interfaces: ${structure.interfaces}`);
    console.log(`  Types: ${structure.types}`);
    console.log(`  Enums: ${structure.enums}`);
    
    console.log(`\n${COLORS.bright}Organization:${COLORS.reset}`);
    console.log(`  ✓ Flat structure (all types at root level)`);
    console.log(`  ✓ Schema-based types (direct from OpenAPI schemas)`);
    console.log(`  ✓ Request/Response types for each endpoint`);
    
    console.log(`\n${COLORS.bright}Sample (first 40 lines):${COLORS.reset}\n`);
    const preview = heyApiStats.content.split('\n').slice(0, 40).join('\n');
    console.log(preview);
  }

  // Comparison
  if (openapiStats.exists && heyApiStats.exists) {
    printSection('3. Type Definitions Comparison');
    
    const openapiStructure = analyzeTypeStructure(openapiStats.content, 'openapi-typescript');
    const heyApiStructure = analyzeTypeStructure(heyApiStats.content, '@hey-api/openapi-ts');
    
    console.log(`\n${COLORS.bright}File Size:${COLORS.reset}`);
    console.log(`  openapi-typescript:     ${formatBytes(openapiStats.size).padEnd(12)} (${openapiStats.lines.toLocaleString()} lines)`);
    console.log(`  @hey-api/openapi-ts:    ${formatBytes(heyApiStats.size).padEnd(12)} (${heyApiStats.lines.toLocaleString()} lines)`);
    const sizeDiff = heyApiStats.size - openapiStats.size;
    const linesDiff = heyApiStats.lines - openapiStats.lines;
    console.log(`  Difference:             ${sizeDiff > 0 ? '+' : ''}${formatBytes(sizeDiff).padEnd(12)} (${linesDiff > 0 ? '+' : ''}${linesDiff.toLocaleString()} lines)`);
    
    console.log(`\n${COLORS.bright}Type Counts:${COLORS.reset}`);
    console.log(`                          openapi-typescript    @hey-api/openapi-ts`);
    console.log(`  Interfaces:             ${String(openapiStructure.interfaces).padEnd(21)} ${heyApiStructure.interfaces}`);
    console.log(`  Types:                  ${String(openapiStructure.types).padEnd(21)} ${heyApiStructure.types}`);
    console.log(`  Enums:                  ${String(openapiStructure.enums).padEnd(21)} ${heyApiStructure.enums}`);

    printSection('4. Key Differences in Type Generation');
    console.log(`
${COLORS.bright}openapi-typescript:${COLORS.reset}
  ${COLORS.green}✓${COLORS.reset} Path-based structure: types organized by endpoint paths
  ${COLORS.green}✓${COLORS.reset} Nested type references: follows OpenAPI structure exactly
  ${COLORS.green}✓${COLORS.reset} Uses TypeScript 'interface' for objects
  ${COLORS.green}✓${COLORS.reset} Access types via paths: ${COLORS.cyan}paths['/api/v5/Voyage']['post']${COLORS.reset}
  ${COLORS.green}✓${COLORS.reset} More verbose but explicit structure

${COLORS.bright}@hey-api/openapi-ts:${COLORS.reset}
  ${COLORS.green}✓${COLORS.reset} Flat structure: all types at root level
  ${COLORS.green}✓${COLORS.reset} Direct schema types: easier to import and use
  ${COLORS.green}✓${COLORS.reset} Uses TypeScript 'type' for objects
  ${COLORS.green}✓${COLORS.reset} Access types directly: ${COLORS.cyan}BulkVoyageCreateDto${COLORS.reset}
  ${COLORS.green}✓${COLORS.reset} More concise with less nesting

${COLORS.yellow}Both approaches are valid - it's a matter of preference!${COLORS.reset}
    `);

    printSection('5. Type Usage Examples');
    console.log(`
${COLORS.bright}Using openapi-typescript types:${COLORS.reset}
${COLORS.cyan}import type { paths } from './output-openapi-typescript/types';

type CreateVoyageRequest = 
  paths['/api/v5/Voyage/Bulk/Create']['post']['requestBody']['content']['application/json'];

type CreateVoyageResponse = 
  paths['/api/v5/Voyage/Bulk/Create']['post']['responses']['202']['content']['application/json'];

const data: CreateVoyageRequest = [{ pol: 'OSL', pod: 'CPH', ... }];${COLORS.reset}

${COLORS.bright}Using @hey-api/openapi-ts types:${COLORS.reset}
${COLORS.cyan}import type { BulkVoyageCreateDto, BulkVoyageResponseDto } from './output-hey-api/types.gen';

const data: BulkVoyageCreateDto[] = [{ pol: 'OSL', pod: 'CPH', ... }];
const response: BulkVoyageResponseDto = await createVoyage(data);${COLORS.reset}

${COLORS.yellow}The @hey-api approach is more direct for schema types.
The openapi-typescript approach gives you the full request/response context.${COLORS.reset}
    `);

    printSection('6. Type Safety Comparison');
    console.log(`
${COLORS.bright}Both generators provide excellent type safety:${COLORS.reset}

${COLORS.green}✓${COLORS.reset} Full TypeScript type inference
${COLORS.green}✓${COLORS.reset} Required vs optional properties
${COLORS.green}✓${COLORS.reset} Enum values for constrained strings
${COLORS.green}✓${COLORS.reset} Nullable types (string | null)
${COLORS.green}✓${COLORS.reset} Array types with proper item types
${COLORS.green}✓${COLORS.reset} Nested object types

${COLORS.bright}The main difference is organization, not type safety.${COLORS.reset}
    `);
  }

  printSection('7. Summary');
  console.log(`
${COLORS.bright}Type Generation Comparison:${COLORS.reset}

${COLORS.cyan}openapi-typescript:${COLORS.reset}
  • Generates ~${openapiStats.exists ? formatBytes(openapiStats.size) : 'N/A'} of type definitions
  • Path-centric organization (mirrors OpenAPI spec structure)
  • Best for: Full context of request/response per endpoint
  
${COLORS.cyan}@hey-api/openapi-ts:${COLORS.reset}
  • Generates ~${heyApiStats.exists ? formatBytes(heyApiStats.size) : 'N/A'} of type definitions  
  • Schema-centric organization (flat, easy to import)
  • Best for: Direct schema access and simpler imports

${COLORS.yellow}Note:${COLORS.reset} @hey-api generates ${heyApiStats.exists && openapiStats.exists ? 
    (((heyApiStats.size - openapiStats.size) / openapiStats.size * 100).toFixed(0)) : 'N/A'}% ${
    heyApiStats.exists && openapiStats.exists && heyApiStats.size < openapiStats.size ? 'less' : 'more'} 
type definition code, but this includes additional request/response types.

${COLORS.green}Both are excellent choices for type-safe OpenAPI integration!${COLORS.reset}
  `);

  console.log('\n');
}

main();
