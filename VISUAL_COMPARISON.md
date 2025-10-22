# Visual Comparison Diagram

## Architecture Comparison

### openapi-typescript: Types-Only Approach

```
┌─────────────────────────────────────────────────────────────┐
│                      swagger.json                            │
│                   (OpenAPI Spec)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ npx openapi-typescript
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   output-openapi-typescript/                 │
│                                                               │
│   ┌───────────────────────────────────────────────────┐     │
│   │  types.ts (51 KB, 1535 lines)                     │     │
│   │                                                    │     │
│   │  export interface paths { ... }                   │     │
│   │  export interface components { ... }              │     │
│   │  // Pure TypeScript type definitions              │     │
│   │  // No runtime code                               │     │
│   └───────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ You implement your own client
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Your Custom API Client                          │
│                                                               │
│  import type { paths } from './types';                       │
│                                                               │
│  async function createVoyage(                                │
│    data: paths['/api/v5/Voyage']['post']['requestBody']     │
│  ) {                                                         │
│    return fetch('/api/v5/Voyage', {                         │
│      method: 'POST',                                         │
│      body: JSON.stringify(data)                              │
│    });                                                       │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

### @hey-api/openapi-ts: Full Client Approach

```
┌─────────────────────────────────────────────────────────────┐
│                      swagger.json                            │
│                   (OpenAPI Spec)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ npx @hey-api/openapi-ts
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    output-hey-api/                           │
│                  (82 KB, 3274 lines)                         │
│                                                               │
│   ┌─────────────────────────────────────────────────┐       │
│   │  types.gen.ts (20 KB, 889 lines)                │       │
│   │  - Type definitions                             │       │
│   │  export type BulkVoyageCreateDto = { ... }      │       │
│   └─────────────────────────────────────────────────┘       │
│                                                               │
│   ┌─────────────────────────────────────────────────┐       │
│   │  sdk.gen.ts (12 KB, 329 lines)                  │       │
│   │  - Service functions for API calls              │       │
│   │  export const postApiV5VoyageBulkCreate = ...   │       │
│   └─────────────────────────────────────────────────┘       │
│                                                               │
│   ┌─────────────────────────────────────────────────┐       │
│   │  client/ (15 KB, 897 lines)                     │       │
│   │  - HTTP client implementation                    │       │
│   │  - Request/response handling                     │       │
│   └─────────────────────────────────────────────────┘       │
│                                                               │
│   ┌─────────────────────────────────────────────────┐       │
│   │  core/ (34 KB, 1044 lines)                      │       │
│   │  - Auth, serializers, utilities                  │       │
│   │  - SSE support, param handling                   │       │
│   └─────────────────────────────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Ready to use immediately
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Your Application Code                           │
│                                                               │
│  import { postApiV5VoyageBulkCreate } from './sdk.gen';     │
│                                                               │
│  // Just call the generated function                         │
│  const result = await postApiV5VoyageBulkCreate({           │
│    body: data                                                │
│  });                                                         │
│                                                               │
│  // Type safety built-in                                     │
└─────────────────────────────────────────────────────────────┘
```

## Size Comparison Visualization

```
openapi-typescript:     ████████████████████ (51 KB, 1 file)
@hey-api/openapi-ts:    ████████████████████████████████ (82 KB, 16 files)
                        ↑ Additional 31 KB for runtime client
```

## Feature Matrix

```
┌──────────────────────────────┬───────────────────┬────────────────────┐
│ Feature                      │ openapi-typescript│ @hey-api/openapi-ts│
├──────────────────────────────┼───────────────────┼────────────────────┤
│ Type Definitions             │        ✅         │         ✅         │
│ Runtime Client Code          │        ❌         │         ✅         │
│ Service Functions            │        ❌         │         ✅         │
│ HTTP Client                  │    Manual ⚠️      │    Included ✅     │
│ Request Serialization        │    Manual ⚠️      │    Included ✅     │
│ Response Parsing             │    Manual ⚠️      │    Included ✅     │
│ Authentication Support       │    Manual ⚠️      │    Included ✅     │
│ Server-Sent Events           │    Manual ⚠️      │    Included ✅     │
│ File Size                    │     Small ✅      │     Larger ⚠️      │
│ Customization                │      High ✅      │    Limited ⚠️      │
│ Setup Time                   │     Manual ⚠️     │      Fast ✅       │
│ Learning Curve               │      Low ✅       │     Medium ⚠️      │
└──────────────────────────────┴───────────────────┴────────────────────┘
```

## Decision Tree

```
                    ┌─────────────────────────┐
                    │  Need OpenAPI Types?    │
                    └───────────┬─────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │ Have existing       │         │ Starting from       │
    │ API client?         │         │ scratch?            │
    └──────┬──────────────┘         └──────┬──────────────┘
           │                               │
           ▼                               ▼
    ┌────────────────┐              ┌────────────────┐
    │ Want maximum   │              │ Want ready-to- │
    │ control?       │              │ use solution?  │
    └──────┬─────────┘              └──────┬─────────┘
           │                               │
           ▼                               ▼
    ┌────────────────┐              ┌────────────────┐
    │ openapi-       │              │ @hey-api/      │
    │ typescript     │              │ openapi-ts     │
    └────────────────┘              └────────────────┘
         Types Only                  Types + Client
```

## Workflow Comparison

### openapi-typescript Workflow

```
1. Generate types
   └─> npx openapi-typescript swagger.json -o types.ts

2. Create your HTTP client wrapper
   └─> Define fetch/axios wrapper functions
   └─> Add error handling
   └─> Add authentication logic

3. Use types in your wrapper
   └─> import type { paths } from './types'
   └─> Type your request/response

4. Call your wrapper in app
   └─> await myClient.createVoyage(data)
```

### @hey-api/openapi-ts Workflow

```
1. Generate client
   └─> npx @hey-api/openapi-ts -i swagger.json -o output

2. Import and use immediately
   └─> import { postApiV5VoyageBulkCreate } from './output/sdk.gen'
   └─> await postApiV5VoyageBulkCreate({ body: data })

That's it! 🎉
```

## Code Volume Breakdown

```
openapi-typescript (1,535 lines):
├─ Type Definitions:      1,535 lines (100%)
└─ Runtime Code:              0 lines (0%)

@hey-api/openapi-ts (3,274 lines):
├─ Type Definitions:        889 lines (27%)
├─ Service Functions:       329 lines (10%)
├─ Client Implementation:   897 lines (27%)
└─ Core Utilities:        1,159 lines (36%)
```

## Summary

```
╔══════════════════════════════════════════════════════════════╗
║                 openapi-typescript                           ║
║  🎯 Focus: Pure types, maximum flexibility                  ║
║  📦 Output: 1 file, 51 KB                                   ║
║  ⚡ Speed: You build the client                             ║
║  🎨 Style: Minimalist, unopinionated                        ║
╚══════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════╗
║                  @hey-api/openapi-ts                        ║
║  🎯 Focus: Complete solution, batteries included            ║
║  📦 Output: 16 files, 82 KB                                 ║
║  ⚡ Speed: Ready to use immediately                         ║
║  🎨 Style: Opinionated, structured                          ║
╚══════════════════════════════════════════════════════════════╝
```
