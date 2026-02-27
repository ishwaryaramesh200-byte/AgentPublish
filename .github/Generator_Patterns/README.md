# Data Generation Framework

## What is this?

This framework helps you generate test data for APIs defined in OpenAPI (OAS) files.

In simple words:
- You define generators in JSON.
- Generators call APIs, reuse values, and build input data.
- You can chain generators when one value depends on another.

## What is a generator?

A generator is a small JSON step that produces data.

Examples:
- Fetch `departmentId` from an API response
- Reuse a value from request input
- Set a fixed value like `priority = "high"`

All generators must be inside the `generators` object.

Basic format:

```json
{
  "generators": {
    "generator_name": [
      {
        "type": "..."
      }
    ]
  }
}
```

## About the Generator Agent

The Generator Agent helps developers create generator files faster and correctly.

The agent does the following:
- Reads the target operation from OAS
- Finds required dependencies from related operations
- Creates generator steps in the correct dependency order
- Uses only fields that exist in OAS (no invented params)
- Produces output in the required `generators` JSON structure

## Where to find paths

Use `PathConfig.properties` as the source of truth:
- `GENERATOR_CONFIG_PATH` for generator file locations
- `OAS_FILE_PATH` for OpenAPI specification locations

Always use these configured paths instead of hardcoding paths.

## Generator types

Use the right type based on your need:

| Type | Purpose | Documentation |
| --- | --- | --- |
| Dynamic | Get values from API operations | [Dynamic](./Dynamic.md) |
| Remote | Get values from system/remote helpers | [Remote](./Remote.md) |
| Static | Use fixed constant values | [Static](./Static.md) |
| Reference | Reuse existing values from input/other generators | [Reference](./Reference.md) |
| Conditional | Choose values based on conditions | [Conditional](./Conditional.md) |

## JSONPath quick guide

Common response mapping format:

`$.location:$.path`

Examples:
- `$.data[*].id` → all ids in an array
- `$.data[0].id` → first id
- `$.manager.id` → nested value
- `$.users[?(@.active == true)].id` → filtered values

## Developer workflow (quick)

1. Identify the target API operation.
2. Read the target operation in OAS.
3. Identify dependency operations and required values.
4. Choose proper generator types.
5. Create a new generator file in the correct folder.
6. Keep dependencies in order inside the same generator array.
7. Validate all params and paths against OAS.

## Important rules

- Use snake_case generator names.
- Keep names meaningful and short.
- Use singular for single value, plural for list values.
- Do not add fields that are not present in OAS.
- Do not modify existing generators unless explicitly requested.

## Reference Syntax

```
$<generatorname>.value                    // Generator reference
$.input.body:$.fieldName                  // Request body
$.input.query:$.paramName                 // Query parameter
$.input.path:$.pathParam                  // URL path
$.input.header:$.HeaderName               // HTTP header
```

## DataPath Format

```
$.response.body:$.data[0].id              // First item ID
$.response.body:$.data[*].id              // All item IDs
$.response.body:$.id                      // Direct ID field
$.response.body:$.manager.id              // Nested field
$.response.body:$.items[?(@.status == 'active')].id  // Filtered values
```

Last updated: 23 February 2026