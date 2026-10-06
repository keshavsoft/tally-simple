# Usage

[Back to the package on npm](https://www.npmjs.com/package/tally-simple) · [Back to the README](../README.md)

## The shortest library path

~~~js
import tally from "tally-simple";

const response = await tally.masters.units.fetch("Mani9");
~~~

Every endpoint takes a company name. Blank names are rejected before a request is sent.

## Configure a client

~~~js
import { createTallyClient } from "tally-simple";

const tally = createTallyClient({
    url: "http://localhost:9000",
    headers: {
        Authorization: "Bearer example"
    },
    timeout: 15_000
});
~~~

Options:

- url: Tally HTTP endpoint. The default is http://localhost:9000.
- method: request method. The default is POST.
- headers: headers merged with the default Content-Type: text/xml.
- timeout: optional request timeout in milliseconds.
- fetch: optional fetch-compatible function, useful for tests or an application adapter.

The endpoint returns the response text. HTTP responses outside the 2xx range throw an error containing the status and response body.

The default endpoint is `http://localhost:9000`, which assumes Tally is accepting HTTP requests there. The package does not start Tally or transform the XML response.

## Test without Tally

~~~js
import { createTallyClient } from "tally-simple";

const tally = createTallyClient({
    fetch: async (url, options) => {
        console.log(url, options.body);
        return {
            ok: true,
            status: 200,
            text: async () => "<ENVELOPE><STATUS>1</STATUS></ENVELOPE>"
        };
    }
});

const response = await tally.masters.units.fetch("Mani9");
~~~

The package escapes XML-sensitive characters in the company name before inserting it into the request.

## TypeScript

The package ships declarations generated from the public API definition:

~~~ts
import { createTallyClient } from "tally-simple";

const tally = createTallyClient();
const response: Promise<string> = tally.masters.units.fetch("Mani9");
~~~

Regenerate the declarations after changing an API path:

~~~bash
npm run generate:dts
~~~
