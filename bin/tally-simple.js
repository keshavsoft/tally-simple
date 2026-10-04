#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import packageInfo from "../package.json" with { type: "json" };
import tally, { createTallyClient } from "../src/index.js";

const usage = [
    "Usage:",
    "  tally-simple <api-path> --company <company> [options]",
    "",
    "Examples:",
    "  tally-simple masters.units.fetch --company Mani9",
    "  tally-simple tally.masters.ledgers.withGstDetails --company Mani9 --url http://localhost:9000",
    "",
    "Options:",
    "  -c, --company <name>   Tally company name (or TALLY_COMPANY)",
    "  -u, --url <url>        Tally HTTP endpoint (or TALLY_URL)",
    "      --header <k:v>     Add a request header; may be repeated",
    "      --timeout <ms>     Abort a request after the given number of milliseconds",
    "  -h, --help             Show this help",
    "  -v, --version          Show the package version",
    "",
    "The API path is one of the paths listed in docs/api.md. The response body is",
    "written to stdout with a trailing newline, so it can be piped to another command.",
    ""
].join("\n");

const readValue = (args, index, option) => {
    const value = args[index + 1];

    if (!value || value.startsWith("-")) {
        throw new Error(option + " requires a value.");
    }

    return value;
};

const parseHeader = (value) => {
    const separator = value.indexOf(":");

    if (separator < 1) {
        throw new Error("Invalid header \"" + value + "\". Use the form name:value.");
    }

    return [
        value.slice(0, separator).trim(),
        value.slice(separator + 1).trim()
    ];
};

const parseArgs = (args) => {
    const options = { headers: {} };
    let apiPath;

    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];

        if (argument === "--help" || argument === "-h") {
            return { help: true };
        }

        if (argument === "--version" || argument === "-v") {
            return { version: true };
        }

        if (argument === "--company" || argument === "-c") {
            options.company = readValue(args, index, argument);
            index += 1;
            continue;
        }

        if (argument === "--url" || argument === "-u") {
            options.url = readValue(args, index, argument);
            index += 1;
            continue;
        }

        if (argument === "--timeout") {
            const value = readValue(args, index, argument);
            options.timeout = Number(value);

            if (!Number.isFinite(options.timeout) || options.timeout <= 0) {
                throw new Error("--timeout must be a positive number of milliseconds.");
            }

            index += 1;
            continue;
        }

        if (argument === "--header") {
            const [name, value] = parseHeader(readValue(args, index, argument));
            options.headers[name] = value;
            index += 1;
            continue;
        }

        if (argument.startsWith("-")) {
            throw new Error("Unknown option: " + argument);
        }

        if (apiPath) {
            throw new Error(
                "Only one API path may be supplied; received \"" + argument + "\" too."
            );
        }

        apiPath = argument;
    }

    return { ...options, apiPath };
};

const normalizePath = (apiPath) => apiPath.startsWith("tally.")
    ? apiPath.slice("tally.".length)
    : apiPath;

const findEndpoint = (apiPath, client = tally) => {
    const endpoint = normalizePath(apiPath).split(".").reduce(
        (current, part) => current?.[part],
        client
    );

    if (typeof endpoint !== "function") {
        throw new Error("Unknown API path: " + apiPath);
    }

    return endpoint;
};

const run = async (args) => {
    const parsed = parseArgs(args);

    if (parsed.help) {
        process.stdout.write(usage);
        return;
    }

    if (parsed.version) {
        process.stdout.write(packageInfo.version + "\n");
        return;
    }

    if (!parsed.apiPath) {
        throw new Error("An API path is required. Use --help to see examples.");
    }

    const company = parsed.company ?? process.env.TALLY_COMPANY;

    if (!company) {
        throw new Error("A company is required. Pass --company or set TALLY_COMPANY.");
    }

    const client = createTallyClient({
        url: parsed.url ?? process.env.TALLY_URL,
        headers: parsed.headers,
        timeout: parsed.timeout
    });
    const endpoint = findEndpoint(parsed.apiPath, client);
    const response = await endpoint(company);

    process.stdout.write(response + "\n");
};

const isMain = process.argv[1]
    && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
    run(process.argv.slice(2)).catch((error) => {
        process.stderr.write("Error: " + error.message + "\n\n" + usage);
        process.exitCode = 1;
    });
}

export { findEndpoint, parseArgs, run };
