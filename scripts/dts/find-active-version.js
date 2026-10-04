import fs from "node:fs";
import path from "node:path";

const versionPattern = /^v(\d+)$/;

const readRuntimeVersion = (entryFile) => {
    const source = fs.readFileSync(entryFile, "utf8");
    const match = source.match(/from\s+["']\.\/(v\d+)\/index\.js["']/);

    if (!match) {
        throw new Error(
            `Could not find a version import in ${path.relative(process.cwd(), entryFile)}.`
        );
    }

    return match[1];
};

const findActiveVersion = (projectRoot) => {
    const srcDirectory = path.join(projectRoot, "src");
    const entryFile = path.join(srcDirectory, "index.js");
    const versions = fs.readdirSync(srcDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && versionPattern.test(entry.name))
        .map((entry) => ({
            name: entry.name,
            number: Number(entry.name.slice(1))
        }))
        .sort((left, right) => right.number - left.number);

    if (versions.length === 0) {
        throw new Error("No version directories were found under src/. Expected src/v1, src/v2, and so on.");
    }

    const highestVersion = versions[0].name;
    const runtimeVersion = readRuntimeVersion(entryFile);

    if (runtimeVersion !== highestVersion) {
        throw new Error(
            `The highest source version is ${highestVersion}, but src/index.js imports ${runtimeVersion}. `
            + `Update src/index.js before generating declarations.`
        );
    }

    return {
        name: highestVersion,
        number: versions[0].number,
        directory: path.join(srcDirectory, highestVersion),
        srcDirectory
    };
};

export { findActiveVersion };
