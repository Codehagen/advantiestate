# EMIL RUBRIC

The single source of truth for the Advanti motion & design-engineering audit. Each line is one checkable rule with the detectable signal in backticks. Baseline-confirmed infrastructure (CSS reduced-motion, `MotionConfig`, `tabular-nums`, `text-balance`, antialiasing, light-only) is noted as **[already handled — do not flag unless newly broken]**.

> Distilled from Emil Kowalski's animations.dev course (45 lessons + 4 interviews, read via the user's auth cookies) and the `/emil-design-engineering` skill. Full provenance in [`EMIL_DESIGN_AUDIT.md`](./EMIL_DESIGN_AUDIT.md) §7.

## Easing

1. Enter/exit elements (dropdowns, modals, toasts, drawers, popovers) use ease-out or a steep-start `cubic-bezier`; flag `ease-in`/`easeIn`/`linear` on these.
2. On-screen elements that move/morph to a new position (tab indicators, layout shifts, accordions, timeline scrubbers) use `ease-in-out` (or symmetric `cubic-bezier`); flag `ease-out` here.
3. Hover transitions on `color`/`background-color`/`border-color`/`opacity` use `ease` (or omitted default); flag `linear` and bare `ease-out` on non-spatial hover.
4. Never use `ease-in` (not `ease-in-out`) on any interactive/enter/exit animation; any match is a violation.
5. `linear` is allowed only for marquees, infinite loops, progress/`hold-to-delete` time indicators; flag elsewhere.
6. Prefer custom `cubic-bezier()` over bare keyword easings on transform/scale motion; the two house curves are `cubic-bezier(0.22,1,0.36,1)` and `cubic-bezier(0.16,1,0.3,1)` — flag bare `ease-out`/`ease-in-out` on substantial motion.
7. Choose easing first, then duration; flag `transition={{ duration: X }}` with no `ease`/`cubic-bezier`/`type:'spring'` specified.
8. Exit animations are shorter/simpler than their entrance (often opacity-only); flag `exit` duration ≥ enter duration.

## Timing & Frequency

9. All product-UI animations complete in `≤300ms`; flag `duration: >0.3`, `duration-[>300ms]`, `400ms`/`500ms`/`1s` outside marketing routes.
10. Hover transitions are `100–150ms`; flag `duration-300`+ combined with `hover:`.
11. Click/state transitions are `150–200ms`; flag slower on product UI.
12. Never animate keyboard-driven interactions (arrow-key nav, command-palette select, Tab focus, `data-highlighted`/`aria-selected` changes); flag any non-zero `transition`/`animate` on `onKeyDown`/`onKeyUp`-driven state.
13. No animation (or drastically reduced) on elements used 100+×/day — primary nav links, frequent list rows; flag non-zero hover/transition there.
14. After the first tooltip in a group, subsequent ones open instant; flag missing `[data-instant] { transition-duration: 0ms }`.
15. Icon-swap toggles (play/pause, copy/check) use `~0.1s` with `mode="wait"`; flag `>0.15s`.
16. Stagger grouped list/nav children at a consistent `~40–80ms` increment; flag grouped children all on `delay: 0` (simultaneous flash) — but do not stagger AND animate the parent simultaneously.

## Springs

17. Use `type: 'spring'` for drag, layout/`layoutId`, morph, and interruptible motion; flag CSS `@keyframes`/tween on re-triggerable position changes (toast stacks, accordions, wizards).
18. Configure springs with `duration` + `bounce` (Apple model), not raw `stiffness`/`mass`/`damping`; flag the raw-physics form unless intentional.
19. Default `bounce: 0`; flag `bounce > 0.15` outside a drag/throw-dismiss gesture; `bounce > 0.3` is always a violation.
20. Use tween (not spring) for pure opacity/color fades; flag spring on non-spatial fades as needless overhead.
21. Size-tuned bounce is acceptable in morph/island components (small view higher, large view lower); flag a single shared bounce only if it produces wrong feel.

## Performance

