# CLI reference

[Back to the package on npm](https://www.npmjs.com/package/tally-simple) · [Back to the README](../README.md)

The package publishes the tally-simple executable. With npm, use it through npx:

~~~bash
npx tally-simple <api-path> --company <company>
~~~

## Options

| Option | Meaning |
| --- | --- |
| -c, --company <name> | Company to query. Also reads TALLY_COMPANY. |
| -u, --url <url> | Tally endpoint. Also reads TALLY_URL. |
| --header <name:value> | Adds a request header. Repeat it for multiple headers. |
| --timeout <ms> | Aborts a request after the given number of milliseconds. |
| -h, --help | Prints command help. |
| -v, --version | Prints the installed package version. |

The command accepts masters.units.fetch and tally.masters.units.fetch equivalently. The response body is written to stdout with a trailing newline; errors and usage help are written to stderr.

For PowerShell, set environment variables with `$env:`:

~~~powershell
$env:TALLY_COMPANY = "Mani9"
$env:TALLY_URL = "http://localhost:9000"
npx tally-simple masters.units.fetch > units.xml
~~~

The command exits with a non-zero status when the company is missing, the API path is unknown, Tally returns a non-2xx response, or the request times out.

Examples:

~~~bash
npx tally-simple masters.units.fetch --company Mani9

npx tally-simple masters.stockItems.withBatches \
    --company Mani9 \
    --header X-Request-Source:nightly

TALLY_COMPANY=Mani9 npx tally-simple masters.units.fetch
~~~
