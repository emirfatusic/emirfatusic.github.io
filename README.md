# Emir's portfolio

A personal corner of the web: thoughtful interfaces, frontend craft, and a qualifying-lap workbench.

Built with Vue 3, TypeScript and Vite. Both pages render to HTML at build time, then hydrate the same components in the browser. GitHub Pages serves static files only.

## Development

Use Node 24 and npm:

```sh
npm ci
npm run dev
```

## Production and checks

```sh
npm run build
npx playwright install --with-deps chromium firefox webkit
npm test
npm run preview
```

The preview runs at `http://127.0.0.1:4173`. With it running, `npm run size` reports initial transfer sizes for both pages at desktop and mobile widths. Targets are advisory. `npm run test:unit` runs domain/provider contracts with Node's native test runner.

Playwright exercises Chromium, Firefox, WebKit and mobile-sized Chromium/WebKit. Checks include prerendered content without JavaScript, hydration, navigation, appearance continuity, data selection and history, stale requests, provider failures/retry, missing data, keyboard controls, table focus, narrow layouts and axe. CI uses recorded fixtures, never the live API. Automated checks complement manual keyboard, screen-reader and physical-device inspection.

## Lap workbench

[/lab/lap-compare/](https://emirfatusic.github.io/lab/lap-compare/) compares two drivers' reported Q3 laps from Singapore qualifying on 16 September 2023 (OpenF1 session `9161`). The saved Sainz/Russell pair opens immediately without a provider request. The selector includes all ten drivers with a reported Q3 time in the verified session catalog. Uncached selections use OpenF1's free historical API directly; no account, token, backend or live subscription is needed.

Reported lap and sector timings remain distinct from estimated progress. Progress integrates sampled speed separately for each lap; it is not measured track distance. Readings use the nearest sample. Brake is binary, not pressure. Missing channel values stay missing. Alignment is withheld if speed is missing, samples miss either lap edge by more than one second, or an inter-sample gap exceeds 1.5 seconds. These are conservative display heuristics, not an accuracy guarantee. Reported times and raw samples remain available when alignment is unavailable.

The data table is paginated inline, and a generated CSV exposes all 681 bundled samples without JavaScript. Source URLs and retrieval dates appear in the comparison disclosure. Historical data is attributed to [OpenF1](https://openf1.org/docs/); the interface is an unofficial, personal, non-commercial experiment and makes no unrestricted data-rights claim.

### Code boundaries

- `src/lap/telemetry.ts`: normalized types, quality guard, estimates and formatting.
- `src/lap/parsing.ts`: external response validation and matching completed laps to reported Q3 times.
- `src/lap/scheduler.ts`: admission against both free limits, 3 requests/second and 30/minute, counted at send time.
- `src/lap/transport.ts`: HTTP errors, 15-second request timeout and `Retry-After` cooldown. Requests are not automatically retried.
- `src/lap/cache.ts`: validated, versioned completed recordings, bounded to this session's ten drivers. Browser-storage failures are nonfatal.
- `src/lap/data.ts`: the repository entry point, catalog and bundled default. Views do not parse provider payloads.
- `src/lap/useComparison.ts`: requested versus applied pair, cancellation, generation guards, sectors, cursor and URL history.
- `src/lap/components/`: SVG traces and paginated raw table, with no network ownership.

A failed or superseded request cannot relabel the displayed data. The URL validates driver IDs and records sector/progress; copying a comparison link uses the displayed pair. Refresh explicitly requests current provider data. The rate budget is local to this page; the API can also throttle traffic originating elsewhere, which is handled as a recoverable error.

No third-party runtime dependencies were added for charts, state or routing. The root portfolio remains independent of OpenF1. Local fonts and artwork require no external service.

## Appearance and contact

Light and dark appearances follow the device preference until the visitor chooses an override using the header button. The choice persists locally when storage is available. An early script resolves it before hydration; CSS follows the device preference without JavaScript. Appearance colors use standard CSS `light-dark()`.

Contact uses Emir's LinkedIn profile; GitHub remains available for code. The public design system is [DESIGN.md](DESIGN.md), and the original design study is preserved under [design/](design/).

## Publishing

`Check portfolio` validates changes without publishing. `Publish portfolio` builds and tests every push to `main`, then deploys that exact static output to GitHub Pages only when its checks pass. The site is https://emirfatusic.github.io/.

## Assets

The scenic artwork was generated for this site. It is decorative, not a photograph of a specific location. Asset provenance is recorded with the source artwork. Inter is distributed under the SIL Open Font License, included in `public/fonts/OFL.txt`.
