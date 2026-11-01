---
name: 'Clear Air'
description: 'A scenic visual system with coordinated light and dark appearances, generous Inter typography and live CSS glass.'
colors:
  ink: '#082b3b'
  muted: '#3e5f73'
  blue: '#397da5'
  lime: '#c0f86c'
  line: '#bdd1da'
  focus: '#075c70'
  reading-surface: '#f6fafc'
  white: '#fff'
  action-ink: '#123608'
  action-top: '#d3ff8e'
  action-bottom: '#baf65b'
  action-top-hover: '#dfffaf'
  action-bottom-hover: '#c6fa79'
  glass-button: '#f0faffd9'
  glass-fallback: '#e4f3f6'
  dialog-surface: '#eef8fb'
  dialog-hover: '#e3f6cf'
  close-surface: '#d8eaf1'
  close-hover: '#c7e1ea'
  dark-ink: '#e2f1f8'
  dark-muted: '#a7c1d0'
  dark-blue: '#86caf1'
  dark-reading-surface: '#0b1e2a'
  dark-dialog-surface: '#102b3b'
  dark-focus: '#b5ef8b'
  workbench-surface: 'light-dark(#ffffff, #102b3b)'
  workbench-surface-soft: 'light-dark(#edf5f8, #153646)'
  workbench-line: 'light-dark(#cbdce4, #355363)'
  workbench-series-a: 'light-dark(#176b91, #8bd6ff)'
  workbench-series-b: 'light-dark(#416b35, #c0e99b)'
  workbench-selection: 'light-dark(#e8f7d7, #294a38)'
  workbench-selection-ink: 'light-dark(#254d25, #dbf6c4)'
  workbench-warning: 'light-dark(#714d13, #f4d79b)'
  workbench-warning-surface: 'light-dark(#fff6e6, #382d1b)'
typography:
  display:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: 'clamp(64px, 5.86vw, 90px)'
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: 'clamp(40px, 4.7vw, 70px)'
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: '-0.04em'
  body:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.65
  title:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '21px'
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: '-0.025em'
  label:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '18px'
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: '-0.025em'
  navigation:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '15px'
  button:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '18px'
    lineHeight: 1.3
  workbench-heading:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '40px'
    fontWeight: 450
    lineHeight: 1.12
    letterSpacing: '-0.035em'
  workbench-section:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '23px'
    fontWeight: 450
    lineHeight: 1.2
    letterSpacing: '-0.035em'
  workbench-measurement:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '30px'
    fontWeight: 450
    lineHeight: 1.1
    letterSpacing: '-0.025em'
  workbench-body:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.5
  workbench-label:
    fontFamily: 'Inter, Arial, sans-serif'
    fontSize: '12px'
    fontWeight: 400
    lineHeight: 1.5
rounded:
  keycap: '4px'
  small-control: '8px'
  workbench-panel: '12px'
  workbench-selector: '16px'
  dialog-row: '14px'
  command-row: '24px'
  experiment: '28px'
  glass-mobile: '30px'
  glass: '38px'
  pill: '999px'
  circle: '50%'
spacing:
  row-gap: '6px'
  workbench-plot-gap: '16px'
  workbench-panel-padding: '20px'
  control-gap: '14px'
  command-gap: '20px'
  action-margin: '32px'
  section-mobile: '54px'
  workbench-margin: '64px'
  grid-gap: '70px'
  section: '80px'
