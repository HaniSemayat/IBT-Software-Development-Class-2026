# Day 43 — Performance Report

## Goal

Measure the production application, document optimization experiments, and use Lighthouse evidence to identify further improvements.

## Test Setup

- Lighthouse 13.4.1
- Chromium 154
- Mobile emulation: Moto G Power
- Network throttling: Slow 4G
- Incognito/InPrivate session
- Initial page load
- URL: `http://localhost:3000/menu`
- Production build: `npm run build`, followed by `npm run start`

These measurements are individual runs, not a controlled benchmark. Simulated network conditions and main-thread activity can cause results to vary.

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
- 7 long main-thread tasks

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
- 10 long main-thread tasks
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
- 11 long main-thread tasks
- Back/forward cache restoration was prevented for two reported reasons

## Image Optimization

The menu uses local WebP food images and Next.js `Image`.

The implementation includes:

- Explicit image dimensions
- Responsive `sizes`
- Meaningful alternative text
- A priority image for the first menu result
- Next.js image optimization through `/_next/image`

The browser Network panel confirmed requests such as:

`/_next/image?url=%2Fdishes%2Ftibs.webp&w=640&q=75`

This confirms that the Next.js image optimization endpoint is being used. It does not, by itself, prove an improvement in overall page performance.

Lighthouse previously estimated 80 KiB in potential image-delivery savings. The exact resources identified by the audit should be reviewed before making further image changes.

## October 10 Experiments — Server Rendering and Image Priority

### Run 4 — Server-rendered initial menu

The menu page now fetches its initial dishes in the Server Component and passes the first page to the client search component as `initialData`. SWR uses this data for the initial unfiltered page, while subsequent searches and pagination still use the API.

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
- 13 long main-thread tasks
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

- Time to First Byte: 70 ms
- Resource load delay: 170 ms
- Resource load duration: 130 ms
- Element render delay: 440 ms

Other findings:

- Legacy JavaScript: estimated 13 KiB savings
- Main-thread work: 3.9 s
- JavaScript execution: 1.7 s
- Unused JavaScript: estimated 26 KiB savings
- 19 long main-thread tasks
- Render-blocking requests remained an audit finding

The resource-load delay was approximately 170 ms in this run, compared with approximately 990 ms in an earlier breakdown. However, LCP increased from 3.1 s to 3.4 s between Runs 4 and 5. The performance score increased by only one point. These results do not establish a consistent overall performance improvement.

## Interpretation

The results are mixed.

Compared with the original baseline, the latest run has:

- Performance score: 15 points lower
- FCP: 0.1 s slower
- LCP: 0.8 s slower
- TBT: 450 ms higher
- CLS: unchanged at 0
- Speed Index: 0.5 s slower

The October 8 run had a lower LCP than the baseline but substantially higher TBT. Later runs varied in both LCP and TBT.

The reduced resource-load delay is promising, but LCP remains above the commonly recommended 2.5-second threshold for a good user experience. Main-thread work and the 440 ms element render delay are also worth investigating.

These runs are not a perfectly controlled experiment. Application content changed as real food images and new rendering behavior were introduced, and Lighthouse results vary under simulated conditions. The measurements do not prove that one specific code change caused the differences.

INP was not directly measured in these initial-load reports. TBT is a diagnostic metric and should not be presented as an INP measurement.

## Next Optimization Priorities

1. Inspect the LCP element and its render delay in Lighthouse.
2. Review the exact image-delivery findings and delivered image sizes.
3. Profile long main-thread tasks before removing client functionality or dependencies.
4. Repeat Lighthouse runs under consistent conditions and compare multiple runs.
5. Measure interaction responsiveness separately if reporting INP.

## Environment and Rendering Notes

- `.env.example` documents expected environment variable names.
- `.env.local` is intended for local values and must not be committed.
- `.env*.local` is ignored by Git.
- `NEXT_PUBLIC_SITE_URL` supplies the public site URL used by `metadataBase`.
- `next/font` is used for font optimization.
- No third-party script was added without a genuine application requirement.

## Conclusion

Day 43 includes local WebP images, Next.js image optimization, responsive image sizing, explicit priority for the first menu image, server-rendered initial menu data, environment-variable documentation, and repeated production Lighthouse measurements.

The latest recorded `/menu` run scored 73, with FCP 0.9 s, LCP 3.4 s, TBT 800 ms, CLS 0, and Speed Index 1.8 s.

The image-loading changes reduced the observed resource-load delay in the latest breakdown, but overall performance improvement is not conclusive. LCP and main-thread work remain areas for further investigation. The report records these limitations rather than claiming that the optimization work has definitively improved all metrics.
