# Day 45 — Performance Report

## Goal

Measure the production application, document optimization experiments, and identify remaining performance bottlenecks using Lighthouse evidence.

This report preserves the Day 43–44 measurements and defines the Day 45 verification required for deployment.

## Test Setup

- Lighthouse 13.4.1
- Chromium 154
- Mobile emulation: Moto G Power
- Network throttling: Slow 4G
- Incognito/InPrivate session
- Initial page load
- URL: `http://localhost:3000/menu`
- Production build: `npm run build`, followed by `npm run start`

These measurements are individual runs, not a controlled benchmark. Simulated network conditions, browser state, application content, and main-thread activity can cause results to vary.

## Baseline

The baseline was captured before the latest menu image changes.

| Metric | Baseline |
|---|---:|
| Performance | 88 |
| First Contentful Paint (FCP) | 0.8 s |
| Largest Contentful Paint (LCP) | 2.6 s |
| Total Blocking Time (TBT) | 350 ms |
| Cumulative Layout Shift (CLS) | 0 |
| Speed Index (SI) | 1.3 s |

Baseline findings:

- Legacy JavaScript: estimated 13 KiB savings
- Render-blocking requests: estimated 90 ms savings
- Unused JavaScript: estimated 25 KiB savings
- Main-thread work: 2.8 s
- Seven long main-thread tasks

## Follow-up Measurements

### Run 2 — October 8, 2026

| Metric | Result |
|---|---:|
| Performance | 77 |
| FCP | 0.8 s |
| LCP | 2.0 s |
| TBT | 1,030 ms |
| CLS | 0 |
| SI | 1.5 s |

Findings:

- Main-thread work: 3.9 s
- JavaScript execution: 1.7 s
- Ten long main-thread tasks
- Unused JavaScript: estimated 25 KiB savings
- Legacy JavaScript: estimated 13 KiB savings

### Run 3 — October 9, 2026

| Metric | Result |
|---|---:|
| Performance | 70 |
| FCP | 0.8 s |
| LCP | 4.2 s |
| TBT | 660 ms |
| CLS | 0 |
| SI | 1.9 s |

Findings:

- Image delivery: estimated 80 KiB savings
- Legacy JavaScript: estimated 13 KiB savings
- Render-blocking requests: estimated 80 ms savings
- Unused JavaScript: estimated 25 KiB savings
- JavaScript execution: 1.8 s
- Main-thread work: 3.6 s
- Eleven long main-thread tasks
- Back/forward cache restoration was prevented for two reported reasons

## Image Optimization

The menu uses local WebP food images and Next.js `Image`.

The implementation includes:

- Explicit image dimensions
- Responsive `sizes`
- Meaningful alternative text
- Priority for the first menu image
- Next.js image optimization through `/_next/image`

The browser Network panel confirmed optimized image requests, for example:

`/_next/image?url=%2Fdishes%2Ftibs.webp&w=640&q=75`

This confirms that the Next.js image optimization endpoint is being used. It does not, by itself, prove an improvement in overall page performance.

Lighthouse previously estimated 80 KiB in potential image-delivery savings. The exact resources identified by the audit should be reviewed before further image changes.

## October 10 Experiments — Server Rendering and Image Priority

### Run 4 — Server-rendered initial menu

The menu page fetches its initial dishes in the Server Component and passes the first page to the client search component as `initialData`. SWR uses this data for the initial unfiltered page, while subsequent searches and pagination continue to use the API.

| Metric | Result |
|---|---:|
| Performance | 72 |
| FCP | 0.9 s |
| LCP | 3.1 s |
| TBT | 1,000 ms |
| CLS | 0 |
| SI | 1.5 s |

Findings:

- Unused JavaScript: estimated 26 KiB savings
- Main-thread work: 4.2 s
- JavaScript execution: 1.7 s
- Thirteen long main-thread tasks
- Image delivery: estimated 80 KiB savings

### Run 5 — Explicit LCP image priority

The first image on the default first page receives `priority`, `fetchPriority="high"`, and `loading="eager"`. Other images use automatic fetch priority and lazy loading.

| Metric | Result |
|---|---:|
| Performance | 73 |
| FCP | 0.9 s |
| LCP | 3.4 s |
| TBT | 800 ms |
| CLS | 0 |
| SI | 1.8 s |

LCP breakdown:

| Component | Duration |
|---|---:|
| Time to First Byte | 70 ms |
| Resource load delay | 170 ms |
| Resource load duration | 130 ms |
| Element render delay | 440 ms |

Other findings:

- Legacy JavaScript: estimated 13 KiB savings
- Main-thread work: 3.9 s
- JavaScript execution: 1.7 s
- Unused JavaScript: estimated 26 KiB savings
- Nineteen long main-thread tasks
- Render-blocking requests remained an audit finding

The observed resource-load delay was approximately 170 ms in this run, compared with approximately 990 ms in an earlier breakdown. However, LCP increased from 3.1 s to 3.4 s between Runs 4 and 5. The performance score increased by only one point. These results do not establish a consistent overall performance improvement.