components:
  button-primary:
    textColor: '{colors.action-ink}'
    typography: '{typography.button}'
    rounded: '{rounded.pill}'
    padding: '17px 30px'
  button-glass:
    backgroundColor: '{colors.glass-button}'
    textColor: '{colors.ink}'
    typography: '{typography.button}'
    rounded: '{rounded.pill}'
    padding: '17px 30px'
  button-glass-hover:
    backgroundColor: '{colors.white}'
  navigation:
    textColor: '{colors.ink}'
    typography: '{typography.navigation}'
  glass-panel:
    backgroundColor: '{colors.glass-fallback}'
    textColor: '{colors.ink}'
    rounded: '{rounded.glass}'
    padding: '52px 24px 30px'
  glass-command:
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.command-row}'
    padding: '17px 18px'
  experiment-card:
    textColor: '{colors.ink}'
    rounded: '{rounded.experiment}'
    padding: '46px 30px'
  command-dialog:
    backgroundColor: '{colors.dialog-surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.command-row}'
    padding: '26px'
    width: 'min(520px, calc(100% - 32px))'
  dialog-command:
    backgroundColor: '#fff8'
    textColor: '{colors.ink}'
    rounded: '{rounded.dialog-row}'
    padding: '18px 16px'
  dialog-command-hover:
    backgroundColor: '{colors.dialog-hover}'
  close-button:
    backgroundColor: '{colors.close-surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.circle}'
    width: '40px'
    height: '40px'
  close-button-hover:
    backgroundColor: '{colors.close-hover}'
  workbench-selector:
    rounded: '{rounded.workbench-selector}'
    padding: '22px 24px'
  workbench-select:
    backgroundColor: '{colors.workbench-surface}'
    rounded: '{rounded.small-control}'
    padding: '10px 38px 10px 13px'
  workbench-button:
    backgroundColor: '{colors.workbench-surface}'
    rounded: '{rounded.small-control}'
    padding: '9px 13px'
  workbench-button-hover:
    backgroundColor: '{colors.workbench-surface-soft}'
  workbench-sector:
    backgroundColor: '{colors.workbench-surface}'
    padding: '16px 20px'
  workbench-sector-selected:
    backgroundColor: '{colors.workbench-selection}'
    textColor: '{colors.workbench-selection-ink}'
  workbench-plot:
    backgroundColor: '{colors.workbench-surface}'
    height: '108px'
  workbench-inspector:
    backgroundColor: '{colors.workbench-surface-soft}'
    rounded: '{rounded.workbench-panel}'
    padding: '{spacing.workbench-panel-padding}'
  workbench-table:
    typography: '{typography.workbench-label}'
    padding: '12px 14px'
---

# Design System: Clear Air

## Overview

**Creative North Star: "Clear Air"**

Clear Air brings an optimistic sky atmosphere to a light reading canvas. Large, lightly weighted Inter headings and selective italic emphasis give the composition its expressive voice; supporting text stays calm and direct.

The appearance follows the device preference until a visitor uses the header's sun/moon button. That choice persists locally when browser storage is available, and an early head script applies it before hydration. CSS uses `light-dark()` for coordinated surface, text, border and material colors; the device preference also works without JavaScript. Dark mode uses deep blue reading surfaces, pale blue type, dimmed scenery and tinted glass, retaining lime actions. An explicit light choice declares `color-scheme: only light` to prevent browser automatic darkening; dark declares `color-scheme: dark`.

Original scenic artwork forms a separate background layer. Semantic text and controls sit above it, while translucent CSS surfaces pick up light through blur, highlights and soft reflections. Beyond the scenic introduction, quieter editorial sections use spacing and fine rules to establish hierarchy.

The lap workbench in `design/lap-workbench.html` applies this identity at a denser product scale: compact Inter headings, aligned measurements and opaque plotting surfaces, with a single frosted selection bar. It is a high-fidelity interactive design prototype, separate from the production application. Its embedded historical sample and deliberately simulated loading, provider-failure and partial-data states demonstrate visual behavior; they do not implement production routing, live API requests or network/cache resilience.

**Key Characteristics:**

- Original scenic imagery with a pale reading surface.
- Inter in normal and italic voices, with generous display scale.
- Live CSS glass, soft inset highlights and rounded controls.
- Lime actions, blue emphasis and dark blue ink.
- Visible keyboard focus and reduced-motion alternatives.
- Compact comparison controls with solid/dashed series and tabular measurements.

## Colors

Cool blue ink and pale sky surfaces support a small, luminous lime action palette. The frontmatter carries the canonical values extracted from the stylesheet. Sidecar tonal ramps are synthesized dark-to-light exploration strips, rather than additional stylesheet palette tokens.

### Primary

