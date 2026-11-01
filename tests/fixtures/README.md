# OpenF1 historical fixture

`leclerc-q3.json` contains the actual completed lap record and 337 car-data samples for Charles Leclerc, lap 20 of Singapore qualifying 2023, session `9161`. Retrieved 1 November 2026 from the public historical API. The reported Q3 duration is 91.063 seconds; sectors are 26.754, 38.428 and 25.881 seconds.

Sources:

- `https://api.openf1.org/v1/laps?session_key=9161&driver_number=16`
- `https://api.openf1.org/v1/car_data?session_key=9161&driver_number=16&date%3E=2023-09-16T14%3A26%3A57.046&date%3C=2023-09-16T14%3A28%3A28.109`

Tests use this recording to avoid a live-provider dependency. Failure and missing-speed cases deliberately alter fixture responses; they do not describe the historical recording. Default-driver HTTP fixtures are derived from the same recorded snapshot that ships with the page. Data is credited to OpenF1; no unrestricted rights in upstream data are claimed.
