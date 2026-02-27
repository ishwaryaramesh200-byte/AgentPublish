
# Rule: Referencing Single-Entity Dynamic Generator Dependencies

When a dynamic generator is used as a dependency for another generator (e.g., createTicket), always reference the dependency in params as $<generatorname>.value, regardless of the dataPath used in the dependency generator. This ensures the correct value is passed even if the dataPath returns an array or a single value.

**Example:**

Dependency generator:
```json
{
  "type": "dynamic",
  "name": "departments",
  "generatorOperationId": "support.Department.getDepartments",
  "dataPath": "$.response.body:$.data[*].id"
}
```

Dependent generator:
```json
{
  "type": "dynamic",
  "name": "ticket",
  "generatorOperationId": "support.Ticket.createTicket",
  "params": {
    "departmentId": "$departments.value"
  }
}
```

## What It Does
A DYNAMIC Generator fetches data from real API responses.

---

## When to Use DYNAMIC
- When you need real system data that changes frequently (e.g., active agent IDs, current ticket IDs).
- When there is an API available to fetch the required data.
  
---

## Required Properties

| Property | Type | Purpose |
|----------|------|---------|
| `type` | string | Must be `"dynamic"` |
| `generatorOperationId` | string | Which API operation to call |
| `dataPath` | string | Where to extract data from response |

## Optional Properties

| Property | Type | Purpose |
|----------|------|---------|
| `params` | object | Filter parameters: `{"status": "ACTIVE"}` |
| `name` | string | Generator identifier (unique label for referencing in params) |

---

## DataPath Format

**Pattern:** `$.response.body:$.path.to.data`

**Examples:**
- `$.response.body:$.data[0].id` - First item ID
- `$.response.body:$.data[*].id` - All item IDs
- `$.response.body:$.items[0].manager.id` - Nested field

---

## Examples

### Single Result
Fetch the first matching record:
```json
{
  "type": "dynamic",
  "generatorOperationId": "support.Agent.getAgents",
  "dataPath": "$.response.body:$.data[0].id"
}
```
### With Filter Parameters
Find specific records:
```json
{
  "type": "dynamic",
  "generatorOperationId": "support.Agent.getAgents",
  "dataPath": "$.response.body:$.data[*].id",
  "params": {"status": "ACTIVE"}
}
```
### Nested Field
Extract from object hierarchy:
```json
{
  "type": "dynamic",
  "generatorOperationId": "support.Department.getDepartment",
  "dataPath": "$.response.body:$.manager.id"
}
```
---

## Best Practices

**Do:**
- Use params to filter for specific scenarios
- Give descriptive names showing the filter/status
- Verify operationId exists in OpenAPI specification
  
**Avoid:**
- Assuming first result is always valid
- Generic names like "id"
- Forgetting `[*]` on array parameters
- Hardcoding fallback without DYNAMIC
  
---

## Check
- operationId is spelled correctly
- dataPath matches actual response structure
- params filter isn't too strict

## Reference
- **Fetch Method:** API operations
- **Data Type:** Real system data
- **Scope:** Cross-entity references possible
- **Updates:** Auto-syncs with system data

---

*Last Updated: 17 February 2026*