- **Luminous Lime** (`lime`): selection color and the action palette's central accent. Primary buttons use the actual `action-top` / `action-bottom` gradient stops, rather than a flat lime fill; hover uses their sibling hover tokens.
- **Deep Green Action Ink** (`action-ink`): text on luminous primary actions.
- **Sky Blue** (`blue`): large heading emphasis in the reading sections. The introduction's italic emphasis has its own observed local shade, carried in the stylesheet rather than promoted into a second shared accent.

### Neutral

- **Deep Blue Ink** (`ink`): headings, ordinary text and control content.
- **Muted Blue Ink** (`muted`): explanatory paragraphs and secondary reading text.
- **Clear Reading Surface** (`reading-surface`): the page canvas and the endpoint of the scenic wash. This is the current surface, superseding the provisional document's earlier value.
- **Pale Blue Rule** (`line`): separation between the quieter sections and footer.
- **White Light** (`white`): inset highlights and the secondary action's hover surface.
- **Glass Veil** (`glass-button`) and **Solid Glass Fallback** (`glass-fallback`): the translucent secondary button and the panel's no-filter fallback, respectively.
- **Dialog Mist** (`dialog-surface`), **Command Highlight** (`dialog-hover`), and the close-control surface pair: localized dialog surfaces and interactive states.
- **Deep Teal Focus** (`focus`): visible keyboard outlines across controls.

### Workbench-local roles

The `workbench-*` colors extend this surface only; they preserve the homepage palette and its original rule token. Each `light-dark()` entry stores the actual light and dark appearance in that order. Opaque `workbench-surface` grounds the plots, native selects and sector group; `workbench-surface-soft` distinguishes inspector and quiet hover states. `workbench-line` supplies the tool's local separators.

- **Reference Blue** (`workbench-series-a`) and **Comparison Green** (`workbench-series-b`): source-role colors, paired with solid and dashed strokes throughout legends, plots and readings. Swapping drivers changes their role assignments; these are not team colors. Forced-colors mode replaces both strokes with CanvasText while retaining their dash distinction.
- **Selected Mint** (`workbench-selection`) and **Selected Green Ink** (`workbench-selection-ink`): pressed sectors and their text. Selecting a sector zooms the plots to its estimated-progress range.
- **Amber Notice Ink** (`workbench-warning`) and **Amber Notice Ground** (`workbench-warning-surface`): the prototype's simulated loading, failure and missing-data notices. Readable explanatory text carries the state alongside color.

**The Series Identity Rule.** Carry source role through a named legend, solid/dashed marks and aligned readings; color alone must not identify a trace.

## Typography

**Display and Body Font:** self-hosted Inter Variable, with Arial and sans-serif fallbacks. Normal and italic faces both cover weights 100–900; the interface uses a restrained subset of that range.

**Character:** open, contemporary and readable. Large headings use regular weight with close tracking; italic words add expression without introducing another family. Body copy uses normal tracking.

### Hierarchy

- **Display** (`display`): introduction heading. Its desktop clamp and tight leading are in the frontmatter. At the intermediate breakpoint it uses `clamp(60px, 6.2vw, 77px)`; at the stacked breakpoint it uses `clamp(46px, 8.4vw, 65px)` with leading (1.06); the narrowest layout fixes it at (46px).
- **Headline** (`headline`): major section headings. Reading-section overrides range from (52px) to (64px) on desktop. The stacked layout uses `clamp(39px, 6.8vw, 56px)` where no section override applies.
- **Title** (`title`): editorial article headings. Experiment and explanatory titles are larger (25–26px), retaining the shared heading weight (550) and tracking.
- **Body** (`body`): explanatory copy. Supporting sections vary from (15px) to (18px); the introductory paragraph uses (22px), leading (1.4), and a maximum width (660px) on desktop.
- **Label** (`label`): glass command titles. Their secondary descriptions use (12px) with leading (1.4); responsive overrides adapt both sizes to the panel.
- **Navigation** (`navigation`): simple section links, reducing to (14px) in the stacked layout.

### Workbench density

