# DecisionTrail

A small, static CIVIC Hack 2026 prototype for understanding what a municipal record establishes, and what it does not. Three July 2026 Toronto cases illustrate a Council referral, an adopted request for a later report, and a committee referral to staff.

**This is an archival explanatory snapshot, not a live civic feed or hearing finder.** No current participation deadline is verified. Later proceedings may exist. The prototype does not supply legal advice, verify speaking eligibility, collect personal data or submit comments.

## Run and test

No installation or runtime dependencies are required. Open `index.html` in a browser. The classic scripts also support `file:` loading without a module server. Alternatively serve this directory with an already-installed static HTTP server. No network requests are made by the application; official links navigate only when selected.

With Node.js 24 (tested):

```sh
npm test
npm run check
```

The 14 Node tests cover the three real-case invariants and separately labelled synthetic invalid-record mutations. Syntax checking covers all three scripts. These are not native visual, keyboard, screen-reader or responsive acceptance tests. Actual browser acceptance remains pending. An independent reviewer reported a local Chromium launch blocked before app load; this project does not work around that restriction.

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

## Fresh-work and AI disclosure

The organizer's build window opened **November 13, 2026 at 00:00 UTC**. Public rules and the selected challenge were reverified during the 00:07:57–00:10:12 admission review. Concrete case feasibility completed at 00:12:19. Implementation was assigned and created after those checks, within the open window; this README checkpoint was written at 00:22 UTC. Filesystem display timezone is not used as evidence of a different build date. No prior project code was reused.

An OpenAI assistant generated the implementation, independently written explanations, documentation and tests. Separate assistant reviewers checked source facts and scope, and independently ran tests and reviewed claims/code. This does not replace native accessibility, perceptual media or final human eligibility attestations. The code uses only browser and Node standard APIs; no third-party package is bundled. No AI service is called by the app.

## Remaining acceptance and delivery gates

- Real desktop and narrow-screen rendering, keyboard flows, repeated selection, evidence disclosure and reduced-motion behavior need native verification.
- Source facts and locators need final review against the frozen release version; they are a bounded snapshot, not comprehensive data accuracy.
- This repository publishes reviewed source only. Hosting, a release, video, report PDF and event submission remain incomplete; browser acceptance remains pending.
- The one-page Municipal Readiness Report requirement remains controlling despite the untouched organizer template rendering as two pages. A completed 2–3-minute demo still requires its applicable perceptual review.
- No new credentials, account permissions or held Discord sign-in were used.

Do not represent this local checkpoint as a submitted or fully accepted deliverable.
