[**View this document as HTML**](./end-user.html)

# End User Guide

This guide is for someone who wants to use the Tally package, not modify it.

## JavaScript

```js
import tally from "./src/index.js";

const units = await tally.masters.units.fetch("Mani9");
console.log(units);
```

The company name is supplied by the caller:

```js
tally.masters.units.fetch("My Company");
```

The package builds the Tally request internally.

## What you receive

The Tally response is returned as XML text. This package does not force an XML-to-JSON format on the consumer.

You can parse or transform the response with the tool you prefer.

## Public API

See [API Reference](api.md) for the currently exposed operations.

If you are integrating this package into a larger application, continue with the [Application Developer Guide](developer.md).
