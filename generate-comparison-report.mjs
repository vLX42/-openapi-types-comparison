#!/usr/bin/env node
/**
 * generate-comparison-report.mjs
 * Generates a markdown report comparing the two generators
 */
import fs from 'fs';
import path from 'path';

function getFileStats(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      lines: content.split('\n').length,
      content: content,
    };
  } catch (err) {
    return { exists: false };
  }
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
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
    files: [],
  };

  files.forEach(filePath => {
    const fileStats = getFileStats(filePath);
    if (fileStats.exists) {
      stats.totalSize += fileStats.size;
      stats.totalLines += fileStats.lines;
      stats.files.push({
        path: path.relative(dir, filePath),
        size: fileStats.size,
        lines: fileStats.lines,
      });
    }
  });

  return stats;
}

function generateReport() {
  const openapiStats = analyzeDirectory('output-openapi-typescript');
  const heyApiStats = analyzeDirectory('output-hey-api');

  const report = `# OpenAPI Generator Comparison Report

Generated: ${new Date().toISOString()}

## Source

- **Input File**: swagger.json
- **API**: MVS Api 5.0
- **OpenAPI Version**: 3.0.4

---

## 1. openapi-typescript

**Purpose**: Type-only generator for OpenAPI specifications

### Statistics

| Metric | Value |
|--------|-------|
| Total Files | ${openapiStats.totalFiles} |
| Total Size | ${(openapiStats.totalSize / 1024).toFixed(2)} KB |
| Total Lines | ${openapiStats.totalLines.toLocaleString()} |

### Generated Files

${openapiStats.files.map(f => `- \`${f.path}\` (${(f.size / 1024).toFixed(2)} KB, ${f.lines.toLocaleString()} lines)`).join('\n')}

### Characteristics

- ✅ **Pure TypeScript types** - No runtime code
- ✅ **Single file output** - Easy to manage
- ✅ **Minimal footprint** - Smallest possible output
- ✅ **Direct schema mapping** - Types match OpenAPI schemas exactly
- ❌ **No client code** - You must implement your own API client
- ❌ **No service functions** - Manual endpoint implementation required

### Use Cases

Best suited for:
- Projects with existing API client infrastructure
- Teams that want full control over HTTP client implementation
- Microservices where you only need type safety
- Library authors who want minimal dependencies

---

## 2. @hey-api/openapi-ts

**Purpose**: Complete client generator with types and runtime code

### Statistics

| Metric | Value |
|--------|-------|
| Total Files | ${heyApiStats.totalFiles} |
| Total Size | ${(heyApiStats.totalSize / 1024).toFixed(2)} KB |
| Total Lines | ${heyApiStats.totalLines.toLocaleString()} |

### Generated Files

${heyApiStats.files.map(f => `- \`${f.path}\` (${(f.size / 1024).toFixed(2)} KB, ${f.lines.toLocaleString()} lines)`).join('\n')}

### Characteristics

- ✅ **Complete client** - Ready-to-use API client out of the box
- ✅ **Service functions** - Auto-generated functions for each endpoint
- ✅ **Type safety** - Full TypeScript support with inference
- ✅ **Request/Response types** - Complete type coverage
- ❌ **Larger footprint** - More generated code
- ❌ **More opinionated** - Specific client structure

### Use Cases

Best suited for:
- New projects starting from scratch
- Teams that want to move fast with minimal boilerplate
- Applications that need a complete API client solution
- Projects without existing API client patterns

---

## 3. Side-by-Side Comparison

| Feature | openapi-typescript | @hey-api/openapi-ts |
|---------|-------------------|---------------------|
| **Files Generated** | ${openapiStats.totalFiles} | ${heyApiStats.totalFiles} |
| **Total Size** | ${(openapiStats.totalSize / 1024).toFixed(2)} KB | ${(heyApiStats.totalSize / 1024).toFixed(2)} KB |
| **Total Lines** | ${openapiStats.totalLines.toLocaleString()} | ${heyApiStats.totalLines.toLocaleString()} |
| **Runtime Code** | ❌ No | ✅ Yes |
| **Service Functions** | ❌ No | ✅ Yes |
| **Client Implementation** | Manual | Auto-generated |
| **Customization** | Full | Limited |
| **Learning Curve** | Low | Medium |
| **Maintenance** | Low | Low |