22. Animate only `transform`/`opacity` (+ capped `filter: blur`); never `height`/`width`/`padding`/`margin`/`top`/`left`/`right`/`bottom`; flag `transition:`/`animate={{` on these. For dynamic height use `useMeasure` + `animate={{ height: bounds.height }}`.
23. Never `transition: all` / `transition-property: all`; name properties explicitly — flag all 6 known offenders (`Input.tsx`, `blog/integrations.tsx` ×2, `blog/icons/expanding-arrow.tsx` ×2, `blog/scroll-progress.tsx`) and any new ones.
24. Add `will-change: transform` to CSS transform/`layout`-animated elements that show start/end jitter; flag absence only where jank is plausible (current usage in `Select.tsx` is fine).
25. Cap `filter: blur()` at `≤20px` (prefer `≤5px` for animated blur); flag `blur-xl`+ / `blur(>20px)` animated, especially Safari paths.
26. Never animate an inherited CSS custom property (`var(--*)`) on a parent with many descendants; set `style.transform` directly — flag `style={{ '--x': ... }}` driven by drag/`onPointerMove`/rAF.
27. Drive pointer/drag/per-frame values with `useMotionValue`/`useSpring` + `.set()`, never `useState`; flag `useState` setters inside `onPointerMove`/`onMouseMove`/rAF.
28. Pause infinite CSS loops off-screen via `IntersectionObserver` + `animation-play-state: paused`; flag `animation: … infinite` without a pause path.
29. Prefer CSS transitions / Radix `data-state` keyframes over importing `motion` for simple single-property fades; flag `motion.*` whose only animation is `whileHover` opacity/background.

## Typography

30. **[already handled]** `tabular-nums` on changing numerics — global in design CSS; flag only NEW numeric components outside the system lacking `tabular-nums`.
31. **[already handled]** `text-wrap: balance` on `h1/h2/h3` — global; flag only new headings outside the system.
32. **[already handled]** `-webkit-font-smoothing: antialiased` — global on body + layout; do not flag.
33. Never change `font-weight` on `:hover`/`[aria-selected]`/active; use `color`/`opacity` — flag `hover:font-*` / `font-weight` in those selectors. **[currently absent — keep it so]**
34. Cap long-form body width at `~65ch`/`max-w-prose`; flag prose containers `>70ch`.

## Visual Polish (borders / shadows / gradients / z-index)

35. Never animate from `scale(0)`; start `≥0.85` (paired with opacity); flag `initial={{ scale: 0 }}` / `scale(0)` keyframe / values `<0.85`.
36. Icon-swap scale goes to/from `0.5`, not `0`; flag `exit={{ scale: 0 }}`/`initial={{ scale: 0 }}` in icon swaps.
37. Button press feedback is `active:scale-[0.97]` (range `0.95–0.97`) with `~150ms ease`; flag interactive buttons missing it, and flag `active:scale-90`/below `0.95` as cartoonish.
38. Hover scale is `≤1.02` (`hover:scale-[1.01]`/`[1.02]`); flag `hover:scale-105`+.
39. Popovers/dropdowns/tooltips/context menus set `transform-origin` to the trigger via `var(--radix-*-transform-origin)` / `var(--transform-origin)`; flag `transform-origin: center` or absence on floating content.
40. Add `filter: blur(2–4px)` at the midpoint of crossfades/state-swaps (`AnimatePresence mode="wait"`, idle→loading→success); flag pure opacity swaps with no blur bridge.
41. Combine scale + blur + opacity for morph/enter/exit; flag opacity-only UI element transitions as flat.
42. When crossfading two views, delay the entering element `~0.05s` so the exiter clears first; flag simultaneous full-opacity overlap.
43. Prefer `box-shadow: 0 0 0 1px rgba(0,0,0,0.08)` or `rgba()` borders over solid-hex borders on cards/inputs over variable backgrounds; flag solid `border-[#…]`/`border-gray-*` on tinted/gradient surfaces.
44. Use `clip-path: inset(...)` for image reveals / tab highlights instead of animating `width`/`height`; flag width/height-animated highlights.
45. z-index: **[baseline — hardcoded scale is intentional]**; flag only arbitrary `z-[9999]`/`z-index: ≥999` newly added outside the established layers (Leaflet 1000/800 are required). Suggest `isolation: isolate` instead of escalating z-index.

