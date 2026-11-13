# DecisionTrail

A small, static CIVIC Hack 2026 prototype for understanding what a municipal record establishes, and what it does not. Three July 2026 Toronto cases illustrate a Council referral, an adopted request for a later report, and a committee referral to staff.

**This is an archival explanatory snapshot, not a live civic feed or hearing finder.** No current participation deadline is verified. Later proceedings may exist. The prototype does not supply legal advice, verify speaking eligibility, collect personal data or submit comments.

## Run and test

No installation or runtime dependencies are required. Open `index.html` in a browser. The classic scripts also support `file:` loading without a module server. Alternatively serve this directory with an already-installed static HTTP server. The app makes no fetch, model or analytics requests; loading its files still involves ordinary hosting requests, and official links navigate when selected.

With Node.js 24 (tested):

```sh
npm test
npm run check
```

The 22 Node tests comprise 18 app/regression tests and four viewport-harness tests. They cover the three real-case invariants, separately labelled synthetic invalid-record mutations, font-independent-decoration regressions and the inspection harness. Syntax checking covers all three scripts. These automated checks are separate from browser acceptance. Bounded hosted desktop visual/keyboard checks passed, including a fresh post-deployment check of the corrected glyphs. The actual app was also inspected in 320, 390 and 768 CSS-pixel iframe viewports, with no horizontal overflow in the inspected states. This is not physical-device, OS reduced-motion or screen-reader acceptance.

## Workflow

Choose one of three archived examples. Read the paired **What this establishes** and **What this does not establish** panels. Follow the recorded body, action and date, then expand evidence controls for the official item link and section locator. The link opens the item page, not a highlighted passage. Participation information is separate and explicitly unknown for future proceedings.

The procedural 13–9 vote in MM43.16 did not meet the two-thirds threshold to waive referral. It is not presented as a policy vote. TE34.98's second-quarter 2027 report-back target is not a participation deadline or proof of completed works. IE31.8 does not assume that Council is the next stage after a committee refers something to staff.

## Sources and rights

Facts were manually checked against these official records on **November 13, 2026 at 00:12:19 UTC**, as recorded by the source-verification worker:

- https://secure.toronto.ca/council/agenda-item.do?item=2026.MM43.16
- https://secure.toronto.ca/council/agenda-item.do?item=2026.TE34.98
- https://secure.toronto.ca/council/agenda-item.do?item=2026.IE31.8
- General participation guidance: https://www.toronto.ca/city-government/council/council-committee-meetings/participate/

All explanatory prose is independently written. No City document, correspondence, image, logo, full dataset or copied passage is bundled. Identifiers, factual actions and section labels identify the sources. Toronto's open-data licence is **not** asserted for general agenda pages; the wider website copyright and third-party rights remain separate. The original institutional records remain on the City website. No affiliation or endorsement is claimed.

No official record can establish the absence of all later related proceedings. The linked IE29.1 report was not inspected. All three displayed meeting dates are historical. The general speaking rule is deliberately not transformed into a deadline for these examples. No source date is computed from the device clock.

## Architecture

`cases.js` holds the three manually curated factual records and their evidence locators. `core.js` validates the supported archival schema, selects a record and produces the unknown-participation disclosure. It rejects unsupported open-status or deadline claims rather than inferring them. `app.js` renders DOM nodes using `textContent`; no case text is injected as HTML. `style.css` contains responsive layouts, visible focus styles and a reduced-motion override. There are no accounts, backend, external fonts, analytics, tracking, model calls or persistent storage.

```text
cases.js -> core validation -> app.js DOM rendering -> official source links
                              style.css / index.html
```

This diagram describes the current code, not a planned automated ingestion pipeline.

[Design and verification map](docs/design.md): implemented requirements, sequence and trust boundaries, with links to the existing checks and their limits.

## Fresh-work and AI disclosure

The organizer's build window opened **November 13, 2026 at 00:00 UTC**. Public rules and the selected challenge were reverified during the 00:07:57–00:10:12 admission review. Concrete case feasibility completed at 00:12:19. Implementation was assigned and created after those checks, within the open window; the original README checkpoint was written at 00:22 UTC, and this documentation revision was prepared with the subsequent glyph fix. Filesystem display timezone is not used as evidence of a different build date. No prior project code was reused.

An OpenAI assistant generated the implementation, independently written explanations, documentation and tests. Separate assistant reviewers checked source facts and scope, and independently ran tests and reviewed claims/code. This does not replace native accessibility, perceptual media or final human eligibility attestations. The code uses only browser and Node standard APIs; no third-party package is bundled. No AI service is called by the app.

## Current delivery and remaining acceptance

- Source and the live prototype are published at https://sharonbasovich.github.io/decisiontrail/. The hosted glyph correction passed a fresh visual check. Bounded desktop checks covered case selection, evidence disclosure, skip link, visible focus and an official-link/Back journey. Selected states and keyboard/focus flows were also checked in actual-app iframes at 320, 390 and 768 CSS pixels. These are not exhaustive browser, physical-device, OS reduced-motion or assistive-technology tests; resident comprehension has not been measured.
- Source facts and locators need final review against the frozen submission version; they are a bounded snapshot, not comprehensive data accuracy.
- The reviewed one-page Municipal Readiness Report is published below. A locally selected interaction demo has not been uploaded: YouTube delivery is blocked pending sign-in. No live video URL or completed hosted-video acceptance is claimed.
- DecisionTrail's Devpost draft 1300125 is saved but **not submitted**. Final video delivery, applicable declarations and final submission checks remain open. No release or completed event submission is claimed.
- No new credentials, account permissions or held Discord sign-in were used.

Do not represent the prototype or saved draft as a submitted or fully accepted deliverable.

## Municipal Readiness Report

[Read the one-page Municipal Readiness Report](docs/municipal-readiness-report.pdf). This reviewed report describes the archival prototype snapshot and its costs, privacy boundaries and remaining pilot limitations. Publication is not an event submission or a claim of final acceptance; video delivery and final entry submission remain incomplete.

## CSS viewport inspection harness

[Open the test-only viewport harness](tools/viewport-check.html) and select 320, 390 or 768 CSS pixels. Use case selectors and evidence disclosures inside the actual embedded app; inspect wrapping, overflow and keyboard focus. Open external sources through the normal app outside the frame to avoid confusing external frame policies with link failures. This checks iframe CSS viewports only, not physical devices, mobile browser emulation, OS preferences, reduced-motion behavior or assistive technology. The suite now contains 22 tests: 18 app/regression tests and 4 harness tests.
