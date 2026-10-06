# Execution Pipeline

[**View this document as HTML**](./execution-pipeline.html) · [**Documentation Hub**](./index.html)

When a consumer invokes an endpoint like `tally.masters.units.fetch("Mani9")`, the execution engine handles the request through a clean, 4-step pipeline.

---

## The Pipeline Flow

```text
Invocation: tally.masters.units.fetch("Mani9")
  │
  ▼
Step 1: validateCompany({ inCompany })
  │  Ensures company is a non-empty string; returns trimmed name
  ▼
Step 2: getTdl({ inSource, inRoutePath })
  │  Direct O(1) path lookup of TDL collection query from source.json
  ▼
Step 3: buildXmlBody({ inCompany, inTdl })
  │  XML-escapes company name and injects into XML envelope template
  ▼
Step 4: postHttp({ inXmlBody })
  │  Sends HTTP POST to Tally (http://localhost:9000) and returns XML text
  ▼
Caller receives raw XML string
```

---

## The Four Narrative Steps

Each step is encapsulated in its own focused module under `internal-working/execution/`:

### Step 1: Validate Company Name (`validateCompany.js`)

Verifies that the supplied company name is a non-empty string. Throws early if invalid:

```javascript
const startFunc = ({ inCompany }) => {
    const localCompany = inCompany;

    if (typeof localCompany !== "string" || !localCompany.trim()) {
        throw new TypeError("Company name is required.");
    }

    return localCompany.trim();
};

export default startFunc;
```

---

### Step 2: Direct TDL Lookup (`getTdl.js`)

Instead of crawling or traversing the JSON structure, the endpoint is retrieved in a single line using path reduction:

```javascript
const startFunc = ({ inSource, inRoutePath }) => {
    const localSource = inSource;
    const localRoutePath = inRoutePath;

    const endpoint = localRoutePath
        .split(".")
        .reduce((current, key) => current?.[key], localSource);

    return endpoint?.tdl;
};

export default startFunc;
```

---

### Step 3: XML Body Construction (`buildXmlBody.js`)

Safely escapes XML special characters (`&`, `<`, `>`, `"`, `'`) in the company name and substitutes `{company}` and `{collectionBody}` into the envelope template:

```javascript
const startFunc = ({ inCompany, inTdl }) => {
    const localCompany = inCompany;
    const localTdl = inTdl;

    return xmlEnvelopeTemplate
        .replace("{company}", escapeXml(localCompany))
        .replace("{collectionBody}", localTdl?.collection ?? "");
};

export default startFunc;
```

---

### Step 4: HTTP Transport (`postHttp.js`)

Performs a standard `POST` request to `http://localhost:9000` with `Content-Type: text/xml`:

```javascript
const url = "http://localhost:9000";
const headers = { "Content-Type": "text/xml" };

const startFunc = async ({ inXmlBody }) => {
    const localXmlBody = inXmlBody;

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: localXmlBody
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(`Tally request failed with HTTP ${response.status}: ${responseText}`);
    }

    return responseText;
};

export default startFunc;
```

---

### The Coordinator (`index.js`)

The main entry point reads like a 4-line story:

```javascript
import validateCompany from "./validateCompany.js";
import getTdl from "./getTdl.js";
import buildXmlBody from "./buildXmlBody.js";
import postHttp from "./postHttp.js";

const startFunc = async ({ inRoutePath, inCompany, inSource }) => {
    const localRoutePath = inRoutePath;
    const localCompany = inCompany;
    const localSource = inSource;

    const companyName = validateCompany({ inCompany: localCompany });
    const tdl = getTdl({ inSource: localSource, inRoutePath: localRoutePath });
    const xmlBody = buildXmlBody({ inCompany: companyName, inTdl: tdl });

    return await postHttp({ inXmlBody: xmlBody });
};

export default startFunc;
```

---

## Architectural Highlights

- **Direct Resolution:** No recursion, no skipping keys, no runtime guessing.
- **Single Responsibility:** Each file does exactly one job.
- **Strict Single Export:** Every file exports `export default startFunc;`.
