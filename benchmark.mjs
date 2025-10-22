#!/usr/bin/env node
/**
 * benchmark.mjs
 * Benchmarks generation time and output size for both generators
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
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

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function formatTime(ms) {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function getAllFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else {
        files.push(fullPath);
      }
    });
  }
  
  walk(dir);
  return files;
}

function getDirectorySize(dir) {
  const files = getAllFiles(dir);
  let totalSize = 0;
  let totalLines = 0;
  
  files.forEach(file => {
    const stats = fs.statSync(file);
    totalSize += stats.size;
    const content = fs.readFileSync(file, 'utf8');
    totalLines += content.split('\n').length;
  });
  
  return { totalSize, totalLines, fileCount: files.length };
}

async function cleanOutputs() {
  const dirs = ['output-openapi-typescript', 'output-hey-api'];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

async function benchmarkGenerator(name, command) {
  console.log(`${COLORS.yellow}⏱  Running: ${name}${COLORS.reset}`);
  
  const startTime = performance.now();
  
  try {
    await execAsync(command);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration,
      error: null,
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: false,
      duration,
      error: error.message,
    };
  }
}

async function runBenchmark() {
  printHeader('OpenAPI Generator Benchmark (Types Only)');
  
  console.log(`${COLORS.yellow}Source:${COLORS.reset} swagger.json`);
  console.log(`${COLORS.yellow}Config:${COLORS.reset} Both generators set to types-only mode\n`);
  
  // Clean previous outputs
  console.log(`${COLORS.yellow}🧹 Cleaning previous outputs...${COLORS.reset}`);
  await cleanOutputs();
  
  // Benchmark openapi-typescript
  printSection('1. Benchmarking openapi-typescript');
  const openapiResult = await benchmarkGenerator(
    'openapi-typescript',
    'npx openapi-typescript swagger.json --output output-openapi-typescript/types.ts'
  );
  
  if (openapiResult.success) {
    console.log(`${COLORS.green}✓ Completed in ${formatTime(openapiResult.duration)}${COLORS.reset}`);
    const openapiStats = getDirectorySize('output-openapi-typescript');
    console.log(`${COLORS.green}  Files: ${openapiStats.fileCount}${COLORS.reset}`);
    console.log(`${COLORS.green}  Size: ${formatBytes(openapiStats.totalSize)}${COLORS.reset}`);
    console.log(`${COLORS.green}  Lines: ${openapiStats.totalLines.toLocaleString()}${COLORS.reset}`);
  } else {
    console.log(`${COLORS.red}✗ Failed: ${openapiResult.error}${COLORS.reset}`);
  }
  
  // Benchmark @hey-api/openapi-ts (types only)
  printSection('2. Benchmarking @hey-api/openapi-ts (types only)');
  const heyApiResult = await benchmarkGenerator(
    '@hey-api/openapi-ts --plugins @hey-api/typescript',
    'npx @hey-api/openapi-ts -i swagger.json -o output-hey-api --plugins @hey-api/typescript'
  );
  
  if (heyApiResult.success) {
    console.log(`${COLORS.green}✓ Completed in ${formatTime(heyApiResult.duration)}${COLORS.reset}`);
    const heyApiStats = getDirectorySize('output-hey-api');
    console.log(`${COLORS.green}  Files: ${heyApiStats.fileCount}${COLORS.reset}`);
    console.log(`${COLORS.green}  Size: ${formatBytes(heyApiStats.totalSize)}${COLORS.reset}`);
    console.log(`${COLORS.green}  Lines: ${heyApiStats.totalLines.toLocaleString()}${COLORS.reset}`);
  } else {
    console.log(`${COLORS.red}✗ Failed: ${heyApiResult.error}${COLORS.reset}`);
  }
  
  // Comparison
  if (openapiResult.success && heyApiResult.success) {
    const openapiStats = getDirectorySize('output-openapi-typescript');
    const heyApiStats = getDirectorySize('output-hey-api');
    
    printSection('3. Performance Comparison');
    
    console.log(`\n${COLORS.bright}Generation Time:${COLORS.reset}`);
    console.log(`  openapi-typescript:     ${formatTime(openapiResult.duration)}`);
    console.log(`  @hey-api/openapi-ts:    ${formatTime(heyApiResult.duration)}`);
    const timeDiff = heyApiResult.duration - openapiResult.duration;
    const timePercent = ((timeDiff / openapiResult.duration) * 100).toFixed(1);
    if (timeDiff > 0) {
      console.log(`  Difference:             +${formatTime(timeDiff)} (${timePercent}% slower)`);
    } else {
      console.log(`  Difference:             ${formatTime(timeDiff)} (${Math.abs(timePercent)}% faster)`);
    }
    
    console.log(`\n${COLORS.bright}Output Size:${COLORS.reset}`);
    console.log(`  openapi-typescript:     ${formatBytes(openapiStats.totalSize)}`);
    console.log(`  @hey-api/openapi-ts:    ${formatBytes(heyApiStats.totalSize)}`);
    const sizeDiff = heyApiStats.totalSize - openapiStats.totalSize;
    const sizePercent = ((sizeDiff / openapiStats.totalSize) * 100).toFixed(1);
    if (sizeDiff > 0) {
      console.log(`  Difference:             +${formatBytes(sizeDiff)} (${sizePercent}% larger)`);
    } else {
      console.log(`  Difference:             ${formatBytes(sizeDiff)} (${Math.abs(sizePercent)}% smaller)`);
    }
    
    console.log(`\n${COLORS.bright}Line Count:${COLORS.reset}`);
    console.log(`  openapi-typescript:     ${openapiStats.totalLines.toLocaleString()} lines`);
    console.log(`  @hey-api/openapi-ts:    ${heyApiStats.totalLines.toLocaleString()} lines`);
    const linesDiff = heyApiStats.totalLines - openapiStats.totalLines;
    const linesPercent = ((linesDiff / openapiStats.totalLines) * 100).toFixed(1);
    if (linesDiff > 0) {
      console.log(`  Difference:             +${linesDiff.toLocaleString()} lines (${linesPercent}% more)`);
    } else {
      console.log(`  Difference:             ${linesDiff.toLocaleString()} lines (${Math.abs(linesPercent)}% less)`);
    }
    
    console.log(`\n${COLORS.bright}File Count:${COLORS.reset}`);
    console.log(`  openapi-typescript:     ${openapiStats.fileCount} file(s)`);
    console.log(`  @hey-api/openapi-ts:    ${heyApiStats.fileCount} file(s)`);
    
    printSection('4. Winner Analysis');
    
    const fasterTool = openapiResult.duration < heyApiResult.duration ? 'openapi-typescript' : '@hey-api/openapi-ts';
    const smallerTool = openapiStats.totalSize < heyApiStats.totalSize ? 'openapi-typescript' : '@hey-api/openapi-ts';
    
    console.log(`
${COLORS.bright}Speed Winner:${COLORS.reset} ${COLORS.green}${fasterTool}${COLORS.reset}
  • Faster generation time
  • ${fasterTool === 'openapi-typescript' ? 
      `${Math.abs(timePercent)}% faster than @hey-api/openapi-ts` : 
      `${Math.abs(timePercent)}% faster than openapi-typescript`}

${COLORS.bright}Size Winner:${COLORS.reset} ${COLORS.green}${smallerTool}${COLORS.reset}
  • Smaller output size
  • ${smallerTool === 'openapi-typescript' ? 
      `${Math.abs(sizePercent)}% smaller than @hey-api/openapi-ts` : 
      `${Math.abs(sizePercent)}% smaller than openapi-typescript`}

${COLORS.bright}Conclusion:${COLORS.reset}
  • Both tools are very fast (under a few seconds)
  • Size difference is mainly due to different type organization strategies
  • Choose based on your preferred type structure, not performance
    `);
  }
  
  printSection('5. Summary');
  console.log(`
${COLORS.yellow}Note:${COLORS.reset} This benchmark measures types-only generation.
      @hey-api is configured with ${COLORS.cyan}--plugins @hey-api/typescript${COLORS.reset} for types only.

${COLORS.green}✓${COLORS.reset} Benchmark complete!
${COLORS.green}✓${COLORS.reset} Generated outputs are in output-* directories
${COLORS.green}✓${COLORS.reset} Run ${COLORS.cyan}npm run compare${COLORS.reset} to see detailed type comparison
  `);
}

// Run the benchmark
runBenchmark().catch(err => {
  console.error(`${COLORS.red}Error running benchmark:${COLORS.reset}`, err);
  process.exit(1);
});
