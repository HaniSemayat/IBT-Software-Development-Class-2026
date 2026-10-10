# Day 43 — Performance Report

## Goal

Measure the production application, document optimization experiments, and use Lighthouse evidence to identify future improvements.

## Test Setup

- Lighthouse 13.4.1
- Chromium 154
- Mobile emulation: Moto G Power
- Network throttling: Slow 4G
- Incognito/InPrivate session
- Initial page load
- URL: `http://localhost:3000/menu`
- Production build: `npm run build`, followed by `npm run start`

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

The menu now uses local WebP food images and Next.js `Image`.

The implementation includes:

- Explicit image dimensions
- Responsive `sizes`
- Meaningful alternative text
- A priority image for the first menu result
- Next.js image optimization through `/_next/image`

The browser Network panel confirmed requests such as:

`/_next/image?url=%2Fdishes%2Ftibs.webp&w=640&q=75`

This confirms the image optimization endpoint is being used. It does not, by itself, prove an improvement in overall page performance.

Lighthouse's estimated 80 KiB image-delivery savings indicate that image delivery still deserves investigation. Review the specific images identified by the audit before making further changes.

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

The first image on the default first page now receives `priority`, `fetchPriority="high"`, and `loading="eager"`. Other images use automatic fetch priority and lazy loading.

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
- Render-blocking requests remain an audit finding

The resource-load delay was substantially lower in this run than the approximately 990 ms observed in an earlier breakdown. However, LCP increased from 3.1 s to 3.4 s, and the performance score increased by only one point. These measurements do not establish a consistent overall improvement.


The measurements are mixed rather than evidence of a consistent performance improvement.

Compared with the original baseline, the latest run has:

- Performance score lower by 18 points
- FCP unchanged at 0.8 s
- LCP slower by 1.6 s
- TBT higher by 310 ms
- CLS unchanged at 0
- Speed Index slower by 0.6 s

The October 8 run had a lower LCP but substantially higher TBT than the baseline. The October 9 run reduced TBT compared with October 8, while LCP increased to 4.2 s.

These runs are not a perfectly controlled experiment: the application content changed when real food images were introduced, and Lighthouse measurements vary under simulated network and device conditions. The results do not establish that one specific code change caused the differences.

INP was not measured in these initial-load reports. It requires interaction-based measurement and should not be inferred from TBT.

## Next Optimization Priorities

1. Open Lighthouse's image-delivery and LCP audits to identify the exact resources involved.
2. Verify which element is the LCP element and whether its image request is discovered promptly.
3. Review image dimensions, responsive sizes, and delivered file sizes.
4. Profile long main-thread tasks before removing client-side functionality or dependencies.
5. Repeat Lighthouse runs under consistent conditions and compare more than one run before claiming an improvement.

## Environment and Rendering Notes

- `.env.example` documents the expected environment variable names.
- `.env.local` is intended for local values and must not be committed.
- `NEXT_PUBLIC_SITE_URL` supplies the public site URL used by `metadataBase`.
- `next/font` is already used for font optimization.
- No third-party script was added without a genuine application requirement.

## Conclusion

Day 43 includes local WebP images, Next.js Image optimization, responsive image sizing, an explicitly prioritized first menu image, server-rendered initial menu data, and repeated production Lighthouse measurements.

The latest recorded `/menu` run scored 73, with FCP 0.9 s, LCP 3.4 s, TBT 800 ms, CLS 0, and Speed Index 1.8 s. Results varied across runs. The reduced LCP resource-load delay is promising, but LCP remains above the commonly recommended 2.5-second good threshold, and main-thread work remains an area for investigation.

The next step is to profile the LCP element's render delay and the long main-thread tasks, then repeat measurements under consistent conditions. Do not claim that overall performance has been conclusively improved based on these runs alone.
