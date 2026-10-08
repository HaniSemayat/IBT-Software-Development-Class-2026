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


## Day 43 — After Optimization Measurement

### Test Conditions

- URL: `http://localhost:3000/menu`
- Lighthouse: 13.4.1
- Browser: Chromium 154.0.0.0
- Device: Moto G Power
- Network: Slow 4G
- Mode: Mobile
- Session: Incognito
- Load: Initial page load
- Captured: October 8, 2026

### Results

| Metric | Baseline | After | Difference |
|---|---:|---:|---:|
| Performance | 88 | 77 | -11 |
| FCP | 0.8 s | 0.8 s | 0.0 s |
| LCP | 2.6 s | 2.0 s | -0.6 s |
| TBT | 350 ms | 1,030 ms | +680 ms |
| CLS | 0 | 0 | 0 |
| Speed Index | 1.3 s | 1.5 s | +0.2 s |

### Findings

The second Lighthouse run produced mixed results.

LCP improved from 2.6 s to 2.0 s, while FCP and CLS remained unchanged.

However, Total Blocking Time increased to 1,030 ms. Lighthouse also reported:

- 3.9 s main-thread work
- 1.7 s JavaScript execution
- 10 long main-thread tasks
- 25 KiB estimated unused JavaScript
- 13 KiB estimated legacy JavaScript

Because Lighthouse measurements are estimates under CPU and network throttling, the lower Performance score is not treated as proof that the SearchBox cleanup caused the regression.

The optimization therefore remains a measured experiment rather than a claimed performance improvement.

### Day 43 Conclusion

The project now has:

- production Lighthouse baseline
- environment variable configuration
- `.env.example`
- `metadataBase` configured from `NEXT_PUBLIC_SITE_URL`
- existing `next/font` optimization
- cleaned menu search rendering
- production measurement after the changes
- documented performance findings

No artificial images or third-party scripts were added because Addis Eats does not currently require them.

Further JavaScript optimization should be based on profiling evidence rather than removing Client Components or dependencies blindly.