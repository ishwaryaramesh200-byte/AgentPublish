# CONDITIONAL Generator — Rule-Based Data Selection

---

## Overview

A **Conditional Generator** selects a data generator based on predefined conditions. It enables dynamic test data generation by evaluating input values or context and branching to different generator logic accordingly.

---

## When to Use

- When the value of a parameter depends on other input values or request context.
- To implement business rules, feature flags, or scenario-specific data.
- For fallback/default logic when no condition matches.

---

## Structure

A conditional generator contains:
- `type`: Must be `"conditional"`
- `conditions`: List of condition objects, each with:
	- `when`: The condition to evaluate (key, operator, value)
	- `then`: The generator or value to use if the condition matches
- `else`: (optional) The generator or value to use if no conditions match

---

## Example

```json
{
	"generators": {
		"snippet_id": [
			{
				"type": "conditional",
				"conditions": [
					{
						"when": {
							"key": "$.input.query:modules",
							"equals": "tickets"
						},
						"then": {
							"use": "$generators:#/generators/ticket_id"
						}
					},
					{
						"when": {
							"key": "$.input.query:modules",
							"equals": "contacts"
						},
						"then": {
							"use": "$generators:#/generators/contact_id"
						}
					}
				],
				"else": "$generators:#/generators/activity_id"
			}
		]
	}
}
```

---

## Best Practices

- Use input-based branching: reference request path, query, or body fields in `when`.
- Reference other generators in `then` using correct relative paths or `$generators:` syntax.
- Always provide an `else` clause if possible to avoid unexpected nulls.
- Keep conditions mutually exclusive and clear.
- Avoid deeply nested or overly complex chains for readability.

---

## Validation Checklist

- Ensure all referenced generators exist.
- Test each condition path for expected output.

---

*Last Updated: 17 February 2026*