The tool uses the same self-hosted Inter normal and italic faces. `workbench-heading` is its compact page title, with blue italic emphasis; it reduces to (34px) at 800px and (30px) at 480px. Section headings use `workbench-section`; telemetry headings use (20px), while narrow section headings use (21px). Body text uses `workbench-body`, with introductory copy reducing to (14px) at 480px. Most labels, notes and table text use `workbench-label`; select text is (14px), weight (400), and field labels are (12px), weight (550).

Lap totals use `workbench-measurement`, reducing to (27px) at 800px and (24px) at 480px. Sector differences use (23px), reducing to (18px) at 480px. Measurements, axes and tables use tabular numerals. Mobile sector winners and paired timing labels are (11px); general notes and axis labels remain (12px). Keep this density local to the workbench rather than shrinking the homepage's editorial typography.

## Layout

The centered content container has a maximum width (1296px). Its width is the viewport minus (96px), then minus (80px) at 1250px, minus (48px) at 800px, and minus (40px) at 420px. These yield side gutters of 48px, 40px, 24px and 20px, respectively. Sections generally use vertical padding (80px), reducing to (54px) at the stacked breakpoint.

The desktop header is a three-part grid with centered section links. The scenic introduction layers its copy and a tilted command panel independently; the panel is (450px) wide before responsive reductions. Reading sections use paired columns, a three-column article grid, generous gaps and fine horizontal separation. The two main paired layouts use proportions (1.35fr / 1fr) and (1.15fr / 1fr), with a desktop gap (70px).

The responsive thresholds are 1600px, 1250px, 1050px, 800px and 420px. The 1050px adjustments apply only down to 801px. At 800px and below, the panel moves into flow beneath the introduction, the reading grids stack, and the contact section becomes a block. Section navigation remains visible. The dialog is capped to the viewport width and dynamic height and scrolls internally when needed.

### Workbench layout

The tool's centered container is capped at (1248px), with desktop side gutters (48px), reducing to (32px) at 1100px, (24px) at 800px and (20px) at 480px. Its compact scenic masthead has an (84px) header, then the selector bar overlaps the bottom by (38px). The desktop selector grid uses (1.4fr / 1fr / 1fr / 44px), gaps (20px) and padding (22px 24px). The timing comparison remains two equal columns with a desktop gap (48px). Three joined sector controls precede the analysis area.

The desktop analysis pairs a flexible plot column with a (280px) inspector, separated by (34px); at 1100px the inspector becomes (250px) with gap (24px). At 800px it stacks, with readings immediately after the cursor and alignment note. The session select spans the first row, with two driver fields and swap below. At 480px the driver fields stack beside a shared swap button, while timing totals remain in two columns and all three sectors remain visible. Inspector actions, notices and table pagination wrap. Header source links hide at this width, while return and appearance controls remain available. The compact source note hides at 1100px; the comparison disclosure and footer retain source context.

Plots use heights (108px / 74px / 44px) for speed, throttle and brake; at 800px these become (132px / 92px / 50px). Gaps between plots are (16px). The raw-data table owns a horizontal scroll region rather than widening the page. The inspector uses (20px) padding, (20px 22px) when stacked and (18px) on narrow screens. These tool thresholds supplement the homepage thresholds above.

## Elevation & Depth

Depth combines translucent materials, inset white highlights, soft ambient shadows and a lightly tilted command surface. This treatment belongs to the scenic controls and experiment, while the reading sections rely on spacing and rules. The panel starts with a solid pale fallback; where backdrop filtering is supported, it uses a translucent gradient and blur (11px) with saturation (1.1). The secondary button uses blur (12px), and the dialog backdrop uses blur (7px).

### Shadow Vocabulary

- **Primary Action:** inset highlight, fine green rim and diffuse lime lift; the hover state changes both gradient and shadow.
- **Glass Panel:** ambient blue lift plus multiple inset highlights and a lower blue rim. A separate inset outline and gradient sheen create the material's edges.
- **Experiment:** a soft inset highlight and faint blue ambient shadow.
- **Dialog:** a broad, darker shadow over a translucent blue backdrop.

Exact shadow stacks, gradients and motion values live in the sidecar, where the token schema can represent them without changing their CSS meaning.

