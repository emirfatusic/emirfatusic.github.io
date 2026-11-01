# Lap workbench implementation plan

Status: implemented and verified locally; implementation authorized by “Go on” and the D1 structure answer. Implements the approved workflow and Clear Air design in `design/lap-workbench.html`; production implementation follows below.

## Outcome

Publish `/lab/lap-compare/` on the existing GitHub Pages site. Open with the verified Sainz/Russell Singapore 2023 Q3 comparison, then allow comparison of the ten drivers with reported Q3 times in that session. Preserve Clear Air, both appearances, the keyboard/data-table path, source attribution and neutral public wording. The homepage Lab entry becomes a compact workbench preview; its scenic introduction, About and Contact stay intact.

## Existing pieces to reuse

- Vue 3.5, TypeScript 5.9, Vite 8, build-time Vue rendering and the passing GitHub Pages workflow.
- `ThemeToggle.vue`, the early `emir-theme` bootstrap, self-hosted Inter and approved scenery.
- Existing portfolio CSS as the shared foundation; workbench classes and local roles are scoped to its page. Avoid a global stylesheet rewrite.
- The design preview's 681 historical samples and source URLs, not its simulated network behavior or monolithic implementation.
- Playwright's five browser/device profiles and axe. Node 24's built-in test runner and TypeScript erasure can cover pure domain/provider contracts without adding a test dependency.

## Two implementation arrangements

**Recommended compact arrangement:** three owners: `telemetry.ts` for normalized domain types/alignment, `data.ts` for provider parsing, queue, versioned cache and source provenance, and `useComparison.ts` for selection/request/URL state. Two small view components own plots and the raw-data table. Approximately 29 changed/new/removed files, no new runtime dependency.

**More separated arrangement:** separate provider transport, API parsing, cache, scheduling and catalog modules in addition to the domain math and Vue controller. Same feature, failure and test contracts; approximately 33 files. Smaller individual data files, but more interfaces and opportunities for one policy to acquire several owners.

The compact shape hides the provider's wire/storage/rate details behind `load(driver, signal, refresh)` and exposes normalized recordings. It does not expose a staged load/validate/transform/save pipeline. UI consumers do not parse API payloads or maintain their own caches.

## File map (selected separated arrangement; estimates)

New (18):

1. `lab/lap-compare/index.html`
2. `src/lap/main.ts`
3. `src/lap/App.vue`
4. `src/lap/workbench.css`
5. `src/lap/telemetry.ts`
6. `src/lap/data.ts` — recording repository; only public data entry point
   - `src/lap/transport.ts` — HTTP timeout/status handling
   - `src/lap/parsing.ts` — wire validation/Q3 matching
   - `src/lap/cache.ts` — versioned bounded completed-record storage
   - `src/lap/scheduler.ts` — send-time admission, both limits/cancellation
7. `src/lap/useComparison.ts`
8. `src/lap/components/TracePlots.vue`
9. `src/lap/components/RawDataTable.vue`
10. `src/lap/snapshot.json`
11. `src/prerender-entry.ts`
12. `tests/unit/telemetry.test.mjs`
13. `tests/unit/data.test.mjs`
14. `tests/lap.spec.ts`

Update (14): `src/App.vue`, `src/content.ts`, `vite.config.ts`, `package.json`, `tsconfig.json`, `scripts/prerender.mjs`, `scripts/serve.mjs`, `scripts/size-report.mjs`, the three existing browser spec files, `README.md`, `DESIGN.md`, and `design/README.md`.

Retire (1): `src/components/CommandDialog.vue` and its obsolete generated plain-text route. Its source remains in Git history; the homepage's new source link goes to `src/lap/`.

Counts are a proposed arrangement, not a claim that every implementation detail is settled. QA/report artifacts are not included.

## Distribution and rendering

Use Vite multi-page input for the existing root and the new nested HTML entry. A shared SSR entry exports both app factories; prerender each template into its own `dist` path. Neither app fetches external data during build or SSR. The new page's initial Vue state is deterministic and matches the embedded default comparison before hydration.

The static preview server must resolve directory indexes and preserve query strings on slash redirects, matching Pages behavior. Verify a direct nested URL, a reload, root-to-workbench navigation and return to `/#lab`. Do not add a SPA router or a blanket 404 fallback.

Without JavaScript, show the saved comparison, reported sector values, explanatory text and source links. Provide a local CSV of the recorded default samples as the full data alternative; selection/refresh controls become available after hydration. Generate that CSV from the same snapshot so the two sources cannot drift.

## Data contract and interpretation

