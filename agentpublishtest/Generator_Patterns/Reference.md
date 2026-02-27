# REFERENCE Generator - Use Request Input Data

## What It Does

Passes data directly from incoming request to response without modification. Extracts values from request body, query parameters, path parameters, or headers.

---

## When to Use REFERENCE

Use REFERENCE when:
A Reference Generator extracts data from previous API responses.- Using data from request body
- Getting values from query parameters
- Using path parameters
- Using header values
- Data comes directly from request

**Common Scenarios:**
- Pass ticket ID from request to response
- Use query parameters in operations
- Extract URL path parameters
- Forward authorization headers
- Use nested request objects

---

## Required Properties

| Property | Type | Purpose |
|----------|------|---------|
| `type` | string | Must be `"reference"` |
| `ref` | string | Path to request data |

## Reference Path Format

**Pattern:** `$.input.{location}:$.{jsonPath}`

### Location Types

| Location | Source | Example |
|----------|--------|---------|
| `$.input.body` | Request body JSON | `$.input.body:$.ticketId` |
| `$.input.query` | Query parameters | `$.input.query:$.departmentId` |
| `$.input.path` | URL path parameters | `$.input.path:$.ticketId` |
| `$.input.header` | HTTP headers | `$.input.header:$.Authorization` |

### Path Selector Examples

| Reference | Extracts |
|-----------|----------|
| `$.input.body:$.fieldName` | Simple field from body |
| `$.input.body:$.parent.child.fieldName` | Nested field |
| `$.input.body:$.items[*].id` | All array IDs |
| `$.input.body:$.items[0].id` | First array ID |
| `$.input.query:$.parameterName` | Query parameter |
| `$.input.path:$.pathParamName` | Path parameter |
| `$.input.header:$.HeaderName` | Header value |

---

## Best Practices

**Do:**
- Verify request contains the fields you reference
- Use exact field names (case-sensitive)
- Use clear generator names matching source

**Avoid:**
- Referencing fields that don't exist
- Assuming request structure without docs
- Using REFERENCE for static values
- Ignoring case sensitivity

---

## When to Use REFERENCE

| Scenario | Use REFERENCE |
|----------|---|
| Pass-through from request | Yes |
| Get data from request | Yes |
| Fetch from database | No |
| Fixed constant | No |
| System timestamp | No |
| Logic-based value | No |

---

## Reference

- **Fetch Method:** Request fields
- **Data Type:** Request data (pass-through)
- **Scope:** Single request scope
- **Updates:** From request content

---

*Last Updated: 17 February 2026*
