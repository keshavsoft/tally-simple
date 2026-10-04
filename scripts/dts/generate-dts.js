import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findActiveVersion } from "./find-active-version.js";
import { loadVersionDefinition } from "./load-version-definition.js";
import { renderDeclaration } from "./render-declaration.js";

const projectRoot = path.resolve(
    fileURLToPath(new URL("../../", import.meta.url))
);
const activeVersion = findActiveVersion(projectRoot);
const definition = loadVersionDefinition(activeVersion);
const outputFile = path.join(projectRoot, "src", "index.d.ts");
const declaration = renderDeclaration(definition);

fs.writeFileSync(outputFile, declaration, "utf8");

console.log(
    `Generated src/index.d.ts from ${activeVersion.name}/external-api/api.json and ${activeVersion.name}/source.json`
);
