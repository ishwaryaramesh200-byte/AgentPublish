# REMOTE Generator - Call System Functions

## What It Does

Calls built-in system functions for timestamps, enumerations, and configuration data. Generates system-level values instead of fetching from APIs.

---

## When to Use REMOTE

Use REMOTE when you need:
- Current, future, or past timestamps
- Enumeration values from system
- System configuration data
- Dynamic field schemas
- Generated vs. real data

**Common Scenarios:**
- Generate timestamps (created, modified, due dates)
- Get enumeration values from system
- Retrieve custom field schemas
- Access system configurations

---

## Required Properties

| Property | Type | Purpose |
|----------|------|---------|
| `type` | string | Must be `"remote"` |
| `generatorMethod` | string | System function to call |
| `inputs` | object | Function parameters |


---

## System Methods Reference

| Method | Purpose | Use Case |
|--------|---------|----------|
| `getDateTime` | Generate timestamps | Created, modified, due dates |
| `getDynamicEnumValues` | Get enumeration values | Status, priority, type fields |
| `getCustomFieldSchema` | Get field structure | Custom field metadata |

### Full Method Paths

Complete method paths use:
```
applicationDriver.rpc.desk.DynamicDataProvider.methodName
```

Examples:
- `applicationDriver.rpc.desk.DynamicDataProvider.getDateTime`
- `applicationDriver.rpc.desk.DynamicDataProvider.getDynamicEnumValues`
- `applicationDriver.rpc.desk.DynamicDataProvider.getCustomFieldSchema`

---

## Examples

### Current Timestamp
For "now" timestamps:
```json
{
  "type": "remote",
  "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDateTime",
  "inputs": {
    "timeLine": "current",
    "format": "yyyy-MM-dd'T'HH:mm:ss'Z'"
  }
}
```pport.Department.getDepartments",
                "dataPath": "$.response.body:$.data[*].id"

### Future Date
For deadlines and expiry dates:
```json
{
  "type": "remote",
  "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDateTime",
  "inputs": {
    "timeLine": "future",
    "format": "yyyy-MM-dd'T'HH:mm:ss'Z'"
  }
}
```

### Enumeration Values
Get system enums:
```json
{
  "type": "remote",
  "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDynamicEnumValues",
  "inputs": {
    "fieldName": "priority",
    "moduleName": "Ticket",
    "orgId": "123"
  }
}
```

---

## Timestamp Formats

### Format Strings (Java SimpleDateFormat)

| Format | Example | Use Case |
|--------|---------|----------|
| `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` | 2026-02-11T14:30:45.123Z | APIs with milliseconds |
| `yyyy-MM-dd'T'HH:mm:ss'Z'` | 2026-02-11T14:30:45Z | ISO 8601 (recommended) |
| `yyyy-MM-dd HH:mm:ss` | 2026-02-11 14:30:45 | Database format |
| `yyyy-MM-dd` | 2026-02-11 | Date only |

### Format Components

| Symbol | Meaning | Example |
|--------|---------|---------|
| `yyyy` | 4-digit year | 2026 |
| `MM` | 2-digit month | 02 (01-12) |
| `dd` | 2-digit day | 11 (01-31) |
| `HH` | 2-digit hour | 14 (00-23) |
| `mm` | 2-digit minute | 30 (00-59) |
| `ss` | 2-digit second | 45 (00-59) |
| `SSS` | 3-digit milliseconds | 123 (000-999) |
| `'Z'` | UTC timezone (quoted) | Z |

---

## Timeline Values

| Value | Generates | Use Case | Example |
|-------|-----------|----------|---------|
| `current` | Now (today) | Creation timestamps | `createdAt: "2026-02-11T14:30:45Z"` |
| `future` | Later date | Deadlines, expiry | `dueDate: "2026-03-15T23:59:59Z"` |
| `past` | Earlier date | Historical data | `modifiedAt: "2026-01-10T08:00:00Z"` |

---

## Common Patterns

### Multiple Timestamps
Different generators for different timestamp meanings:
```json
"generators": {
  "created_timestamp": [{
    "type": "remote",
    "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDateTime",
    "inputs": {
      "timeLine": "past",
      "format": "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }
  }],
  "modified_timestamp": [{
    "type": "remote",
    "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDateTime",
    "inputs": {
      "timeLine": "current",
      "format": "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }
  }],
  "due_date": [{
    "type": "remote",
    "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDateTime",
    "inputs": {
      "timeLine": "future",
      "format": "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }
  }]
}
```

### Status Enumerations
Different enums per field:
```json
"generators": {
  "status": [{
    "type": "remote",
    "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDynamicEnumValues",
    "inputs": {
      "fieldName": "status",
      "moduleName": "Ticket"
    }
  }],
  "priority": [{
    "type": "remote",
    "generatorMethod": "applicationDriver.rpc.desk.DynamicDataProvider.getDynamicEnumValues",
    "inputs": {
      "fieldName": "priority",
      "moduleName": "Ticket"
    }
  }]
}
```

### Mixed Timestamps & Enums
Combine both in one configuration:
```json
"generators": {
  "status": [{...enum generator...}],
  "priority": [{...enum generator...}],
  "created_at": [{...current timestamp...}],
  "due_at": [{...future timestamp...}]
}
```

---

## Best Practices

**Do:**
- Always include format for timestamps
- Use consistent format across similar fields
- Select appropriate timeline (current, future, past)
- Verify enum field names against OpenAPI spec
- Use UTC timezone (Z suffix)

**Avoid:**
- Mixing different timestamp formats per entity
- Assuming enum values without verifying
- Using hardcoded timestamps when REMOTE available
- Forgetting to quote timezone literals like `'Z'`

---

## Troubleshooting

### Timestamps in Wrong Format
**Check:**
- Format string is case-sensitive
- Single quotes around literals: `'Z'` not `Z`
- No extra characters in format
- Example: `yyyy-MM-dd'T'HH:mm:ss'Z'`

### Empty Enumeration Values
**Verify:**
- Field name is correct
- Module name is correct
- orgId matches your system
- Field exists in that module

### System Doesn't Recognize Method
**Check:**
- Full path: `applicationDriver.rpc.desk.DynamicDataProvider.methodName`
- Method name spelled correctly
- No typos in inputs

---

## Reference

- **Fetch Method:** System functions
- **Data Type:** Generated values
- **Scope:** System-wide functions
- **Updates:** Generated fresh each time

---

*Last Updated: 11 February 2026*
