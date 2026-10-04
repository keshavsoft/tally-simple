[**View this document as HTML**](./architecture.html)

# Architecture

The package is intentionally small.

```text
Caller
  │
  │ public path + company
  ▼
external-api
  │
  ▼
traversal
  │
  ▼
source.json
  │
  ▼
request definition
  │
  ▼
Tally HTTP endpoint
  │
  ▼
XML response
```

## Two JSON roles

### `source.json`

Internal implementation definition.

It contains the information required to construct the Tally request.

### `external-api/api.json`

Public contract.

It contains only the paths that should be exposed to consumers.

This prevents internal request details from becoming the public API automatically.

## Why JSON

Adding a new Tally operation should normally be a definition change:

```text
add definition
→ expose path
→ regenerate declarations
→ test
```

The execution engine remains unchanged.

## Company

Company is runtime data supplied by the caller, not a fixed value in the public API.

## XML

The package creates and sends Tally XML. It does not require the response to be converted to JSON as part of this layer.
