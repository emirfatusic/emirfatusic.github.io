# Lap workbench design preview

[lap-workbench.html](lap-workbench.html) is an interactive design study for a future `/lab/lap-compare/` page. It extends the portfolio's Clear Air system, documented in [DESIGN.md](../DESIGN.md).

The study is separate from the production application and is not included in its Vite build. It demonstrates the layout, both appearances, sector focus, a linked cursor, driver-role swapping and a paginated data alternative. The review toolbar explicitly simulates loading, provider failure and partial telemetry. It does not make API requests or demonstrate a completed network/cache implementation.

The HTML references the existing local fonts and scenery under `public/`. Serve the repository locally to preview it with those paths. No new illustration or font asset was created for this page.

## Recorded data

The embedded sample is Singapore qualifying on 16 September 2023, OpenF1 session `9161`:

| Driver         | Number | Lap | Reported Q3 time | Samples |
| -------------- | ------ | --- | ---------------- | ------- |
| Carlos Sainz   | 55     | 19  | 1:30.984         | 341     |
| George Russell | 63     | 16  | 1:31.056         | 340     |

Both lap times were checked against the third duration in OpenF1's `session_result` records. The three sector durations sum to each lap time. Russell is 0.093 seconds quicker in sector 2; Sainz is quicker in sectors 1 and 3, for a net reported advantage of 0.072 seconds.

Sources, checked 1 November 2026:

- [Session metadata](https://api.openf1.org/v1/sessions?session_key=9161)
- [Sainz lap records](https://api.openf1.org/v1/laps?session_key=9161&driver_number=55)
- [Russell lap records](https://api.openf1.org/v1/laps?session_key=9161&driver_number=63)
- [Sainz qualifying results](https://api.openf1.org/v1/session_result?session_key=9161&driver_number=55)
- [Russell qualifying results](https://api.openf1.org/v1/session_result?session_key=9161&driver_number=63)
- [API field definitions](https://openf1.org/docs/)
- [Access and intended uses](https://openf1.org/#sponsorship)

The exact bounded `car_data` request URL is preserved with each embedded recording. Arrays store elapsed seconds from the lap's approximate start, speed in km/h, throttle percentage, brake state and gear. API-server code licensing is separate from rights in upstream data; this personal, non-commercial study credits the source without claiming unrestricted data rights.

## Interpretation boundaries

- Telemetry is sampled at approximately 3.7 Hz. It cannot establish the cause of a 72 ms lap-time difference.
- Brake is on/off, not measured pressure.
- Progress is derived by trapezoidal integration of sampled speed, normalized separately for each recording. It is an approximate comparison axis, not a measured track position. Readouts show the nearest observed sample.
- Reported lap/sector times stay separate from that derived progress.
- The data table exposes all 681 recorded samples, ordered by estimated progress and paginated in groups of 20. The partial-data demonstration omits the simulated missing samples rather than inventing replacement values.
- Query telemetry by each lap's own start and duration. The session's nominal end time can precede valid late lap records.

Production networking, dataset selection, alignment quality thresholds, URL integration and server-rendered fallbacks still require an implementation plan. The design study does not certify those behaviors.
