# Quick Start Guide

## What is this project?

This project helps you compare **TYPE DEFINITIONS** from two popular OpenAPI/Swagger code generators:
- **openapi-typescript** - Path-based types (51 KB, 1,535 lines)
- **@hey-api/openapi-ts** - Schema-based types (20 KB, 889 lines)

> **Focus**: We compare TYPE DEFINITIONS only, ignoring optional client code.

## 🚀 Run the Comparison (One Command)

```bash
npm run full-compare
```

This will:
1. ✅ Generate types from both tools
2. ✅ Show types-only comparison
3. ✅ Display usage examples

## 📊 What You Get

After running the command, you'll have:

### Generated Types
- `output-openapi-typescript/types.ts` - 51 KB, path-based structure
- `output-hey-api/types.gen.ts` - 20 KB, flat schema-based structure

### Key Finding
**@hey-api generates 61% LESS type definition code!**

### Comparison Output
- Type file sizes and line counts
- Structure differences
- Usage pattern examples
- Type safety analysis

## 🔍 Explore the Results

### View Types Comparison (Default)
```bash
npm run compare
```
Compares ONLY type definitions (ignores client code).

### View Code Samples
```bash
npm run compare:samples
```
Shows actual generated code snippets.

### View Full Statistics (Including Client Code)
```bash
npm run compare:stats
```
Shows ALL files including optional client code.

## 📁 Browse Generated Code

Open the files in your editor:
```bash
# openapi-typescript output
code output-openapi-typescript/types.ts

# @hey-api/openapi-ts output
code output-hey-api/types.gen.ts
code output-hey-api/sdk.gen.ts
```

## 🎯 Quick Decision Guide

**Choose openapi-typescript if:**
- ✓ You need full endpoint context in your types
- ✓ You prefer nested, path-based type structure
- ✓ You want to see request/response/params together
- ✓ You like TypeScript interfaces

**Choose @hey-api/openapi-ts if:**
- ✓ You want simple, direct type imports
- ✓ You prefer flat, schema-based structure
- ✓ You want smaller type files (61% less code)
- ✓ You like TypeScript type aliases

## � The Numbers

```
openapi-typescript:     51 KB, 1,535 lines (path-based)
@hey-api/openapi-ts:    20 KB, 889 lines (schema-based)
Difference:             -61% smaller type definitions
```

## 🔄 Start Fresh

To regenerate everything:
```bash
# Remove old outputs
rm -rf output-openapi-typescript output-hey-api COMPARISON_REPORT.md

# Generate fresh comparison
npm run full-compare
```

## 📝 Using Your Own OpenAPI File

Replace `swagger.json` with your own OpenAPI/Swagger file, then run:
```bash
npm run full-compare
```

The comparison will work with any valid OpenAPI 3.x specification!
