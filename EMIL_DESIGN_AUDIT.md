# Emil Design-Engineering Audit

Scope: 94 components scored across `src/`, audited against the Emil motion and design-engineering rubric (91 rules) with our confirmed infrastructure baseline as the floor. 64 confirmed findings: 5 high, 17 medium, 42 low. Every finding below was adversarially verified against the source; the fix shown is the adjusted fix where one exists. The blog group (14 files) was audited in a follow-up pass after an API error dropped it from the main run, and is folded in below.

Grade distribution (94 files): A 41, A- 8, B+ 5, B 18, B- 5, C 13, C+ 3, D 1, F 0.

## 1. What Emil wants (the philosophy)

The rubric is one belief stated 91 ways: motion is a tool for spatial continuity and state confirmation, not decoration. Slow, decorative, or mistimed motion is worse than none.

**Easing is a language, picked before duration (rules 1-8).** Enter and exit use ease-out or a steep-start cubic-bezier; things already on screen that move to a new position use ease-in-out; hover color/opacity changes use plain `ease`. `ease-in` is never correct on interactive motion, and `linear` is only for marquees and progress indicators. Our two house curves are `cubic-bezier(0.22,1,0.36,1)` and `cubic-bezier(0.16,1,0.3,1)`. Exits are shorter and simpler than entrances.

**Timing matches frequency (rules 9-16).** Product UI completes in 300ms or less, hover in 100-150ms, click/state in 150-200ms. The sharpest idea: do not animate the things people touch 100 times a day (nav links, list rows), and never animate keyboard-driven selection (arrow keys, command palette, focus moves). The highlight should snap.

**Springs for organic and interruptible motion (rules 17-21).** Drag, `layoutId`, morph, and anything re-triggerable wants a spring, configured with duration plus bounce (Apple model), not raw stiffness/mass/damping. Default bounce is 0. Pure opacity/color fades stay on tweens.

**Performance is non-negotiable (rules 22-29).** Animate only `transform` and `opacity` (plus capped blur). Never `height`, `width`, `padding`, `margin`, `top`, or `left`. Never `transition: all`. Pause infinite loops off-screen. Drive per-frame values with motion values, not `useState`.

**Typography and polish remove jank (rules 30-45).** Tabular-nums on changing numbers, `text-wrap: balance` on headings, antialiasing, no font-weight changes on hover/selected (they shift layout). Never scale from 0 (start at 0.85+); button press is `active:scale-[0.97]`; hover scale tops out at 1.02; popovers anchor `transform-origin` to their trigger; crossfades get a blur bridge; cards on tinted surfaces use shadow-borders over solid hex.

**Accessibility is the baseline, not a layer (rules 52-67).** `MotionConfig reducedMotion="user"`, reduced motion keeps opacity and drops transform, smooth scroll gated behind `no-preference`, 44px touch targets, `touch-action: manipulation`, icon-only buttons get `aria-label`, dialogs use tested libraries, and focus visibility is never removed without a replacement ring.

**Component and motion patterns (rules 68-82).** Hover-lift on a child wrapper, `popLayout` when exits reflow siblings, modal entrance at 0.9-0.95, headless libraries for menus/dialogs/selects, unique `AnimatePresence` keys, `initial={false}` for mounted content, declarative over imperative.

**Taste is knowing when not to animate (rules 83-91).** Every animation answers "why does this exist?". If everything animates, nothing stands out. Product is instant; only marketing may be expressive, and even then it plays once per session and never hijacks scroll.

## 2. Our baseline: what we already do right vs what's missing

**Already handled (do not re-flag):**
- CSS `prefers-reduced-motion`: 35 rules in `advanti-design.css` + a block in `globals.css`; `.reveal` is double-gated (no-preference + `@supports`), print/PDF reveal fix in place.
- JS reduced-motion: SSR-safe `useReducedMotion()` hook (7 call sites) + `MotionConfig reducedMotion="user"` wrapping `<main>`.
- `tabular-nums` (19+ rules), `text-wrap: balance` on h1-h3, `-webkit-font-smoothing: antialiased` (CSS + Tailwind), all global.
- Light-only confirmed: zero `dark:` variants, no `next-themes`. Any `dark:` added would be dead code.
- Consistent inline easing (the two house curves). No arbitrary `z-[9999]`; hardcoded z-scale is intentional, Leaflet 1000/800 required.
- `font-weight` on hover/active: absent (good), with one Radix `data-[state=checked]` exception noted below.

**Missing or inconsistent:**
- No `--ease-*` or `--z-*` tokens (consistent values, just not tokenized; enhancement, not a bug).
- `transition: all` in 6 peripheral spots, plus 2 bare `transition: 0.2s` shorthands the original grep missed (`.switch`).
- No site-wide button press feedback: neither `Button.tsx`, `.btn`, nor `.fbtn` has an `:active` transform.
- 500ms entrance durations on charts (over the 300ms product budget; fine as mount-only entrances, a problem when they replay on interaction).
- Several sub-44px touch targets and a handful of hover-only patterns that strand keyboard/touch users.

## 3. Prioritized findings

### Easing / Timing

- `src/components/markedsinnsikt/charts/MarketLineChart.tsx:141-143,162-164` (medium) -- `animate` is a constant (`!useReducedMotion()`), not mount-gated, so the 500ms area/line draw replays on every range switch and legend toggle -> Gate animation to first mount/reveal via a parent-controlled `animate` prop (as `PortalCharts` does); optionally drop to ~300ms. `ease-out` is correct.
- `src/components/markedsinnsikt/charts/MarketBarChart.tsx:129-131` (medium) -- same pattern: 500ms bar-grow replays on data change rather than mount-only -> Mount-gate the `animate` prop mirroring `PortalCharts`; optionally lower to ~300ms.
- `src/components/ui/Fade.tsx:28-33` (low) -- entrance spring `{stiffness:150, damping:19, mass:1.2}` is underdamped (bounce ~0.29), overshooting on a plain text/content fade -> Use the duration+bounce model: `{type:"spring", duration:0.5, bounce:0}`.
- `src/components/analyseportal/charts/PortalCharts.tsx:175-177,190-192,246-248,320-322` (low) -- all animated frames use `animationDuration={500}`, over the 300ms budget -> Optionally reduce to ~300ms for consistency; gating and `ease-out` are already correct.
- `src/components/markedsinnsikt/maps/MarkedsKartHoved.tsx:499-504` (low) -- ranked bar fill uses bare `ease` (css:4002) while sibling bars use the house curve -> Align to siblings: `transition: transform 450ms cubic-bezier(0.22,1,0.36,1)` (siblings run 450ms, not 300ms).
- `src/components/analyseportal/AnalyseportalShell.tsx:219-230` (low) -- arrow-key/Home/End tab nav calls `setSector`, which sets `animateRef.current=true`, so each keypress fires a full chart morph (rule 12) -> Give `setSector` an `animate=true` default and call `setSector(key, false)` inside `onTabKeyDown`; click activation keeps the animation.
- `src/styles/advanti-design.css:10614,10617` (low) -- `.hs-res` rows fade background over 120ms, and `.active` is toggled by ArrowUp/Down, so keyboard highlight fades instead of snapping (rule 12) -> Scope the fade to pointer hover: `.hs-res { transition: none }` + `@media (hover:hover){ .hs-res:hover { transition: background 0.12s } }`.

