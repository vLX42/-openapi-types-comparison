# OpenAPI Generator Comparison Report

Generated: 2025-10-22T14:09:10.136Z

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
| Total Files | 16 |
| Total Size | 82.47 KB |
| Total Lines | 3,274 |

### Generated Files

- `client/client.gen.ts` (6.49 KB, 269 lines)
- `client/index.ts` (0.74 KB, 27 lines)
- `client/types.gen.ts` (7.31 KB, 269 lines)
- `client/utils.gen.ts` (8.02 KB, 332 lines)
- `client.gen.ts` (0.78 KB, 17 lines)
- `core/auth.gen.ts` (0.84 KB, 43 lines)
- `core/bodySerializer.gen.ts` (2.22 KB, 93 lines)
- `core/params.gen.ts` (3.33 KB, 154 lines)
- `core/pathSerializer.gen.ts` (4.16 KB, 182 lines)
- `core/queryKeySerializer.gen.ts` (2.90 KB, 137 lines)
- `core/serverSentEvents.gen.ts` (7.16 KB, 265 lines)
- `core/types.gen.ts` (3.28 KB, 119 lines)
- `core/utils.gen.ts` (3.33 KB, 144 lines)
- `index.ts` (0.11 KB, 5 lines)
- `sdk.gen.ts` (12.08 KB, 329 lines)
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
| **Files Generated** | 1 | 16 |
| **Total Size** | 50.98 KB | 82.47 KB |
| **Total Lines** | 1,535 | 3,274 |
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

## 7. Size Comparison

| Generator | Files | Size | Lines |
|-----------|-------|------|-------|
| openapi-typescript | 1 | 50.98 KB | 1,535 |
| @hey-api/openapi-ts | 16 | 82.47 KB | 3,274 |
| **Difference** | +15 | 31.49 KB | 1,739 |

The size difference represents the runtime client code, service functions, and additional utilities provided by @hey-api/openapi-ts.

---

## Conclusion

Both generators are excellent tools for different use cases:

- **openapi-typescript** excels at providing minimal, type-only definitions
- **@hey-api/openapi-ts** excels at providing a complete, batteries-included client

Your choice should depend on your project requirements, team preferences, and existing infrastructure.