**The Live Glass Rule.** Keep scenery separate from semantic text and controls; build the glass from CSS surfaces, highlights and backdrop filtering.

**The Still Content Rule.** Keep content visible before animation runs; reduced-motion preferences disable the light sweep, transitions and smooth scrolling.

The light sweep runs once (2.2s), using `cubic-bezier(0.16, 1, 0.3, 1)`. Button background and shadow transitions take (0.2s) with `ease`. Forced-colors mode hides the scenery and sheen and adds system-color boundaries to key controls.

### Workbench material

Only the selection bar is frosted. It begins with an opaque light/dark fallback and a small ambient shadow with an inset highlight; backdrop support adds a translucent sky-to-mint gradient with blur (12px). Charts, sector controls, selects and the inspector keep opaque reading surfaces. The existing scenery is reused in the masthead at opacity (0.4) in light and (0.18) in dark; there is no panel tilt or entrance sweep on this tool. Button state transitions take (160ms) with `ease`; reduced-motion disables transitions and smooth scrolling. Forced colors removes scenic layers and adds system-color boundaries to the selector, inspector, notice and icon buttons.

**The Opaque Plot Rule.** Keep plot grounds opaque and reserve the workbench's frosted material for the selection bar.

## Shapes

The form language is rounded and softly framed: pill actions, circular icon controls, rounded command rows and a generous glass shell. The rounded tokens distinguish these roles rather than applying a single radius everywhere. The glass shell changes from its desktop radius to the smaller mobile radius when the layout stacks. Fine borders and inset rims keep pale surfaces legible without heavy outlines. Small keyboard hints use compact rectangular keycaps.

The workbench uses compact, softly squared controls: native selects and text buttons retain the small-control radius; the selector shell uses `workbench-selector`, and the joined sectors and inspector use `workbench-panel`. Sector dividers share the group's border; plots use simple horizontal rules with no elevated card wrapper. This is a local density adaptation of Clear Air's form language.

## Components

### Buttons

Primary actions are luminous pills with dark green text, a vertical lime gradient, a white inset highlight and a thin green rim. Their desktop padding, typography and radius are tokenized; minimum height is (58px). The experiment's launcher is a smaller variant with padding (14px 22px), text (16px) and minimum height (50px).

The secondary action is a pale translucent pill with blur, an inset highlight and a quiet blue boundary; hover becomes white. Shared buttons reduce to minimum height (52px) in the stacked layout. All keyboard-focusable controls receive a teal outline (3px) with offset (5px), unless a component supplies its documented local offset. Disabled buttons use opacity (0.65).

### Cards / Containers

The experiment container uses a pale three-stop sky-to-mint gradient, rounded corners, an inset highlight and a faint ambient shadow. It centers its icon, title and action with desktop padding (46px 30px), becoming more compact on mobile. The surrounding reading articles remain open on the page canvas.

### Navigation

The header navigation is an always-visible horizontal row linking to Lab, Notes, About and Contact, alongside a 44px appearance button. Default links omit underlines; hover restores an underline and focus uses the shared outline. Spacing reduces from (34px) to (24px). At 420px and below, navigation moves to its own row below the wordmark and appearance control, retaining 14px text and 44px link targets.

### Glass Command Surface

The signature surface contains three real section links with inline line icons, stacked title and description, and small return-key cues. Rows have rounded corners and generous touch area, with a softly highlighted first row. Hover adds a pale tint; the focus outline uses a tighter offset (1px). A framed rim and one-time light sweep belong to the shell, while the links remain separate semantic controls. The desktop tilt is `perspective(1200px) rotateY(-7deg) rotateZ(-2deg)`, softened to a Y rotation of (-5deg) when stacked.

### Command Dialog

A native dialog presents a solid pale panel, rounded command links, circular close control, and compact key hints. Rows use a translucent white rest surface and a pale green hover/focus surface. The panel width, padding and shape are tokenized; maximum height is the dynamic viewport minus (48px). Its backdrop tints and blurs the page beneath it.