### Performance

- `src/components/markedsinnsikt/maps/MarkedsKartHoved.tsx:355` (low) -- `.hot` metric row animates `padding` (css:3537) and changes both margin (untransitioned) and padding, producing a horizontal wobble on every metric-pill click -> Change css:3537 to `transition: background-color 0.2s ease` and let the padding/margin offset apply instantly.
- `src/styles/advanti-design.css:10770,10783` (low) -- `.hs-row` includes `padding 0.15s` and hover shifts padding-left/right, animating a layout property (rule 22); same pattern at `.hs-mr` (10692/10696) -> Drop `padding` from the transition and replace the hover shift with a transform nudge on `.rmain`.
- `src/styles/advanti-design.css:10327-10342` (low) -- `.bench-mark`/`.bench-dot` animate `left` at 500ms; `YieldCalculatorV2` drives `left` inline on every keystroke, so the dot lags behind typing -> Animate `transform: translateX` via a CSS var at ~0.22s instead of `left`; `.bench-dot` already has a translate base to compose onto.
- `src/components/Input.tsx:112` (low) -- password-toggle button uses `transition-all` (rule 23); only the text color changes on hover -> Replace with `transition-colors duration-150`.
- `src/styles/advanti-design.css:10283-10293` (low) -- `.switch` and `.switch::after` use bare `transition: 0.2s`, which resolves to `transition-property: all` -> Name them: `.switch { transition: border-color 0.2s }`, `.switch::after { transition: transform 0.2s }`.
- `src/components/ui/FeatureDivider.tsx:14-52` (low) -- six dots run an infinite `wave` loop with delays written as dead arithmetic (`${0*0.2}s`, etc.) -> Replace the dead arithmetic with literals (0s, 0s, 0.4s, 0.6s, 0.6s, 1s). No IntersectionObserver needed; the keyframe is transform/opacity only and browsers throttle it off-screen.
- `src/components/ui/Animated-Grid-Background.tsx:51-78` (low) -- a `setInterval` re-keys up to 50 `motion.rect` animations every ~14s with no off-screen pause -> Optionally gate the interval behind an IntersectionObserver. Reduced-motion is already handled; the "missing easing" sub-claim is false (Framer defaults to easeInOut).

### Layout-shift / Typography

- `src/components/Select.tsx:203` (low) -- `data-[state=checked]:font-semibold` bolds the selected item even though an `ItemIndicator` checkmark already marks it (rule 33) -> Drop the font-weight change and rely on the checkmark; use color/opacity if extra emphasis is wanted. (The grid + `truncate` layout means it does not reflow siblings, so this is convention, not shift.)
- `src/styles/advanti-design.css:8010-8015` (low) -- `.ed-lb-counter` renders live `{index+1} / {count}` with no `tabular-nums`, so width shifts crossing 9->10 on listings with 10+ photos -> Add `font-variant-numeric: tabular-nums`.

### Accessibility