## Color

46. Light-only site: any `dark:` Tailwind variant is dead code — flag every `dark:bg-*`/`dark:text-*`/`dark:border-*`. (`--*-dark` tokens and `.btn-dark`/`.is-dark` classes are NOT dark mode — do not flag.)
47. Disable transitions during any theme/section class swap to avoid color-slide; flag a theme toggle without a `transition-none` guard. (No `next-themes` present — applies only if introduced.)

## Layout & Layout-Shift

48. Use container `gap` instead of `margin-bottom` on flex/grid children; flag repeated `mb-*` on direct children of flex/grid containers.
49. Animate `translateY(100%)` (percentage) not pixel values for variable-height enter/exit (toasts/drawers/sheets); flag `translateY(NNpx)` on dynamic-height elements.
50. Set `borderRadius` via inline `style={{ borderRadius: <px> }}` (not `rounded-*` rem) on `motion.div` with `layout`; flag `rounded-*` on layout-animated elements.
51. Use fine dividers at retina-aware `0.5px` hairline where intended; informational — flag only if a heavy `1px` divider is called out.

## Forms & Controls

52. Inputs/controls avoid `transition: all` — `Input.tsx` is a known offender (rule 23).
53. Buttons have `:active`/`whileTap` scale feedback (rule 37) and live within a `≥44×44px` target (rule 60).
54. Never remove focus visibility: `outline: none`/`outline-none`/`focus:outline-none` must pair with a visible `focus:ring`/custom outline (+`outline-offset: 2px`); flag unpaired removal (WCAG 2.4.7).
55. Numeric/price/stat inputs and readouts use `tabular-nums` (rule 30).

## Accessibility & Reduced Motion

56. **[already handled]** `MotionConfig reducedMotion="user"` wraps `<main>`; CSS reduced-motion is comprehensive. Do NOT flag `motion/*` components inside `<main>`, nor existing CSS animations, for missing reduced-motion.
57. Flag missing reduced-motion ONLY for: a NEW CSS animation added outside `advanti-design.css`/`globals.css`, a `motion/*` element rendered OUTSIDE `<main>` (e.g. in Nav/Footer), or a Recharts/imperative-JS animation not calling `useReducedMotion()`.
58. Under reduced motion keep opacity/color, drop transform/scale/translate — flag reduced branches that kill all feedback or that still translate.
59. Gate `scroll-behavior: smooth`/`scroll-smooth` and `scrollIntoView({behavior:'smooth'})` behind `prefers-reduced-motion: no-preference`; flag unconditional smooth scroll. **[baseline: html scroll-behavior already gated]**
60. Autoplay `<video>`/animated GIF only under `no-preference`, with a static fallback/paused frame; flag unconditional `autoPlay`.
61. Icon-only buttons and meaning-bearing illustrations have `aria-label` (illustrations also `role="img"`); flag icon-only `<button>` (svg-only child) without `aria-label`.
62. Drawers/modals/dialogs use a tested library (Vaul/Radix/Headless UI) for focus-trap, focus-restore, Escape; flag custom `div`+`onClick` overlays managing focus manually.
63. `aria-hidden`/`tabIndex={-1}` `layoutId` clones must not be focusable; the visible instance must be labeled — flag a focusable hidden clone.

## Touch

64. Gate hover effects behind `@media (hover: hover) and (pointer: fine)` / Tailwind `hoverOnlyWhenSupported`; **[baseline: Tailwind v4 auto-gates]** — flag only raw CSS `:hover` added outside Tailwind without the guard.
65. Every icon-only/small interactive control has a `≥44×44px` target via `min-w-[44px] min-h-[44px]` or a `::before` hitbox; flag icon buttons sized `w-4/5/6`/`h-4/5/6` with no hit-area expansion.
66. Set `touch-action: manipulation` on `<button>`/`<a>` to kill the 300ms tap delay; flag its absence in base styles.
67. Autoplay videos include `muted` and `playsInline`; flag `autoPlay` without both.