Arrow keys, Home and End move between command links. Tab cycles through the dialog controls. Dismissal returns focus to the opener; selecting Notes or Contact moves focus to its heading. The Source action follows an ordinary GitHub link. Reduced-motion preferences also affect section navigation scroll. Link titles and descriptions have separate accessible associations and explicit word boundaries. Sidecar snippets illustrate the visual states; runtime keyboard and modal behavior remains in the Vue implementation.

### Workbench Selectors and Actions

The frosted selector bar contains explicitly labeled native session and driver selects, an authored inline SVG chevron and a (44px) swap button. Main selects have minimum height (46px), an opaque surface and a fine local rule; hover shifts the border to blue. Text actions use a minimum height (44px), text (13px), weight (500), a small-control radius and quiet soft-surface hover. Disabled pagination actions use opacity (0.55) and a default cursor. The appearance control retains a circular (44px) target and an accessible label naming its next appearance.

The prototype shares visible keyboard outlines (3px) in the appearance-aware focus color, offset (4px); sector focus moves the outline inside by (4px) to stay visible within the clipped group. A skip link appears on focus. State changes are announced through a polite status region. This local focus offset supplements the homepage's offset rather than replacing it.

### Workbench Sectors and Traces

The three joined sector buttons show a sector name, difference, winner and both reported times. Hover uses the soft surface; `aria-pressed` adds the selected ground, selected ink and visible check mark. Accessible names include both times and the winner. Selecting a sector focuses the trace range; a separate action returns to the full lap.

Speed, throttle and binary brake share a linked estimated-progress cursor. Reference traces use a solid stroke (2px); comparison traces use the same width with a dash pattern (6 / 4). Grid lines and the cursor use (1px) strokes, with the cursor dashed (3 / 4). A native range input, minimum height (38px), offers the keyboard path and exposes progress as accessible value text. Readings use the nearest recorded sample. The plotted SVGs are hidden from assistive technology; the range, readings and table provide semantic alternatives. The alignment note distinguishes estimated progress from reported timing and brake on/off from pressure.

### Workbench Readings and Data Table

The soft, opaque inspector aligns named drivers above right-aligned tabular measurements; row labels remain muted and left aligned. It provides the data-table disclosure and preview-link copy action, with status feedback for copy success or failure. The table opens inline, moves focus to its heading, exposes its expanded state and returns focus to the opener on close. It displays the recorded samples in groups of (20), with fine horizontal rules, muted headers and horizontal overflow contained in a keyboard-focusable region. Table headers and cells use padding (12px 14px), with no left padding in the first column. The comparison-details disclosure preserves source and interpretation context.

### Workbench Preview States

The review toolbar explicitly labels the design preview and lets reviewers simulate loading, provider failure and missing telemetry. Amber notices retain the visible timing evidence and recorded comparison. The failure state offers Retry; in this prototype it restores the ready state locally. Partial telemetry removes comparison-series samples around estimated progress (47–57%), leaves a visible gap and returns “Missing” readings rather than substituted values; its table omits those samples. These are implemented presentation states with embedded data, not completed provider networking. Browser/axe checks reported in the finish review cover both appearances and narrow layouts; no manual screen-reader, physical-device or production-resilience certification is implied.

## Do's and Don'ts

### Do:

- **Do** preserve the original scenic background as a separate responsive image layer.
- **Do** use the pale reading surface for the quieter sections and fine rules for separation.
- **Do** keep Inter normal and italic, with blue emphasis and dark ink carrying the heading hierarchy.
- **Do** pair glass transparency with its solid fallback and preserve visible focus treatments.
- **Do** retain the homepage's single light sweep and honor reduced-motion and forced-colors preferences.
- **Do** preserve solid/dashed series identity, tabular measurements and visible missing-data states in the workbench.
- **Do** keep the workbench's recorded data and simulated provider states clearly labeled as a design prototype.

### Don't:

- **Don't** bake text, controls or glass panels into the background artwork.
- **Don't** make content visibility depend on an entrance animation.
- **Don't** replace the editorial lower sections with repeated elevated cards.
- **Don't** hide the homepage section navigation when the layout stacks.
- **Don't** extend workbench frosting to plots or replace missing samples with fabricated readings.
