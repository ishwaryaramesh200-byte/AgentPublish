# STATIC Generator - Fixed Hardcoded Values

## What It Does

Uses a fixed, predetermined value that remains constant. Simplest generator type - directly assigns a hardcoded value.

---

## When to Use STATIC

Use STATIC when:
- Value never changes
- Fixed enum values
- Boolean flags
- Default values
- Testing invalid values
- Tags and categories
- Version numbers

---

## Required Properties

| Property | Type   | Purpose            |
| -------- | ------ | ------------------ |
| `type`   | string | Must be `"static"` |
| `value`  | List[Any]    | A list of predefined values |

---

## Supported Value Types

STATIC supports all JSON types:
`value` accepts any valid JSON type (string, number, boolean, object, array, list, or null).

---

## Meta Schema
``` json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["type", "value"],
  "additionalProperties": false,
  "properties": {
    "type": {
      "const": "static"
    },
    "value": true
  }
}
```
---

## Common Patterns


### Common Patterns (Simplified)

- **Status Values:** Use static generators for status like "OPEN", "CLOSED", "PENDING".
- **Priority Levels:** Use static generators for priority like "CRITICAL", "HIGH", "LOW".
- **Boolean Flags:** Use static generators for true/false, e.g., `is_active: true`, `is_deleted: false`.
- **Tags/Arrays:** Use static arrays, e.g., `["urgent", "escalated"]`, `["read", "write"]`.
- **Error Testing:** Provide both valid and invalid static values for testing, e.g., `"OPEN"`, `"INVALID_STATUS"`.
- **Custom Fields:** Use static objects for custom fields, e.g., `{ "field_100": "Support", "field_101": "North America" }`.
  
---

## Type Mapping

### Type Mapping (Simplified)

- **string:** "OPEN"
- **integer:** 42
- **number:** 99.99
- **boolean:** true / false
- **array:** ["a", "b"]
- **object:** {"key": "value"}
- **null:** null
  
---

## Best Practices

**Do:**
- Use descriptive names
- Match value type to OpenAPI spec
- Create valid AND invalid variants for testing
- Comment complex object structures

**Avoid:**
- Using STATIC for changing values
- Using STATIC for timestamps
- Using STATIC for request data
- Generic names like "value"
  
---

*Last Updated: 16 February 2026*