## Component Design

68. Hover-translate/lift applies `transform` to a CHILD wrapper, not the hover-target parent (prevents flicker loop); flag `:hover{transform:translateY}` / `hover:translate-y` on the same element receiving `:hover`/`group` root.
69. Use `AnimatePresence mode="popLayout"` when an exiting item reflows siblings (lists, steps, tab panels, cards); flag list `AnimatePresence` with `exit` lacking `mode`.
70. Modal entrance starts `scale 0.90–0.95` and exits on the same axis it entered; flag `scale<0.85` or reversed exit axis.
71. Radix `NavigationMenu` dropdowns animate direction-aware via `[data-motion="from-start"/"from-end"]`; flag their absence.
72. Use `useMemo` + `switch` for 3+ conditional views; ternary only for binary; flag nested ternaries handling 3+ states under `AnimatePresence`.
73. Use a headless library for nav menus/drawers/dialogs/selects/comboboxes; flag hand-rolled `aria-expanded`/`onClick` reimplementations.

## Motion / React Patterns

74. Import from `motion/react`, never `framer-motion`; flag `from 'framer-motion'`. **[baseline: package is `motion` — keep it]**
75. Every direct `AnimatePresence` child has a unique `key`; flag missing/`key={0}` non-unique keys (exit silently skipped).
76. Add `initial={false}` to `AnimatePresence` wrapping already-visible/mount content and to icon/label swaps; flag its absence where enter would flash on load.
77. Pass `custom` to BOTH `AnimatePresence` and the `motion.*` child for direction-aware exits; flag direction captured only via closure.
78. For dual-axis morph containers, render the active view for enter + an absolutely-positioned `opacity:0` duplicate revealed via exit keyframes `[1,0]`; flag a single element fighting `popLayout`.
79. Lift shared identical `transition` props to `<MotionConfig transition={…}>`; flag 2+ adjacent siblings repeating the same spring config.
80. Prefer declarative `motion.div` (initial/animate/exit) over imperative `useAnimate`/`useAnimation` unless orchestrating unrelated DOM; flag avoidable imperative usage.
81. Override Vaul drawer defaults (500ms) to `~200ms` `cubic-bezier(0.165,0.84,0.44,1)` via `[vaul-drawer]`/`[vaul-overlay]`; flag missing override or `>300ms`.
82. Drawer content crossfade is `~0.27s`; opacity crossfade duration is dynamic (clamp `0.15–0.27s` by height delta), not a fixed constant; flag hardcoded `.25`/`.3` or a constant where a delta computation is expected.

## Taste (when NOT to animate)

83. Every animation must answer "why does this exist?" (spatial continuity, state confirmation, entry cue, or rare-moment delight); flag purposeless `motion`/`transition`/`@keyframes` on high-frequency UI (>3 animated elements without rationale).
84. If everything animates, nothing stands out — remove decorative motion on daily-driver paths (nav, command palette, list rows).
85. Match pace to brand: product dashboards instant (hover `≤150ms`, transitions `≤200ms`); only marketing may be expressive (rule 9 / 88).
86. Paired elements (modal+backdrop, tooltip+arrow, drawer+overlay) share identical easing+duration; flag mismatch `>20ms` or differing easing type.

## Marketing (exceptions)

87. Marketing hero/intro animations may exceed 300ms (up to ~1s) but still use ease-out/ease-in-out, never `ease-in`/`linear`.
88. Intro/hero animations play once per session via `sessionStorage` (not `localStorage`) or `useInView({ once: true })`/`initial={false}`; flag replay-on-return.
89. No scroll-hijack: avoid `whileInView` translate-Y / IntersectionObserver fade-ups / non-1:1 parallax on marketing; flag scroll animations not mapped to scroll position. (Existing `.reveal` is double-gated CSS — acceptable.)
90. Marketing submenu content rendered in DOM always (CSS-hidden), not conditionally mounted on hover (SEO/a11y); flag `{isOpen && <Submenu/>}`.
91. Auth-aware primary CTAs branch label/destination on session (e.g. logged-in → dashboard); flag hardcoded CTA where a session branch is expected.