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
rounded:
  keycap: '4px'
  small-control: '8px'
  dialog-row: '14px'
  command-row: '24px'
  experiment: '28px'
  glass-mobile: '30px'
  glass: '38px'
  pill: '999px'
  circle: '50%'
spacing:
  row-gap: '6px'
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
---

# Design System: Clear Air

## Overview

**Creative North Star: "Clear Air"**

Clear Air brings an optimistic sky atmosphere to a light reading canvas. Large, lightly weighted Inter headings and selective italic emphasis give the composition its expressive voice; supporting text stays calm and direct.

The appearance follows the device preference until a visitor uses the header's sun/moon button. That choice persists locally when browser storage is available, and an early head script applies it before hydration. CSS uses `light-dark()` for coordinated surface, text, border and material colors; the device preference also works without JavaScript. Dark mode uses deep blue reading surfaces, pale blue type, dimmed scenery and tinted glass, retaining lime actions. An explicit light choice declares `color-scheme: only light` to prevent browser automatic darkening; dark declares `color-scheme: dark`.

Original scenic artwork forms a separate background layer. Semantic text and controls sit above it, while translucent CSS surfaces pick up light through blur, highlights and soft reflections. Beyond the scenic introduction, quieter editorial sections use spacing and fine rules to establish hierarchy.

**Key Characteristics:**

- Original scenic imagery with a pale reading surface.
- Inter in normal and italic voices, with generous display scale.
- Live CSS glass, soft inset highlights and rounded controls.
- Lime actions, blue emphasis and dark blue ink.
- Visible keyboard focus and reduced-motion alternatives.

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

## Layout

The centered content container has a maximum width (1296px). Its width is the viewport minus (96px), then minus (80px) at 1250px, minus (48px) at 800px, and minus (40px) at 420px. These yield side gutters of 48px, 40px, 24px and 20px, respectively. Sections generally use vertical padding (80px), reducing to (54px) at the stacked breakpoint.

The desktop header is a three-part grid with centered section links. The scenic introduction layers its copy and a tilted command panel independently; the panel is (450px) wide before responsive reductions. Reading sections use paired columns, a three-column article grid, generous gaps and fine horizontal separation. The two main paired layouts use proportions (1.35fr / 1fr) and (1.15fr / 1fr), with a desktop gap (70px).

The responsive thresholds are 1600px, 1250px, 1050px, 800px and 420px. The 1050px adjustments apply only down to 801px. At 800px and below, the panel moves into flow beneath the introduction, the reading grids stack, and the contact section becomes a block. Section navigation remains visible. The dialog is capped to the viewport width and dynamic height and scrolls internally when needed.

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

## Shapes

The form language is rounded and softly framed: pill actions, circular icon controls, rounded command rows and a generous glass shell. The rounded tokens distinguish these roles rather than applying a single radius everywhere. The glass shell changes from its desktop radius to the smaller mobile radius when the layout stacks. Fine borders and inset rims keep pale surfaces legible without heavy outlines. Small keyboard hints use compact rectangular keycaps.

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

## Do's and Don'ts

### Do:

- **Do** preserve the original scenic background as a separate responsive image layer.
- **Do** use the pale reading surface for the quieter sections and fine rules for separation.
- **Do** keep Inter normal and italic, with blue emphasis and dark ink carrying the heading hierarchy.
- **Do** pair glass transparency with its solid fallback and preserve visible focus treatments.
- **Do** retain the single light sweep and honor reduced-motion and forced-colors preferences.

### Don't:

- **Don't** bake text, controls or glass panels into the background artwork.
- **Don't** make content visibility depend on an entrance animation.
- **Don't** replace the editorial lower sections with repeated elevated cards.
- **Don't** hide the section navigation when the layout stacks.