- One supported historical session: Singapore qualifying, `9161`, 16 September 2023. The source catalog was checked against OpenF1 driver and session-result records on 1 November 2026; ten drivers have a finite third qualifying duration.
- Default Sainz lap 19 is 90.984 s; Russell lap 16 is 91.056 s. Sector differences are reported arithmetic, not a conclusion about driving technique.
- Select a driver's completed, non-out lap that matches its reported Q3 duration in integer milliseconds. Do not choose the minimum lap time blindly, since a different qualifying segment or a deleted lap can mislead.
- Bound car-data queries using that lap's own approximate UTC start and duration. Do not clamp to the session's nominal end: verified valid Q3 laps extend beyond it.
- Parse provider responses at the boundary. Check session/driver identity, finite times and channels, sector totals, ordering and duplicate timestamps. Preserve missing channel values as missing, never zero. Retain explicit provenance and retrieval date.
- Estimated progress is a separate derived quantity, based on integrated sampled speed. It is not measured distance. A conservative coverage guard is required: missing speed, material gaps or missing edges must prevent an unsupported full-lap alignment. Valid reported times can remain available while an unreliable trace/readout is omitted and explained. The raw table still exposes usable timestamped values.
- Channel-specific missing values break that channel's path and show `Missing`. Do not visually join a missing interval or claim telemetry explains a 72 ms total difference. Brake is binary.

## Provider and cache boundary

Use only unauthenticated historical OpenF1 endpoints. No account, token, live feed, paid tier or proxy backend. The default pair is bundled so opening the page works immediately and offline. Fetch uncached selected drivers from the public API; keep only validated completed recordings.

The repository owns a bounded per-session cache (ten drivers), a versioned optional local-storage representation, and the request queue. Storage failures are nonfatal. Historical cache entries show their retrieval date; explicit refresh requests current provider data. A fallback always retains the actual recording's identity and date.

Enforce both published free limits: at most 3 requests/second and 30/minute. Count a request when it is sent, including sent requests later aborted. Canceled queued work consumes no slot. Honor `Retry-After` for 429 responses, use a request timeout, and never loop automatic retries. Pending work can be canceled by a new selection or navigation. Waiting for a queue slot is distinct from the network timeout.

## State ownership and sharing

```text
HTML + bundled snapshot -> deterministic saved comparison
                                  |
URL / selectors -> requested pair -> abort previous generation
                                  -> repository/cache/queue -> normalized recordings
                                  -> latest generation only -> applied comparison
                                                              -> sectors / plots / table
```

`requested` and `applied` are deliberately distinct. Names, times, legends, curves and readings render from one applied comparison. During a request, the last complete comparison remains named as such. Failure leaves it usable; success commits the new pair atomically. A late response cannot overwrite a newer selection even if a transport ignores cancellation.

The Vue controller owns the active request, selected sector, progress, history and view state. The provider owns source/cache state; plot components own no fetches or duplicate comparison state. Reuse completed cache results; do not add a general-purpose shared in-flight subscription framework for a single consumer.

Validate URL driver IDs against the catalog, reject an identical pair, and bound sector/progress. Driver changes create useful history entries; cursor movement and sector changes replace the current entry. Back/forward restores a comparison without creating a new history entry. Invalid links recover to a clearly identified saved comparison rather than fetching arbitrary sessions or URLs.

## UI integration

Keep the approved compact masthead, frosted selectors, joined sector controls, opaque plots and right-side inspector. Prefix workbench classes to prevent collisions with homepage `.site-header`, `.wrap` and `.footer`. Reuse the shared appearance component. Keep solid/dashed role identity when drivers swap.

The three trace paths are derived when data/range changes; moving the cursor updates only its marker and readings. Mouse dragging is optional enhancement; the native range remains the touch/keyboard path, and vertical touch scrolling across plots must work. The inline table exposes all usable raw samples with native pagination and contained horizontal scrolling. Open/close focus is deterministic. No modal is the primary lab interaction.

Replace the homepage's dialog experiment and its old notes/source references with the actual workbench entry and implementation decisions. Keep the existing hero headline and responsive glass navigation.

## Verification

Unit contracts using Node's built-in runner:

- Recorded totals, alignment bounds and source immutability; binary brake; missing/null channels, duplicates, sparse/late/invalid samples and incomplete coverage.
- Validated Q3 matching versus misleading faster laps; wrong session/driver, malformed/empty provider responses and missing sectors.
- Cache validation and storage failures; queue limits across both windows, aborted queued versus sent requests, timeout and 429 cooldown.

Browser contracts on the five existing profiles:

- Both prerendered routes, direct navigation, reload, no-JavaScript content and no hydration errors.
- Appearance continuity, contrast, forced browser darkening, reduced motion and 320px/390px overflow.
- Driver changes and swapping, sector focus, range keyboard input, all raw table pages and focus return.
- Share URL and back/forward; invalid and duplicate parameters.
- Delayed old response versus latest result, provider failure with correctly named saved data, partial/unavailable telemetry, Retry and blocked storage.

CI uses deterministic request fixtures; no test or build requires the public API. A separate bounded live smoke check verifies at least one non-default driver's real historical load before release. Automated checks do not stand in for a manual screen-reader or physical-device test.

