# Design and verification map

DecisionTrail helps residents distinguish a recorded municipal action from an unsupported conclusion. This note maps the implemented prototype to requirements; it is not a specification for automated ingestion or a claim of comprehensive acceptance. The design is deliberately small: three manually reviewed archival records, a browser-only interface and official evidence links.

## Requirements and evidence

Test names below are literal names in the linked source. They identify existing checks, not new tests run for this document.

| Requirement | Implemented mechanism | Verification and limit |
| --- | --- | --- |
| Select a known example without changing its factual record. | `selectCase` returns the matching object; `render` rebuilds the detail panel and updates button `aria-pressed`. | [core tests](../test/core.test.js): `known item selection preserves exact record`; `unknown selection safely chooses first record; empty list yields null`. These test selection, not DOM behavior. Hosted keyboard selection was separately checked. |
| Keep the action and its limits together. | Each record supplies `summary` and `notDecided`; `app.js` places them in adjacent sections. | `synthetic invalid record rejected: missing qualification` rejects an empty boundary. `real MM vote is procedural and lost despite majority` protects the procedural-vote interpretation. Source review, not validation alone, establishes factual accuracy. |
| Make evidence traceable to the correct official item. | Validation requires the exact item URL derived from the ID and nonempty evidence locators. Native `details` controls expose locators and links. | `synthetic invalid record rejected: mismatched evidence URL` and `synthetic invalid record rejected: missing evidence`; [glyph tests](../test/glyphs.test.js): `source link wording and destinations remain descriptive without decorations`. Links open whole item pages, not highlighted passages. |
| Never infer a live participation opportunity from a historical date. | `participationView` requires unknown status with no specified deadline. Recorded actions and participation are separate sections. | `all real cases remain archival with unknown participation`; `real TE report target is not represented as participation deadline`; `real IE trail does not invent a next Council stage`. Synthetic open-status/deadline mutations are rejected. |
| Support usable navigation without decorative-font dependence. | Native buttons/disclosures, skip link, visible focus styles, polite selection announcement, and hidden nonfocusable SVG decoration. | `brand decoration is a hidden non-focusable vector with explicit dimensions`; bounded hosted keyboard and glyph checks. [Harness tests](../test/viewport-harness.test.js) include `width changes affect only harness frame attributes, not app contents`. CSS-frame inspections are not physical-device, screen-reader or OS reduced-motion acceptance. |

## Implemented sequence

```mermaid
sequenceDiagram
    actor Resident
    participant App as app.js
    participant Core as core.js
    participant Data as cases.js records
    participant DOM as Browser DOM
    App->>Core: validateCases(cases)
    Core->>Data: inspect curated records
    Core-->>App: valid or throw
    Note over App,DOM: On validation error: show warning and stop initialization
    App->>DOM: create selectors; render first case
    Resident->>DOM: activate case button
    DOM->>App: click handler with record ID
    App->>Core: selectCase(cases, id)
    Core-->>App: matching record or first record
    App->>Core: participationView(record)
    Core-->>App: unknown-participation disclosure
    App->>DOM: replace details; update pressed state and announcement
    Resident->>DOM: expand evidence; follow official link
    Note over Resident,DOM: Browser navigates to City site; no app-side source fetch
```

In plain text: startup validates bundled data before creating selectors. A click selects a record, renders its explanation and updates accessible state. Evidence disclosure uses the browser's native control; following a link leaves the prototype. The diagram groups rendering operations for readability, not as an exact instruction-by-instruction trace.

## Boundaries and maintenance decisions

The validator checks this supported curated shape, not arbitrary hostile imports or the truth of municipal prose. There is no importer, backend, database, account, analytics or runtime model. Case text is rendered with `textContent`, not HTML interpolation. Ordinary hosting requests and deliberate navigation to external sources still occur.

Static delivery avoids operating a server and keeps the explanation inspectable. More records would primarily increase human rights checking, interpretation and refresh work; this prototype does not demonstrate automated scaling. Before extending it, maintain the paired qualification, item-specific locators and explicit unknowns. Changes to accepted participation states require a new evidence model, not merely relaxing validation. Update visible snapshot dates and tests together when records change.

See the [README](../README.md) for run commands, source/rights references, standard-API dependencies and AI-development disclosure; the [Municipal Readiness Report](municipal-readiness-report.pdf) covers operating costs and municipal adaptation. No resident-comprehension benefit has yet been measured.
