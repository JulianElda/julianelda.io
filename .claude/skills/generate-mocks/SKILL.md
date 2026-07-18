---
name: generate-mocks
description: Generate realistic mock data for Supabase table types (Category, Spending, etc.). Use this when you need test data that matches your database schema. Understands table relationships and generates valid, realistic values for all column types.
---

# Generate Supabase Table Mocks

This skill helps create mock data for testing components and utilities that depend on Supabase tables.

## What It Does

- **Analyzes table schemas** from `src/lib/types/supabase.types.ts` and `database.types.ts`
- **Generates realistic mock values** for each table row (Categories, Spendings, etc.)
- **Creates individual and collection mocks** with realistic, domain-appropriate data
- **Handles relationships** between tables (e.g., spending items with category references)
- **Generates derived types** like `SpendingRow` that combine related data

## When to Use

- Writing new component tests that need sample data
- Creating Storybook stories for UI components
- Testing utilities that transform or filter table data
- Need new mock variants for specific test scenarios

## How It Works

The skill will:

1. **Examine the Supabase types** in `src/lib/types/supabase.types.ts` and `database.types.ts`
2. **Generate mock data** with realistic, domain-appropriate values:
   - Categories: realistic category names and sequential IDs
   - Spendings: realistic amounts, dates, descriptions matching the category
   - Derived types: properly constructed compound types like `SpendingRow`
3. **Output properly-typed mock code** in the chat (individual and collection exports)

## How to Invoke

Ask the agent to generate mocks for a specific table type:

- "Generate mocks for **Category** table"
- "Generate mocks for **Spending** table"
- "Generate mocks for **SpendingRow** type"
- "Create 5 new **Spending** mock variants"

The skill accepts:

- **Table type** (required): `Category`, `Spending`, or `SpendingRow`
- **Count** (optional): number of mock variants to generate (default: 3-10)
- **Context** (optional): specific scenario (e.g., "for April 2026", "with different categories")

The agent will output properly-typed mock code in the chat for you to review and copy as needed.

## Example Output

For a Category table:

```typescript
export const mockCategory1: Category = {
  id: 1,
  name: "Groceries",
};
```