---

## 4. Code Structure Comparison

### openapi-typescript Structure

\`\`\`
output-openapi-typescript/
└── types.ts          # All TypeScript type definitions
\`\`\`

**Philosophy**: Provide types, let developers choose implementation

### @hey-api/openapi-ts Structure

\`\`\`
output-hey-api/
├── types.gen.ts      # TypeScript type definitions
├── services.gen.ts   # Service functions for API calls
├── sdk.gen.ts        # SDK wrapper
└── index.ts          # Main entry point
\`\`\`

**Philosophy**: Provide complete solution with types and client

---

## 5. Example Usage Patterns

### Using openapi-typescript

\`\`\`typescript
import type { paths } from './output-openapi-typescript/types';

// Define your own client
async function createVoyage(
  data: paths['/api/v5/Voyage/Bulk/Create']['post']['requestBody']['content']['application/json']
) {
  const response = await fetch('/api/v5/Voyage/Bulk/Create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
\`\`\`

### Using @hey-api/openapi-ts

\`\`\`typescript
import { createClient } from './output-hey-api';

// Use generated client
const client = createClient({ baseUrl: 'https://api.example.com' });
const result = await client.bulkVoyage.createBulkVoyages({ body: data });
\`\`\`

---

## 6. Recommendations

### Choose openapi-typescript if:

1. You have an existing API client setup (axios, fetch wrapper, etc.)
2. You want minimal generated code
3. You need maximum flexibility in implementation
4. You prefer explicit control over HTTP requests
5. You're building a library that should be client-agnostic

### Choose @hey-api/openapi-ts if:

1. You're starting a new project
2. You want to reduce boilerplate code
3. You prefer convention over configuration
4. You want auto-generated service functions
5. You need a complete, ready-to-use solution

---

## 7. Size Comparison

| Generator | Files | Size | Lines |
|-----------|-------|------|-------|
| openapi-typescript | ${openapiStats.totalFiles} | ${(openapiStats.totalSize / 1024).toFixed(2)} KB | ${openapiStats.totalLines.toLocaleString()} |
| @hey-api/openapi-ts | ${heyApiStats.totalFiles} | ${(heyApiStats.totalSize / 1024).toFixed(2)} KB | ${heyApiStats.totalLines.toLocaleString()} |
| **Difference** | ${heyApiStats.totalFiles - openapiStats.totalFiles > 0 ? '+' : ''}${heyApiStats.totalFiles - openapiStats.totalFiles} | ${((heyApiStats.totalSize - openapiStats.totalSize) / 1024).toFixed(2)} KB | ${(heyApiStats.totalLines - openapiStats.totalLines).toLocaleString()} |

The size difference represents the runtime client code, service functions, and additional utilities provided by @hey-api/openapi-ts.

---

## Conclusion

Both generators are excellent tools for different use cases:

- **openapi-typescript** excels at providing minimal, type-only definitions
- **@hey-api/openapi-ts** excels at providing a complete, batteries-included client

Your choice should depend on your project requirements, team preferences, and existing infrastructure.
`;

  fs.writeFileSync('COMPARISON_REPORT.md', report);
  console.log('✅ Comparison report generated: COMPARISON_REPORT.md');
}

// Check if output directories exist
const openapiExists = fs.existsSync('output-openapi-typescript');
const heyApiExists = fs.existsSync('output-hey-api');

if (!openapiExists || !heyApiExists) {
  console.log('⚠️  Generate the outputs first with: npm run gen:all');
  process.exit(1);
}

generateReport();