Keep transfer reporting advisory. Report both root and workbench initial transfers, preserve lazy table rendering and avoid prefetching all drivers. A worker, virtualization library or chart package requires measured need; the default comparison has only 681 samples.

## Execution order

1. Settle arrangement and complete engineering review; preserve the approved design.
2. Establish the data/quality contract and repository tests, then implement its provider/cache behavior.
3. Add the Vue page/components and deterministic multi-page SSR path.
4. Replace the homepage lab entry and retire obsolete dialog expectations.
5. Run unit/browser/build checks; inspect light/dark desktop/mobile and failure states; review the final UI against the approved design.
6. Commit, push, let the existing passing-main workflow publish, then verify the live nested route and an actual historical comparison.

## NOT in scope

Live timing, additional seasons/sessions, user accounts, payments, precise racing-line or causal coaching claims, new decorative assets, a new design identity, third-party analytics, employer case studies and availability messaging.

## Binding decisions

D1: user selected **B — More separated arrangement** in reply to `call_7ab3082d0fd5490d9380b09919834ecc`. Feature answers: no cuts proposed; structure B; accepted scope: all approved workflow, design, data, error, accessibility and test contracts above; pending remedies: none. Read back against the actual answer. Provider internals remain owned by the repository boundary to the repository; the controller calls only `load`.

## Engineering review dispositions

Architecture: the existing root-only prerender and file-only preview cannot serve the new page; the distribution changes above address both. Wire, storage and queue policies each have one owner in B. No staged UI parsing, duplicated caches or transport DTOs in views. UI-only state stays in the controller. The alternative compact shape hides the same policy behind fewer files; B was explicitly chosen. No new product choice is required.

Code quality: reuse ThemeToggle and the existing foundation, keep workbench names scoped, delete the old primary demo rather than maintain two examples. The catalog is a single normalized source. The bundled snapshot is the single source for default plots and CSV. Public source links use the repository folder. No separate TODO is needed.

Tests: existing dialog navigation/focus tests cease to describe the product and must be replaced by real route, table focus, selection/history and recovery contracts. Preserve homepage word-boundary, theme, native navigation and artwork-failure coverage. Pure-domain and provider tests cover new branches; browser tests cover user-visible flows. No tests currently prove a workbench route (it does not exist yet).

Performance: default 681 samples [measured: design/README.md], ten catalog entries [measured: OpenF1 session_result, 2026-11-01]. Bound storage to one session/ten drivers, cap both request windows, never fetch on SSR or all drivers on load. Render a paginated table on demand; memoize trace paths independently of cursor. No worker/chart dependency is justified by this scale. Transfer sizes remain advisory and are measured after build.

Quality guard: require valid speed throughout, samples within one second of each lap edge and no inter-sample gap above 1.5 seconds before estimating full-lap progress. These conservative display guards are an implementation heuristic, not a provider accuracy promise. Actual default and Leclerc probes pass (maximum Leclerc gap 0.92 s). Withhold aligned plots when the guard fails; retain reported sectors and raw data. Brake remains binary.

Outside review coverage is unavailable: Claude Code is absent and this host offers no native Plan agent/TaskStop combination. No general-purpose reviewer substitutes for that required role. Continue with native engineering review and disclose the missing coverage.

## Implementation Tasks

- [x] T1 (P1, estimated human 1 day / Codex 1 hour) — implement domain, parsing, transport, bounded cache and scheduler, with boundary tests. Surfaced by Architecture/data-quality requirements.
- [x] T2 (P1, estimated human 1 day / Codex 1 hour) — implement deterministic nested route, Vue controller and approved components; retire dialog integration. Surfaced by Architecture/distribution and Code quality.
- [x] T3 (P1, estimated human 1 day / Codex 1 hour) — verify unit/browser recovery and history, no-JS content, both themes, visual fidelity, transfer sizes and actual nondefault OpenF1 load. Surfaced by Test/Performance.

Sequential implementation in this session. Data owners precede controller/views; distribution can be developed independently but shares app/build files with UI integration, so no simultaneous edits. Estimates assume reuse of the approved prototype, not a new design.

## Implementation verification

Verified 1 November 2026: build/type checks, 14 Node contract tests and 120 Playwright tests across desktop Chromium/Firefox/WebKit plus mobile Chromium/WebKit. The suite covers missing data, blocked storage, cancellation, HTTP failure/retry, both request windows, a stalled-request timeout, URL history, both manual appearances under opposite device preferences, no-JavaScript output, table focus and narrow layouts. The Impeccable finish review identified one explicit-light override defect; the fix was confirmed resolved on recapture. Automated checks are not manual screen-reader or physical-device certification.

A separate live browser smoke loaded Charles Leclerc’s actual Q3 lap 20 (91.063 seconds, 337 samples) from the public historical API. Encoded initial workbench transfer was approximately 249 KiB at both measured widths; root mobile was approximately 173 KiB. These are measured local preview results, not network latency guarantees. Publication follows the repository’s existing passing-main workflow.