- `src/components/modals/` (high) -- all six modal close buttons are icon-only with no accessible name (`LeaseRequestModal` 64-69, `ValuationRequestModal` 67-72, `TransactionRequestModal` 63-68, `ConsultationModal` 61-66, `StrategicAdvisoryModal` 60-65, `AdvisoryRequestModal` 60-65); SR announces only "button" (WCAG 4.1.2, Level A) -> `<button aria-label="Lukk"><RiCloseLine aria-hidden="true" .../></button>` across all six.
- `src/components/advanti/DcfChart.tsx:33,63` (high) -- custom tooltip is `bg-gray-900` but the heading and numeric `kr` values are `text-warm-grey` (#2c2825), ~1.1:1, effectively invisible -> Change `text-warm-grey` to `text-warm-white` on lines 33 and 63.
- `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx:1216` (medium) -- the tab-content region is a second `<main>` nested inside the layout's `<main id="hovedinnhold">`, a duplicate landmark (axe `landmark-no-duplicate-main`) -> Replace with `<div className="mi-content">` or `<section aria-label="Markedsdata">`.
- `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx:148-160,291-303,498-510,1195-1214` (medium) -- sector nav, sub-tabs, and RangeSelector declare `role="tab"`/`tablist`/`aria-selected` but ship none of the keyboard contract (no roving tabindex, no arrow keys, no `aria-controls`, content not `role="tabpanel"`); RangeSelector is a segmented filter, not a tabset -> Add roving focus + arrow-key handling, `id`+`aria-controls`, and `role="tabpanel"` (or adopt Radix Tabs); switch RangeSelector to `role="radiogroup"`/`role="radio" aria-checked`. Native buttons keep them Tab-operable today, so this is a contract gap, not a trap.
- `src/components/eiendommer/PropertyMapLeaflet.tsx:39-47` (medium) -- JSDoc claims drag is disabled for touch-scroll, but only `scrollWheelZoom={false}` is set; Leaflet's default `dragging:true` stands, so one-finger drag traps page scroll on property pages, `CityLocationMapClient`, and `OfficeMap` -> Gate by coarse pointer: `dragging={!isCoarse} touchZoom={isCoarse}`, or `dragging={false}` for these fixed embeds (matches `MarkedsKartLeafletCelle`/`NordNorgeLeafletMap`).
- `src/components/verktoy/ROICalculator.tsx:108-113,141-146,174-179,207-212,239-244` (medium) -- all 5 info tooltips reveal only on hover via a non-focusable `div` with `display:none`; no `role`, `aria`, or focus variant, so keyboard and SR users get nothing -> Make the trigger a `<button aria-label="Mer info">` with a `role="tooltip"` child toggled on `group-hover`/`group-focus-visible`, or link via `aria-describedby` (Radix tooltip also works). (Note: Tailwind is v3.4, so hover is not auto-gated; the real defect is the missing keyboard/SR path.)
- `src/components/verktoy/MortgageCalculator.tsx:106-111,139-144,172-177,204-209` (medium) -- same inaccessible hover-tooltip pattern, 4 times -> Identical fix.
- `src/components/eiendommer/ListingsBrowser.tsx:184,209,229` (medium) -- three filter groups use `role="radiogroup"` but their children are `<button aria-pressed>` toggle chips, not `role="radio"`/`aria-checked` with roving tabindex; a contradictory pattern -> Change the three to `role="group"` (keep the `aria-label` and `aria-pressed` toggles).
- `src/components/site/PhotoBand.tsx:13-23` (low) -- `aria-hidden={caption ? undefined : true}` would hide the whole band including an `<Image>` whose `alt` is a required prop; an API contract inconsistency (never triggered today since all 8 callers pass a caption) -> Decide the contract: if always decorative, relax the `alt` requirement and render `alt=""`. (The suggested `aria-hidden={alt ? undefined : true}` changes behavior, so prefer relaxing `alt`.)
- `src/components/Input.tsx:103-112` (low) -- password toggle is `h-fit w-fit` around a `size-5` icon with the `px-3` padding on a non-clickable wrapper div, so the real target is ~20x20px -> Move the hit area onto the button: `flex h-full min-h-[44px] min-w-[44px] items-center justify-center`.
- `src/components/ui/AnimatedCTA.tsx:55-68` (low) -- both CTA `<Link>`s use `px-6 py-2` (~40px tall), under the 44px touch minimum -> Bump to `py-2.5 min-h-[44px]`; optionally add `active:scale-[0.97]`.
- `src/components/modals/` close buttons (low) -- `p-2` around `h-5 w-5` = 36x36px hit area (`Lease` 64, `Valuation` 67, `Transaction` 63, `Consultation` 61, `Strategic` 60, `Advisory` 60) -> `grid h-11 w-11 place-items-center` keeping the icon at `h-5 w-5`. (Passes WCAG 2.5.8 AA at 36px; this is the 44px AAA/HIG target.)
- `src/components/ComboChart.tsx:108-121` (low) -- when interactive, the Tremor legend renders a clickable `<li onClick>` with no `role`/`tabIndex`/keydown (latent; only `DcfChart` consumes it, without `onValueChange`) -> Render as `<button type="button">` (or add `role="button"`, `tabIndex={0}`, Enter/Space) when `hasOnValueChange`.
- `src/components/ComboChart.tsx:180-206,264` (low) -- Tremor `ScrollButton` is a `size-5` icon-only button with no `aria-label`, and `scrollTo` uses unconditional `behavior:"smooth"` (latent; no `enableLegendSlider` consumers) -> Add `aria-label`, expand the hit area to 44px, gate the smooth scroll behind `prefers-reduced-motion: no-preference`.
- `src/components/markedsinnsikt/maps/NordNorgeLeafletMap.tsx:51-62` (low) -- clickable city `CircleMarker`s are mouse-only (no keydown/role/aria-label) -> Optional parity: mirror `MarkedsKartLeafletCelle`'s `CityMarker`. Not blocking, since the adjacent `mi-city-picker` buttons give a full keyboard/SR path.
- `src/components/markedsinnsikt/maps/NordNorgeLeafletMap.tsx:51-54` (low) -- markers are 14-20px diameter, under 44px -> Render a transparent interactive hit-circle (radius ~22, `fillOpacity 0`, `weight 0`) carrying the handlers, keeping the visible marker at its data radius.
- `src/components/markedsinnsikt/maps/MarkedsKartLeafletCelle.tsx:169-179` (low) -- main `CityMarker` is 16-36px; the smallest fall below 44px (the decorative halo is `interactive:false`) -> Add a transparent interactive hit-circle `radius={Math.max(radius,22)}`.
- `src/components/verktoy/CalculatorCTA.tsx:25,33` (low) -- both CTA buttons forced to `h-10` (40px), under the project's own 44px floor -> Use `h-11` or `min-h-[44px]`.
- `src/styles/advanti-design.css:8016-8021,8105-8108` (low) -- lightbox controls under 44px: `.ed-lb-close` 40px, `.ed-lb-nav` drops to 40px at max-width:880px, `.ed-lb-thumb` 42px on mobile -> Bump close and the 880px-block nav to 44px (expand via padding/`::before` if the visible circle must stay smaller). Redundant Esc/swipe/overlay paths keep this low.
- `src/styles/advanti-design.css:10657-10661,10752,10762` (low) -- the coarse-pointer floor block omits `.hs-pill` (~30px), `.hs-chip` (40px), `.hs-sortbtn` (40px) -> Extend `@media (pointer:coarse)` with `.hs-pill,.hs-chip,.hs-sortbtn { min-height:44px }` and `inline-flex; align-items:center` on `.hs-pill`.

### Forms

- `src/components/site/NewsletterSection.tsx:79-86` (high) -- `.newsletter-form input` sets `outline:none` (css:1514) with no `:focus`/`:focus-visible`/`:focus-within` replacement; the band's primary input (and the site-wide footer signup) has no visible keyboard focus (WCAG 2.4.7) -> `.newsletter-form input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`.
- `src/styles/advanti-design.css:7823-7836` (medium) -- `.ei-alert input, .ei-alert select` set `font-size: 13px`, so iOS Safari auto-zooms on focus of the SavedSearchAlert lead inputs (`ListingsBrowser.tsx:477-517`); no mobile block raises it -> Set `font-size: 16px`; optionally `@media (pointer:fine){ font-size:13px }` to keep the small look on desktop.
- `src/components/modals/` (medium) -- five modals wrap the body in `overflow-hidden` while `Dialog.Content` is `max-h-fit overflow-hidden` (`modal.tsx:98`), so tall forms clip with no scroll on short/landscape viewports, putting submit out of reach (`Lease` 60-61, `Transaction` 59-60, `Consultation` 57-58, `Strategic` 57-58, `Advisory` 57-58) -> Mirror `ValuationRequestModal` (59-64): pass `className="max-h-[85vh] overflow-y-auto"` to `<Modal>` and drop `overflow-hidden` from the inner wrapper. The dev already proved this fix on one modal.
- `src/components/modals/LeaseRequestModal.tsx` and siblings (low) -- currency/area fields use `type="number"` with space-grouped placeholders (`budgetRange "50 000"`, `Valuation` income/costs 240-245/254-259, `Transaction` estimatedValue 232-237); `Input` defaults `enableStepper=true`, so spinners render and the formatted value is rejected -> Switch to `type="text" inputMode="numeric"` (the pattern `VerdivurderingIntakeForm.tsx:226,238` already uses).
- `src/components/modals/` + `src/components/ContactUsForm.tsx:51` (low) -- all six modals and ContactUsForm gate re-submission only on async `isSubmitting`; a same-frame double-click can dispatch the lead twice -> Add a synchronous `const submitting = useRef(false)` guard at the top of `handleSubmit` (return early if set, reset in `finally`), mirroring `CityLeadForm.tsx:32,37-38,56`.

### Z-index

No violations. Baseline confirms the hardcoded z-scale is intentional (Leaflet 1000/800 required) and there are no arbitrary `z-[9999]` values. Tokenizing into `--z-*` is an optional enhancement, not a fix.

### Component-design

- `src/components/Button.tsx:13` (low) -- site-wide button base `transition-colors duration-100 ease-out` has no `:active` press feedback; every CTA built on it lacks a tactile press -> Add `active:scale-[0.97]` and include transform: `transition-[color,background-color,transform] duration-100 active:scale-[0.97]`.
- `src/styles/advanti-design.css:955-971` (low) -- `.btn` declares `transform 0.22s ease` in its transition but no `:active` rule ever applies a transform, so the declared transition is unused -> Add `.btn:active { transform: scale(0.97) }` gated under `prefers-reduced-motion: reduce { transform: none }`.
- `src/components/Button.tsx:13` + `src/components/ContactUsForm.tsx:218-224` (low) -- neither the shared `Button` base nor ContactUsForm's raw submit has `active:scale` (rules 37/53). There is no existing CSS convention to match (`.btn`/`.fbtn` have no `:active`), so this introduces a press-feedback pattern site-wide -> Add `active:scale-[0.97]` + `transition-transform` to the `Button` base and the raw submit.
- `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx:271-288,478-495,651-668,766-782,909-925,1049-1066` (low) -- all six views hand-repeat the identical `.mi-section-head` block with an inline `{marginBottom:18, display:"inline-flex"}`; YieldView/LeieView also duplicate the `.miv-controls` sub-tabs+RangeSelector verbatim -> Extract `<SectionHead eyebrow stamp source>` (move the 18px gap into CSS) and a shared `<SegmentControls />`.
- `src/components/markedsinnsikt/maps/MarkedsKartHoved.tsx:481-493` (low) -- ranked-table rows are interactive on the `<tr>` (onClick, tabIndex, Enter/Space, aria-label) but have no `role`, so SR announces "row", not an action -> Move the action to a `<button type="button">` in the first cell and drop the row-level handlers, preserving table semantics.
- `src/components/verktoy/ROICalculator.tsx:105,138,171,204,237` + `src/components/verktoy/MortgageCalculator.tsx:103,136,169,202` (low) -- labels use dead Tremor tokens (`text-tremor-default`, `text-tremor-content-strong`, undefined in this Tailwind config) and Tailwind cards instead of the `.calc-*` design system (contradicts DESIGN.md) -> Replace with `calc-lbl`/`text-warm-grey` and align card chrome to `.calc-inputs`/`.calc-result`.
- `src/components/help/HelpSearch.tsx:33-44` + `src/components/help/HelpLibrary.tsx:34-45` (low) -- matching folds Norwegian chars via `foldNo()` but `highlight()` locates the span with `toLowerCase().indexOf()`, so a folded-only match ('bodo' -> 'Bodø') returns -1 and renders no `<mark>` -> Locate on folded strings: `const i = foldNo(text).indexOf(foldNo(q))`, then slice the original `text` by `i` and `q.length`.
- `src/components/locations/LocationMdx.tsx:6,27` (low) -- `(props: any)` drops type safety on MDX anchor props and `<Link {...props} href={href}>` sets `href` via both spread and explicitly -> Type as `React.ComponentPropsWithoutRef<"a">` and destructure `{ href, children, ...rest }`.

### Over-animation

- `src/components/analyseportal/AnalyseportalShell.tsx:166-172` (low) -- `toggleCity` sets `animateRef.current=true` so every city-chip click re-animates the trend chart, directly contradicting the segment-handler comment at 272-274 ("City-chip toggles stay unanimated, speed over delight") on a high-frequency control -> Set `animateRef.current=false` in `toggleCity` to honor the stated intent, or fix the now-false comment if animating is genuinely wanted.

### Blog (follow-up pass)

Accessibility
- `src/components/blog/copy-box.tsx:18-27` (high) -- icon-only copy button has no accessible name; renders only `<RiCheckLine/>`/`<RiFileCopyLine/>`, SR announces "button" (rule 61, WCAG 4.1.2 Level A) -> `aria-label={copied ? "Kopiert" : "Kopier"}` + `aria-hidden` on the icons; optionally `aria-live` for state.
- `src/components/blog/copy-box.tsx:19-20` (medium) -- copy button tap target is ~24px (`p-1` around `h-4 w-4`), under 44px (rule 65) -> `min-w-[44px] min-h-[44px] inline-flex items-center justify-center`.

Performance
- `src/components/blog/scroll-progress.tsx:40-42` (high) -- reading-progress bar animates layout `width` (`style={{ width: `${progress}%` }}` + `transition-all`) every scroll frame on every article (rules 22/44) -> render full-width and drive with `transform: scaleX(progress)` + `transform-origin: left` + `transition-transform`.
- `src/components/blog/scroll-progress.tsx:40` (medium) -- `transition-all` (rule 23) on the same per-frame element -> `transition-transform`.
- `src/components/blog/integrations.tsx:20` (medium) -- card uses `transition-all` for a border/background hover (rule 23) -> `transition-colors`.
- `src/components/blog/integrations.tsx:28` (medium) -- logo uses `transition-all` to animate a `grayscale` filter (rule 23) -> `transition-[filter]` at 100-150ms.
- `src/components/blog/icons/expanding-arrow.tsx:9,24` (medium) -- both crossfading arrows use `transition-all` (rule 23); motion (transform+opacity) is correct -> `transition-[transform,opacity]` at ~150ms.

Timing
- `src/components/blog/modal.tsx:50-72` (medium) -- mobile Vaul drawer/overlay run Vaul's ~500ms defaults with no override (rule 81; confirmed zero `[vaul-*]` rules in CSS) -> add `[vaul-drawer]{transition-duration:200ms;transition-timing-function:cubic-bezier(0.165,0.84,0.44,1)}` (+ `[vaul-overlay]`) to `advanti-design.css`.
- `src/components/blog/category-card.tsx:84,94,98` (low) -- three hover opacity fades at 300ms (rule 10 caps hover at 100-150ms) -> `duration-150`.
- `src/components/blog/modal.tsx:90,98` (low) -- paired backdrop/content durations mismatch (`animate-dialogOverlayShow` 150ms vs `animate-scale-in` 180ms, rule 86 flags >20ms) -> align both to the same duration.

Component-design / consistency
- `src/components/blog/copy-box.tsx:10-32` (low) -- off-system cool-gray tokens (`border-gray-200 bg-white`, `text-gray-600`, etc.) on the warm system (rule 43) -> warm-grey tokens.
- `src/components/blog/zoom-image.tsx:27,36` (low) -- off-system `border-gray-200` + `text-gray-500` caption (rule 43) -> `border-warm-grey-2/20` + `text-warm-grey/60`.
- `src/components/blog/mdx.tsx:389` (low) -- AnimatedCTA hover is a no-op: base and hover apply the identical `shadow-lg shadow-warm-grey-2/5`, so `transition-shadow` animates nothing -> give hover a distinct shadow or drop the dead classes.

## 4. Per-component scorecard

| Component group | File | Grade | Note |
|---|---|---|---|
| markedsinnsikt-shell | src/components/markedsinnsikt/MarkedsinnsiktShell.tsx | B | No motion violations and correctly leaves tab switches un-animated; held back by a nested `<main>` landmark, an incomplete role=tab ARIA contract (no arrow-key/aria-controls/tabpanel), and heavy per-view header/control duplication. |
| markedsinnsikt-shell | src/components/markedsinnsikt/MarketDataSummary.tsx | A | Clean SSR semantic tables with sr-only captions; dynamic numerics covered by design-system tabular-nums; no motion, no layout-shift, nothing to flag. |
| markedsinnsikt-shell | src/components/markedsinnsikt/MapErrorBoundary.tsx | A | Correct class-based error boundary (required for componentDidCatch), native text reset button, graceful localized fallback; no animation, no rubric violations. |
| charts | src/components/ComboChart.tsx | C | Vendor Tremor; animations disabled and tabular-nums present, but clickable legend `<li onClick>` and unlabeled 20px icon scroll buttons are keyboard/a11y gaps (only active behind unused flags). |
| charts | src/components/advanti/DcfChart.tsx | D | Logic and structure clean, but the custom tooltip renders near-black `text-warm-grey` on `bg-gray-900`, so heading and values are effectively invisible. |
| charts | src/components/markedsinnsikt/charts/MarketLineChart.tsx | B | Solid: reduced-motion gated, aria-label, fixed Y-domain to avoid jump; only the ungated 500ms draw that replays on range/legend interaction holds it back. |
| charts | src/components/markedsinnsikt/charts/MarketBarChart.tsx | B | Same shape as MarketLineChart, well-built, but 500ms bar-grow re-runs on data change instead of mount-only. |
| charts | src/components/markedsinnsikt/charts/ChartTooltip.tsx | A | Clean: token colors, hairline border on white card, tabular-nums on values, no animation, no a11y issues. |
| charts | src/components/markedsinnsikt/charts/chartTheme.ts | A | Pure tokens; cursor objects hoisted for stable refs to avoid recharts re-render, thoughtful. |
| charts | src/components/analyseportal/charts/PortalCharts.tsx | A- | Reduced-motion + mount-gated animate, deduped branded tooltip, sparkline animation off; only the 500ms duration is slightly over the 300ms budget. |
| charts | src/components/naringsmegler/ChartTooltipOverlay.tsx | A | Exemplary: server-rendered static SVG (zero CLS), keyboard-focusable hit rects with per-point aria-label, touch-outside dismiss, focus/blur handling, timer cleanup. |
| site-nav-layout | src/components/site/Nav.tsx | A | Exemplary: native `<button>` triggers w/ aria-expanded/controls/inert, hover-intent gated to (hover:hover), Escape+focus-return+click-outside, CSS reduced-motion handled, house easing curve, 44px hamburger target. |
| site-nav-layout | src/components/site/SubHero.tsx | B+ | Clean server component, priority hero image, balanced h1; only ding is the shared .btn lacking :active press feedback (rule 37). |
| site-nav-layout | src/components/site/Breadcrumbs.tsx | A | Registry-driven, safe JSON-LD via JsonLd helper, curly separator aria-hidden, crumb links have focus-visible in CSS. No issues. |
| site-nav-layout | src/components/site/NewsletterSection.tsx | C+ | Strong patterns (useActionState pending/disabled, role=status/alert, 16px input, Enter-submit) but the primary input has outline:none with no focus ring, a WCAG 2.4.7 failure. |
| site-nav-layout | src/components/site/Footer.tsx | A- | Clean; prefetch=false on low-priority links. new Date().getFullYear() is a Cache-Components SSR concern (noted in memory) but not an Emil-rubric violation. |
| site-nav-layout | src/components/site/CtaStrip.tsx | B+ | Good CtaButton composition (next/link vs `<a>` for external/tel/mailto); only the shared .btn missing :active feedback applies. |
| site-nav-layout | src/components/site/SeOgsa.tsx | A | slice(0,3), null-on-empty, analytics on click, seogsa-link:focus-visible defined. No issues. |
| site-nav-layout | src/components/site/Faq.tsx | A | Native `<details>`/`<summary>` (gold standard, rule 73), schema/visible parity from one items array, generous 28px summary padding, .a width 70ch within limit. |
| site-nav-layout | src/components/site/OfficeMap.tsx | A | Correct ssr:false client boundary, aria-label on container, aria-hidden loading placeholder, Leaflet z-index is baseline-intentional. No issues. |
| site-nav-layout | src/components/site/PhotoBand.tsx | B+ | Solid editorial band; minor aria-hidden vs required-alt contradiction when no caption (rule 61). |
| site-nav-layout | src/components/site/FooterCityLinks.tsx | A | Minimal client leaf for analytics, keyed list, prefetch=false. No issues. |
| site-nav-layout | src/components/site/ProseShell.tsx | A | Trivial className-composing wrapper. Nothing to flag. |
| ui-primitives | src/components/ui/Animated-Grid-Background.tsx | B | Reduced-motion + opacity-only is clean, but the setInterval drives a perpetual 50-rect remount/animation loop with no off-screen pause and the transition has no explicit easing. |
| ui-primitives | src/components/ui/Fade.tsx | B- | Good reduced-motion fallback, but the entrance spring uses raw stiffness/mass/damping (rule 18) and overshoots (~bounce 0.29) on a plain content fade. |
| ui-primitives | src/components/ui/AnimatedCTA.tsx | B | Solid composition; CTA link-buttons lack active press feedback and sit just under the 44px touch target. |
| ui-primitives | src/components/ui/HvaSkjerVidereBlock.tsx | A | Static, semantic (aria-labelledby), gap-based grid, decorative number aria-hidden, tracked CTA, clean. |
| ui-primitives | src/components/ui/Divider.tsx | A | Pure presentational hairline divider, no motion, no issues. |
| ui-primitives | src/components/ui/FeatureDivider.tsx | B- | Reduced-motion handled and transform-only, but it's a perpetual decorative CSS loop with no off-screen pause (rule 28) plus dead `0 * 0.2` arithmetic. |
| ui-primitives | src/components/ui/ArrowAnimated.tsx | A | Curated `transition` (not transition-all), motion-safe-gated translate, aria-hidden, transform/opacity only, textbook hover affordance. |
| ui-primitives | src/components/Button.tsx | B- | Good focus ring + variants, but the site-wide primitive has no active:scale press feedback, no touch-action: manipulation, and bare ease-out on the colour transition. |
| ui-primitives | src/components/Badge.tsx | A | Static, non-interactive variant component; nothing to animate, nothing wrong. |
| ui-primitives | src/components/Card.tsx | A | Static container with token border on warm-white; no motion, no violations. |
| ui-primitives | src/components/Input.tsx | B- | Correct focus ring + 16px mobile font, but the password toggle uses transition-all (rule 23) and is a ~20px icon-only tap target. |
| ui-primitives | src/components/Select.tsx | B+ | Headless Radix, will-change + motion-reduce + house easing on enter; only nit is font-weight on the checked item (rule 33), redundant with the check icon. |
| ui-primitives | src/components/CTAButtons.tsx | A- | Clean ssr:false modal deferral and headless Radix dialogs; buttons have text labels (no aria-label needed). Heavy duplication across groups is a DRY smell, not a rubric issue. |
| ui-primitives | src/components/MotionProvider.tsx | A | Baseline-confirmed reducedMotion=user wrapper; correct and minimal. |
| maps | src/components/markedsinnsikt/maps/MarkedsKartHoved.tsx | B | Exemplary state + reduced-motion scroll gating and native buttons; loses points for the metric-switch animating padding, a 400ms bare-ease bar, and a role-less interactive `<tr>`. |
| maps | src/components/markedsinnsikt/maps/MarkedsKartLeafletCelle.tsx | A | Meticulous Leaflet integration, reduced-motion-gated flyTo/flyToBounds, stable handler memoization, full marker keyboard/aria + Esc, coarse-pointer drag gating; only nit is sub-44px marker hit targets. |
| maps | src/components/markedsinnsikt/maps/NordNorgeLeafletMap.tsx | C | Clickable city markers are mouse-only, no keyboard handler, role, aria-label, and a sub-44px tap target; should mirror the detail map's marker a11y. |
| maps | src/components/markedsinnsikt/maps/mapTheme.ts | A | Clean single-source theme constants with justified literal hex for Leaflet's canvas; nothing to animate, nothing to flag. |
| maps | src/components/eiendommer/PropertyMapLeaflet.tsx | C | JSDoc promises drag-off for touch-scroll but `dragging` is never set false, so a one-finger drag is trapped on mobile (property pages + the city-panel embed). |
| maps | src/components/eiendommer/PropertyMap.tsx | A | Clean client wrapper: aria-label on the container, height-reserving aria-hidden loader, correct ssr:false boundary. |
| maps | src/components/naringsmegler/CityLocationMapClient.tsx | A | Minimal correct client boundary with a height-reserving loader; the only concern (drag) lives in the reused PropertyMapLeaflet. |
| maps | src/components/naringsmegler/CityLocationPanel.tsx | A | Clean server component with solid semantics, `<address>`, tel:/mailto: links, rel=noopener on the external map link; no motion to flag. |
| modals-forms | src/components/modals/LeaseRequestModal.tsx | C | Solid Radix/Vaul shell, but close button has no aria-label + sub-44px target, overflow-hidden clips this 8-field form on short viewports, and currency uses type=number. |
| modals-forms | src/components/modals/ValuationRequestModal.tsx | C+ | Best of the modals, correctly scrolls via max-h-[85vh] overflow-y-auto; still missing close-button aria-label/44px target and uses type=number for money. |
| modals-forms | src/components/modals/TransactionRequestModal.tsx | C | Same close-button a11y/size gaps, overflow-hidden clipping, and type=number estimatedValue; CTA lacks press feedback. |
| modals-forms | src/components/modals/ConsultationModal.tsx | C+ | Native `<select>` is fine and accessible; loses points on close-button aria-label/tap target and overflow-hidden clipping. |
| modals-forms | src/components/modals/StrategicAdvisoryModal.tsx | C | Tallest form (2 required textareas + fields) yet still overflow-hidden with no scroll; close-button a11y/size gaps. |
| modals-forms | src/components/modals/AdvisoryRequestModal.tsx | C | Close-button aria-label/tap-target gaps and overflow-hidden clipping; otherwise clean. |
| modals-forms | src/components/forms/VerdivurderingIntakeForm.tsx | A- | Reference form: correct input types (text+inputMode numeric), required-radio pattern, consent, role=alert error, disabled-on-submit; only nit is success state isn't focus-announced. |
| modals-forms | src/components/ContactUsForm.tsx | B- | Good controlled validation + visible focus ring, but uses off-brand Tremor tokens (DESIGN.md wants warm-grey/warm-white), CTA lacks active:scale, no synchronous double-submit guard. |
| modals-forms | src/components/naringsmegler/CityLeadForm.tsx | A | Exemplary, synchronous double-submit ref guard, focus moved to success heading, aria-live/role=alert, honeypot, network-fail stays inline. The pattern the modals should copy. |
| analyseportal | src/components/analyseportal/sectorViews.tsx | A | Pure data/view builder; all motion delegated to reduced-motion-aware charts + NumberFlow, honest typography, static --fill vars (not pointer/rAF-driven), no transition-all / ease-in / dark:. |
| analyseportal | src/components/analyseportal/AnalyseportalShell.tsx | B | Excellent a11y and hash/state plumbing, but arrow-key tab nav animates the chart (rule 12) and city-chip toggle animates against its own stated 'speed over delight' intent (rule 13). |
| analyseportal | src/components/analyseportal/PortalSeoTables.tsx | A | Pure SSR tables, no motion surface, correct U+2212 minus sign and 'uendret' zero-state; nothing to flag. |
| analyseportal | src/components/analyseportal/bits.tsx | A | Clean primitives: aria-pressed + min-1 lock + sr-only on legend, non-color-only delta arrows, CLS-safe fixed-height skeleton, error boundary with typed button; no motion violations. |
| eiendommer-listings | src/components/eiendommer/ListingsBrowser.tsx | B | Clean filter logic, native Links, tabular-nums via CSS, good pending-state form; loses points for role=radiogroup+aria-pressed mismatch and the 13px form inputs that trigger iOS zoom. |
| eiendommer-listings | src/components/eiendommer/ActiveListingsStrip.tsx | A | Tidy server component reusing the .ei-card design-system chrome correctly; native Link/Image, tabular-nums via CSS, no motion or layout issues. |
| eiendommer-listings | src/components/eiendommer/ListingLightbox.tsx | B | Strong Radix Dialog usage (focus-trap, Esc, aria-live counter, aria-labels, ref-based swipe with no per-frame state, reduced-motion handled in CSS); held back only by sub-44px close/mobile-nav targets and a non-tabular counter. |
| eiendommer-listings | src/components/eiendommer/ListingProse.tsx | A | Dependency-free markdown renderer, no animation, correct rel=noopener noreferrer on external links; nothing to flag against the rubric. |
| eiendommer-listings | src/components/eiendommer/GalleryLightbox.tsx | A- | Smart code-split (dynamic ssr:false) + single delegated click handler over real focusable .ed-tile-btn children (keyboard-safe); only nit is a possible first-open chunk-fetch delay (could preload on pointerenter). |
| calculators | src/components/verktoy/NaringskalkulatorClient.tsx | A- | Exemplary: debounced NumberFlow (animated={!isEditing}), idle->input focus-swap with aria-label, tabular-nums + focus-visible via CSS, native radios/buttons. No violations. |
| calculators | src/components/verktoy/YieldCalculatorV2.tsx | B | Solid TSX, but its bench dot/mark animate `left` at 500ms and its .switch uses transition:all (both in CSS), rule 22/9/23 hits. |
| calculators | src/components/verktoy/SjekklisteVerdivurderingClient.tsx | A | Clean: native checkboxes in labels, optimistic form with disabled state, transform-based progress bar (RM-gated), SSR-safe localStorage hydration. |
| calculators | src/components/verktoy/ValuationYieldCalculator.tsx | A- | Mirrors the strong Naringskalkulator patterns; range dot snaps instantly (no left animation). No violations. |
| calculators | src/components/verktoy/ROICalculator.tsx | C | Good NumberFlow debounce, but 5 hover-only tooltips inaccessible on touch/keyboard and off-design-system Tremor tokens. |
| calculators | src/components/verktoy/MortgageCalculator.tsx | C | Same inaccessible hover-tooltip pattern (4x) and Tremor tokens; otherwise correct annuity math + debounced rolls. |
| calculators | src/components/verktoy/CalculatorLayout.tsx | A- | Server component, targeted transition-colors back link; 600ms header slide-up-fade is acceptable marketing-route entrance with house ease-out curve. |
| calculators | src/components/verktoy/CalculatorCTA.tsx | B+ | Clean composition with labeled icon buttons; only nit is h-10 (40px) under the 44px tap-target floor. |
| calculators | src/components/verktoy/JourneyStepTracker.tsx | A | Minimal analytics leaf + underlined link; nothing to animate, nothing wrong. |
| help-content | src/components/help/HelpSearch.tsx | B | Strong ARIA combobox (activedescendant, Esc/Cmd-K, click-outside); dinged for 120ms fade on arrow-key highlight, ~30px suggestion pills on touch, and highlight() ignoring Norwegian folding. |
| help-content | src/components/help/HelpLibrary.tsx | B | Clean filter/sort/paginate logic and aria-live counts; rows animate padding on hover (rule 22) and chips/sort buttons sit at 40px touch targets. |
| help-content | src/components/help/ArticleFeedback.tsx | A | Instant optimistic Ja/Nei feedback, role=status aria-live, native buttons with focus-visible and a 44px coarse-pointer floor. |
| help-content | src/components/help/HelpDisclaimer.tsx | A | Static server component, correct rel=noopener noreferrer on external sources, no motion/layout concerns. |
| help-content | src/components/help/HelpFaq.tsx | A | Native `<details>` (zero JS), no height animation, JSON-LD mirrors visible answer text per schema policy. |
| help-content | src/components/naringsmegler/CityMarketBlock.tsx | A | Build-time static SVG with zero layout shift; tabular-nums on tiles/table, role=img+aria-label on chart, decorative sparklines aria-hidden. |
| help-content | src/components/tjenester/ServiceCityPage.tsx | A | Pure server-side composition of site primitives; tabular-nums stats table, no client motion or layout-prop animation. Only nit: index keys on static intro paragraphs. |
| help-content | src/components/locations/LocationMdx.tsx | B | Correct internal/hash/external link routing with proper rel; loses points for `any`-typed props and a doubled href spread on Link. |
| blog | src/components/blog/mdx.tsx | B | Clean MDX component map; only flaw is a no-op hover shadow on AnimatedCTA; loading skeleton correctly motion-reduce gated. |
| blog | src/components/blog/category-card.tsx | B | Correct useMotionValue/.set() pointer pattern with reduced-motion guard; hover opacity fades a touch slow at 300ms. |
| blog | src/components/blog/ArticleToc.tsx | A | Scroll-spy via IntersectionObserver + scrollend with click-lock; smooth scroll inherits the gated global; no issues. |
| blog | src/components/blog/modal.tsx | B | Headless Radix+Vaul (focus trap/restore); scale-in from 0.96 fine, but Vaul defaults not overridden and backdrop/content durations differ by 30ms. |
| blog | src/components/blog/Advisor.tsx | A | Server card, no motion; good typography and safe tel:/mailto fallbacks. |
| blog | src/components/blog/katex-math.tsx | A | Imperative fit-to-width via ResizeObserver with feedback-loop guard; nothing to flag. |
| blog | src/components/blog/integrations.tsx | C | Two `transition-all` offenders (border/bg card + grayscale filter); properties need scoping. |
| blog | src/components/blog/scroll-progress.tsx | C | Animates layout `width` every rAF tick plus `transition-all`; should be a `transform: scaleX` compositor-only bar. |
| blog | src/components/blog/zoom-image.tsx | B | Library zoom fine; off-palette cool-gray border/caption against the warm system. |
| blog | src/components/blog/copy-box.tsx | C | Icon-only button lacks aria-label and is a ~24px tap target; also off-system gray palette. |
| blog | src/components/blog/legal.tsx | B | No motion; uses shadcn semantic tokens rather than warm-grey (off-system, not a rubric violation). |
| blog | src/components/blog/help-article-link.tsx | A | Proper `transition-colors` with active state and full-row tap target; nit is the ExpandingArrow child (flagged in its own file). |
| blog | src/components/blog/max-width-wrapper.tsx | A | Pure layout wrapper, nothing to flag. |
| blog | src/components/blog/icons/expanding-arrow.tsx | C | Two `transition-all` offenders on the crossfading arrows; motion correct, properties need naming. |

## 5. Top 10 highest-impact fixes

1. **DcfChart tooltip contrast** (`src/components/advanti/DcfChart.tsx:33,63`). A two-line color swap fixes invisible heading and `kr` values on every blog-embedded DCF chart. High severity, trivial fix, top ROI.
2. **Icon-only buttons missing aria-label** -- six modal close buttons (`src/components/modals/`) plus the code-block copy button (`src/components/blog/copy-box.tsx:18-27`). WCAG 4.1.2 Level A failure; SR users hear only "button". One attribute each.
3. **Newsletter input focus ring** (`src/components/site/NewsletterSection.tsx:79-86`). WCAG 2.4.7 failure on the site-wide footer signup and the band variant; one CSS rule restores keyboard focus visibility.
4. **PropertyMapLeaflet scroll-trap** (`src/components/eiendommer/PropertyMapLeaflet.tsx:39-47`). Mobile users on every property detail page plus the city embed get their page scroll hijacked, the exact failure the JSDoc claims to prevent.
5. **ei-alert 13px iOS auto-zoom** (`src/styles/advanti-design.css:7823-7836`). The primary SavedSearchAlert lead form jolts the viewport on every mobile focus; raise to 16px.
6. **Five modals clip on short viewports** (`src/components/modals/`). Submit can be unreachable on landscape phones; the fix is already proven in `ValuationRequestModal`, just copy it.
7. **ROICalculator + MortgageCalculator hover tooltips** (`ROICalculator.tsx`, `MortgageCalculator.tsx`). 9 tooltips invisible to keyboard and screen readers; convert triggers to focusable buttons with `role="tooltip"`.
8. **MarketLineChart + MarketBarChart re-animate on interaction** (`MarketLineChart.tsx:141-143`, `MarketBarChart.tsx:129-131`). The two primary market views replay a 500ms draw on every range/legend change; mount-gate the `animate` prop.
9. **ListingsBrowser radiogroup mismatch** (`src/components/eiendommer/ListingsBrowser.tsx:184,209,229`). Three filter groups announce a contradictory pattern to SR users; change `role="radiogroup"` to `role="group"`.
10. **MarkedsinnsiktShell landmark + tab contract** (`MarkedsinnsiktShell.tsx:1216` and `:148-160,291-303,498-510,1195-1214`). A nested `<main>` plus role=tab widgets with no keyboard contract on the main market-insight surface; de-landmark the wrapper and add roving focus + arrow keys (or Radix Tabs).

## 6. Quick wins vs bigger refactors

**Quick wins (localized, low-risk, mostly one line or one rule):**
- DcfChart `text-warm-grey` -> `text-warm-white` (2 lines).
- `aria-label="Lukk"` + `aria-hidden` on the six modal close buttons.
- `.newsletter-form input:focus-visible` ring (1 CSS rule).
- `.ei-alert input/select` font-size 16px.
- ListingsBrowser three `role="radiogroup"` -> `role="group"`.
- `.ed-lb-counter` add `tabular-nums`.
- `Input.tsx:112` `transition-all` -> `transition-colors duration-150`.
- `.switch`/`.switch::after` name the transition properties.
- `Select.tsx:203` drop `data-[state=checked]:font-semibold`.
- `FeatureDivider` dead arithmetic -> literal delays.
- `CalculatorCTA` `h-10` -> `h-11`; modal close buttons to `h-11 w-11`.
- Modal currency fields `type="number"` -> `type="text" inputMode="numeric"`.
- `MarkedsKartHoved` `.hot` padding -> background-only; ranked bar `ease` -> house curve at 450ms.
- `.hs-row`/`.hs-mr` padding -> transform; `.hs-res` keyboard fade scoped to hover; `.hs-pill/.hs-chip/.hs-sortbtn` min-height 44px.
- Lightbox `.ed-lb-close`/`.ed-lb-nav` to 44px.
- `Fade.tsx` spring -> `{duration:0.5, bounce:0}`.
- `AnalyseportalShell` arrow-key `animate=false` flag + reconcile the city-toggle comment.
- `HelpSearch`/`HelpLibrary` `highlight()` -> fold-aware offset.
- `LocationMdx` typed props, drop the doubled href spread.
- `bench-mark`/`bench-dot` duration to ~0.22s on transform.
- `PhotoBand` relax `alt` for the always-decorative band.
- Blog: `copy-box` add `aria-label` + 44px hit area; the 5 `transition-all` offenders (`integrations` ×2, `scroll-progress`, `expanding-arrow` ×2) named to explicit properties; `category-card` hover fades to `duration-150`; `modal` backdrop/content durations aligned; off-system gray tokens in `copy-box`/`zoom-image` to warm-grey; dead `transition-shadow` removed in `mdx.tsx:389`.

**Bigger refactors (touch multiple files or introduce a pattern):**
- Blog `scroll-progress` bar: stop animating `width` every scroll frame; rebuild as a `transform: scaleX` compositor-only bar (runs on every article).
- Blog `modal`: override Vaul's ~500ms drawer/overlay defaults to ~200ms `cubic-bezier(0.165,0.84,0.44,1)` via `[vaul-drawer]`/`[vaul-overlay]` rules in `advanti-design.css`.
- Mount-gate chart animation across `MarketLineChart`/`MarketBarChart` via a parent-controlled `animate` prop in `MarkedsinnsiktShell` (the `PortalCharts` pattern).
- Build the proper tab contract (roving focus + arrow keys + `aria-controls` + `role="tabpanel"`) for the `MarkedsinnsiktShell` sector nav and sub-tabs, or adopt Radix Tabs; convert RangeSelector to a radiogroup.
- Rebuild the 9 `ROICalculator`/`MortgageCalculator` tooltips as focusable controls (button + `role="tooltip"` or Radix), and migrate both calculators off dead Tremor tokens onto the `.calc-*` design system.
- Apply the `ValuationRequestModal` scroll fix to the other five modals, plus add the synchronous double-submit `useRef` guard (from `CityLeadForm`) to all six modals and `ContactUsForm`.
- Introduce a site-wide press-feedback convention (`active:scale-[0.97]` on `Button`, `.btn`, `.fbtn`) under a reduced-motion guard. This is a new pattern, not a consistency fix, so decide deliberately.
- Add transparent interactive hit-circles to the three Leaflet maps (`NordNorgeLeafletMap`, `MarkedsKartLeafletCelle`) and convert the ranked-table `<tr>` action to a button-in-cell in `MarkedsKartHoved`.
- Extract `<SectionHead>` and `<SegmentControls>` from the six duplicated `MarkedsinnsiktShell` views.

## 7. Sources & method (where this came from)

- **Primary source — animations.dev (Emil Kowalski's "Animations on the Web" course).** Paywalled; accessed with the user's imported auth cookies via the gstack `browse` tool. Read in full: 45 lessons across 8 modules (Animation Theory, CSS Animations, Framer Motion, Good vs Great, Family Drawer, Dynamic Island, Navigation Menu, Hero Illustration + guest lesson), 4 interview transcripts (Henry Heffernan, Mariana Castilho, Lochie Axon, Dennis Brotzky), and the Vault — ~90,700 words. Scraped text lives in the session scratchpad (`scratchpad/lessons/`), is not committed, and was used only for this internal audit.
- **Secondary source — the `/emil-design-engineering` skill** + its 8 reference files (`animations`, `ui-polish`, `design-rules`, `forms-controls`, `touch-accessibility`, `component-design`, `marketing`, `performance`), which distil Emil's public blog (Great Animations, Good vs Great, 7 Practical Animation Tips, Developing Taste, The Magic of Clip Path, Building a Toast/Drawer Component, and more).
- **Method.** A 32-agent workflow: 7 readers distilled 247 raw principles from the corpus + skill → synthesized into the 91-rule [`EMIL_RUBRIC.md`](./EMIL_RUBRIC.md); 1 agent captured our existing infrastructure as a baseline so the audit would not re-flag what we already do right; 11 component groups were reviewed with a review → adversarial-verify pipeline (only 2 findings rejected as false positives); the blog group was re-run after an API drop. The fix backlog is in [`EMIL_REFACTOR_PRD.md`](./EMIL_REFACTOR_PRD.md).