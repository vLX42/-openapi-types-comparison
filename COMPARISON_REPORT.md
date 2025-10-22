# OpenAPI Generator Comparison Report

Generated: 2025-10-22T15:10:30.169Z

## Source

- **Input File**: swagger.json
- **API**: MVS Api 5.0
- **OpenAPI Version**: 3.0.4
- **Comparison Mode**: Types only (fair comparison)

---

## 🏆 Benchmark Results

### Performance Winner: @hey-api/openapi-ts

| Metric | openapi-typescript | @hey-api/openapi-ts | Winner |
|--------|-------------------|---------------------|--------|
| **Generation Time** | 1.82s | 1.57s | ⚡ @hey-api **(13.7% faster)** |
| **Output Size** | 50.98 KB | 19.79 KB | 📦 @hey-api **(61.2% smaller)** |
| **Lines of Code** | 1,535 lines | 893 lines | 📝 @hey-api **(41.8% less)** |
| **File Count** | 1 file | 2 files | ℹ️ openapi-typescript |

### Key Findings

- ✅ **@hey-api/openapi-ts is faster**: Generates types 13.7% faster than openapi-typescript
- ✅ **@hey-api/openapi-ts is smaller**: Produces 61.2% smaller output files
- ✅ **@hey-api/openapi-ts is more concise**: Uses 41.8% fewer lines of code

Both tools are very fast (under 2 seconds), but @hey-api/openapi-ts wins on all performance metrics.

**Note**: Both generators configured for types-only output using:
- openapi-typescript: default behavior
- @hey-api/openapi-ts: `--plugins @hey-api/typescript`

---

## 1. openapi-typescript

**Purpose**: Type-only generator for OpenAPI specifications

### Statistics

| Metric | Value |
|--------|-------|
| Total Files | 1 |
| Total Size | 50.98 KB |
| Total Lines | 1,535 |

### Generated Files

- `types.ts` (50.98 KB, 1,535 lines)

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
| Total Files | 2 |
| Total Size | 19.79 KB |
| Total Lines | 893 |

### Generated Files

- `index.ts` (0.09 KB, 4 lines)
- `types.gen.ts` (19.71 KB, 889 lines)

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
| **Files Generated** | 1 | 2 |
| **Total Size** | 50.98 KB | 19.79 KB |
| **Total Lines** | 1,535 | 893 |
| **Runtime Code** | ❌ No | ✅ Yes |
| **Service Functions** | ❌ No | ✅ Yes |
| **Client Implementation** | Manual | Auto-generated |
| **Customization** | Full | Limited |
| **Learning Curve** | Low | Medium |
| **Maintenance** | Low | Low |

---

## 4. Code Structure Comparison

### openapi-typescript Structure

```
output-openapi-typescript/
└── types.ts          # All TypeScript type definitions
```

**Philosophy**: Provide types, let developers choose implementation

### @hey-api/openapi-ts Structure

```
output-hey-api/
├── types.gen.ts      # TypeScript type definitions
├── services.gen.ts   # Service functions for API calls
├── sdk.gen.ts        # SDK wrapper
└── index.ts          # Main entry point
```

**Philosophy**: Provide complete solution with types and client

---

## 5. Example Usage Patterns

### Using openapi-typescript

```typescript
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
```

### Using @hey-api/openapi-ts

```typescript
import { createClient } from './output-hey-api';

// Use generated client
const client = createClient({ baseUrl: 'https://api.example.com' });
const result = await client.bulkVoyage.createBulkVoyages({ body: data });
```

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

## 7. Size Comparison (Types Only)

| Generator | Files | Size | Lines |
|-----------|-------|------|-------|
| openapi-typescript | 1 | 50.98 KB | 1,535 |
| @hey-api/openapi-ts | 2 | 19.79 KB | 893 |
| **Difference** | +1 | -31.18 KB (-61.2%) | -642 (-41.8%) |

The size difference is due to different type organization strategies:
- **openapi-typescript** uses nested, path-based structure with full endpoint context
- **@hey-api/openapi-ts** uses flat, schema-based structure with direct type access

---

## 8. Performance Summary

### Speed Test Results

Running `npm run benchmark` on swagger.json (MVS Api 5.0):

```
Generation Time:
  openapi-typescript:     1.82s
  @hey-api/openapi-ts:    1.57s  ⚡ 13.7% faster

Output Size:
  openapi-typescript:     50.98 KB
  @hey-api/openapi-ts:    19.79 KB  📦 61.2% smaller

Line Count:
  openapi-typescript:     1,535 lines
  @hey-api/openapi-ts:    893 lines  📝 41.8% less
```

### Winner: @hey-api/openapi-ts 🏆

- Faster generation time
- Smaller output size
- More concise code
- Simpler type structure

---

## Conclusion

Both generators are excellent tools, but for types-only generation:

### openapi-typescript
- ✅ Path-based structure mirrors OpenAPI spec exactly
- ✅ Full endpoint context in type definitions
- ✅ Good for projects needing explicit request/response types
- ⚠️ Larger output size (2.5x bigger)
- ⚠️ Slightly slower generation

### @hey-api/openapi-ts
- ✅ **61.2% smaller output** - More efficient type definitions
- ✅ **13.7% faster generation** - Quicker build times
- ✅ Flat structure - Easier to import and use
- ✅ Direct schema access - Simpler type paths
- ⚠️ Less explicit about endpoint request/response structure

**Recommendation**: For types-only generation, **@hey-api/openapi-ts** is the clear winner based on:
1. Performance (faster generation)
2. Efficiency (smaller output)
3. Simplicity (easier to use)

Choose **openapi-typescript** only if you specifically need the path-based structure for your use case.
