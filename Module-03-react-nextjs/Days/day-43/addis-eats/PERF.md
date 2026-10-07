# Day 43 Performance Report

## Baseline

The baseline was measured against the production build using:

```text
npm run build
npm run start
```

Lighthouse configuration:

* Lighthouse 13.4.1
* Mobile / Moto G Power
* Slow 4G throttling
* Incognito window
* Navigation / initial page load
* URL: `http://localhost:3000/menu`

### Baseline Metrics

| Metric                         | Result |
| ------------------------------ | -----: |
| Performance                    |     88 |
| First Contentful Paint (FCP)   |  0.8 s |
| Largest Contentful Paint (LCP) |  2.6 s |
| Total Blocking Time (TBT)      | 350 ms |
| Cumulative Layout Shift (CLS)  |      0 |
| Speed Index (SI)               |  1.3 s |

### Lighthouse Findings

The baseline identified:

* Legacy JavaScript: estimated 13 KiB savings
* Render-blocking requests: estimated 90 ms savings
* Unused JavaScript: estimated 25 KiB savings
* Main-thread work: 2.8 s
* 7 long main-thread tasks

### Notes

The first Lighthouse run was discarded because Lighthouse reported that browser-cache clearing timed out and that stored IndexedDB data could affect the measurement.

A second run was performed in an Incognito window. The Incognito result above is the baseline used for this project.

The application does not currently use meaningful content images, so no artificial images were added solely to demonstrate `next/image`. Image optimization will only be introduced if actual image content is added to the application.

The existing application already uses `next/font` for its fonts.

## Optimization Plan

The next optimization should target an actual measured bottleneck rather than adding unnecessary dependencies or features.

After each meaningful optimization:

1. Build the production application.
2. Start the production server.
3. Run Lighthouse under the same conditions.
4. Record the new metrics.
5. Compare them with this baseline.