## Results Interpretation

The results are mixed.

Compared with the original baseline, the latest recorded run has:

| Metric | Baseline | Latest recorded | Difference |
|---|---:|---:|---:|
| Performance | 88 | 73 | -15 points |
| FCP | 0.8 s | 0.9 s | +0.1 s |
| LCP | 2.6 s | 3.4 s | +0.8 s |
| TBT | 350 ms | 800 ms | +450 ms |
| CLS | 0 | 0 | Unchanged |
| SI | 1.3 s | 1.8 s | +0.5 s |

The October 8 run had a lower LCP than the baseline but substantially higher TBT. Later runs varied in both LCP and TBT.

The lower resource-load delay is promising, but LCP remains above the commonly recommended 2.5-second threshold for a good user experience. Main-thread work and the 440 ms element render delay also warrant investigation.

These runs are not a perfectly controlled experiment. Application content changed as real food images and new rendering behavior were introduced, and Lighthouse results vary under simulated conditions. The measurements do not prove that one specific code change caused the differences.

INP was not directly measured in these initial-load reports. TBT is a diagnostic metric and must not be presented as an INP measurement.

## Day 45 Performance Targets

The following are project targets, not achieved results.

| Metric | Target | Current evidence | Status |
|---|---|---|---|
| Mobile throttled LCP | Under 2.5 s | Latest local run: 3.4 s | Not met |
| CLS | Under 0.1 | Latest local run: 0 | Met locally |
| First Load JS for `/menu` | Under 120 kB | Requires build-output verification | Not verified |
| Largest delivered image | Under 150 kB | Requires image-size verification | Not verified |
| Lighthouse Performance | At least 90 | Latest local run: 73 | Not met |
| Deployed Lighthouse results | Recorded for deployed site | Not recorded yet | Pending |

The existing local results must not be described as deployed-site measurements.

## Day 45 Deployment Verification

After deploying the application, run Lighthouse against the actual production domain under consistent mobile throttling conditions.

Record the deployed URL and test date, then populate this table with actual results:

| Metric | Local latest | Deployed result |
|---|---:|---:|
| Performance | 73 | Pending measurement |
| FCP | 0.9 s | Pending measurement |
| LCP | 3.4 s | Pending measurement |
| TBT | 800 ms | Pending measurement |
| CLS | 0 | Pending measurement |
| SI | 1.8 s | Pending measurement |

Use the same Lighthouse version, device emulation, throttling, and initial-load procedure where possible. Run several measurements if time permits and record the variation rather than selecting only the best score.

Also verify:

- The LCP element is correctly identified.
- The deployed menu's initial content is visible without waiting for a client-side fetch.
- The first menu image uses the intended loading priority.
- Delivered image sizes are checked in the Network panel.
- `/menu` First Load JS is checked using the production build output.
- The deployed site's actual performance results are recorded separately from local measurements.

Do not fill in pending values until the deployed tests have been run.

## Next Optimization Priorities

1. Inspect the LCP element and its render delay in Lighthouse.
2. Review the exact image-delivery findings and delivered image sizes.
3. Profile long main-thread tasks before removing client functionality or dependencies.
4. Repeat Lighthouse runs under consistent production-build conditions.
5. Measure interaction responsiveness separately if reporting INP.
6. Verify the JavaScript bundle size and largest delivered image against the Day 45 targets.
7. Compare deployed results with the local baseline after deployment.

## Environment and Rendering Notes

- `.env.example` documents expected environment variable names.
- `.env.local` is intended for local values and must not be committed.
- `.env*.local` is ignored by Git.
- `NEXT_PUBLIC_SITE_URL` supplies the public site URL used by `metadataBase`.
- `next/font` is used for font optimization.
- No third-party script was added without a genuine application requirement.

## SEO and Performance Scope

Day 44 adds metadata generation, Open Graph previews, `MenuItem` JSON-LD, a generated sitemap, and crawler directives.

These features primarily improve metadata, sharing previews, structured information, and search discovery. Their implementation does not establish that page performance improved.

The sitemap and metadata were checked locally, and sampled dish social-preview routes opened successfully. The existing Lighthouse results remain the recorded local Day 43 measurements; they should not be interpreted as a Day 44 or deployed performance benchmark.

Production-domain metadata and deployed social previews require separate verification.

## Conclusion

The project includes local WebP images, Next.js image optimization, responsive image sizing, explicit priority for the first menu image, server-rendered initial menu data, environment-variable documentation, and repeated production Lighthouse measurements.

The latest recorded local `/menu` run scored 73, with FCP 0.9 s, LCP 3.4 s, TBT 800 ms, CLS 0, and Speed Index 1.8 s.

The image-loading changes reduced the observed resource-load delay in the latest breakdown, but overall performance improvement is not conclusive. The LCP and Lighthouse targets remain unmet in the latest local run. Deployed measurements, JavaScript bundle size, and image-size verification remain outstanding Day 45 tasks.