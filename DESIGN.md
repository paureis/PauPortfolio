---
name: Alvaro Reis portfolio
description: A stylized recreation of Pau's desk at dusk, with a real document underneath.
colors:
  lamp-amber: "#e8a54b"
  lamp-amber-bright: "#f2c581"
  room-base: "#1f1712"
  room-lift: "#2b1f18"
  room-rule: "#3d2d24"
  text-cream: "#f3e9d8"
  text-dim: "#c9b9a3"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.5vw + 1.125rem, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.25vw + 1.125rem, 2rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  lead:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  space-1: "1rem"
  space-2: "1.5rem"
  space-3: "3rem"
components:
  action-primary:
    backgroundColor: "{colors.lamp-amber}"
    textColor: "{colors.room-base}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.875rem 1.5rem"
  action-primary-hover:
    backgroundColor: "{colors.lamp-amber-bright}"
  action-secondary:
    textColor: "{colors.text-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.875rem 0"
  link-text:
    textColor: "{colors.text-cream}"
    typography: "{typography.body}"
  station:
    backgroundColor: "{colors.room-base}"
    textColor: "{colors.text-cream}"
    padding: "3rem 0 0"
  sequence-marker:
    textColor: "{colors.text-cream}"
    typography: "{typography.label}"
    width: "2rem"
  credential-row:
    textColor: "{colors.text-cream}"
    padding: "1rem 0"
---

# Design System: Alvaro Reis portfolio

<!-- Rewritten at Issue 2 from the built document page (app/globals.css, app/layout.tsx, components/document/*). Every token below is in the build. The reserved color roles at the end of Colors are the only values still open; they wait for the objects that emit them. -->

## Overview

**Creative North Star: "The Desk at Dusk"**

The site is a room, not a page. Everything on screen is lit the way Pau's desk is lit at seven in the evening in Miramar: a desk lamp and two monitors doing most of the work, the RGB in the keyboard and the PC case adding small points of color, and a South Florida sunset through the window behind the side monitor. The visual system is that light. The dark base is a warm room in low light, never a black canvas. Cream text is what paper and screens look like under a lamp. Amber is the lamp itself, and it is the only accent that reaches every surface. Coral and teal belong to the window and appear only where its light would fall. Blue-white and RGB pink and blue belong to the objects that emit them and nowhere else.

The document is a straight read: one column, six stations top to bottom, the hero a full viewport. It refuses the card grid, the hero-metric strip, the eyebrow, and the numbered section marker. Type carries the hierarchy through two faces and size alone. Bricolage Grotesque at 600 gives the positioning line, station headings, and entry titles a voice with some character; Inter carries everything else without comment. Separation between things is a hairline in the room's own brown, never a box, a fill, or a shadow.

The register is calm and specific. Content reads like a person wrote it, in first person and sentence case. Nothing on the document moves except in response to the reader: a link underline thickens, the one filled action brightens. The camera move per station change is the site's only choreography, and it belongs to the scene. Miami Vice is a place the room is in, not a style the site wears: no neon type, chrome, palm silhouettes, or retro grids. The sunset through the window is the whole reference.

**Key Characteristics:**
- Warm dark base that reads as a lit room, never pure or tinted black.
- Cream text with one amber accent; every other color is tied to a light source in the scene.
- Bricolage Grotesque 600 for the three heading tiers, Inter for everything else; no italic serif accents, no monospace for labels.
- Hierarchy from size and weight alone; no eyebrows, kickers, all-caps labels, or numbered markers outside the lifecycle and the timeline.
- Square corners, hairline rules, no shadows, no cards.
- One orchestrated camera move per station; no per-element entrance animation; hover only on interactive things.

## Colors

The palette is a lit room: a warm dark ground, two steps of the same brown for lift and for rules, cream light, and the lamp's amber, with the scene's other light sources reserved for the surfaces that emit them.

### Primary
- **Lamp Amber** (#e8a54b): the desk lamp. The single accent that may appear on any surface: the name in the hero, every link's underline, the focus ring, text selection, and the fill of the one primary action. Amber carries text at rest in exactly one place, the hero name. Its scarcity is what makes it read as light.
- **Lamp Amber Bright** (#f2c581): the lamp turned up. Used only as the primary action's hover fill. It exists so the hover reads as more light rather than as a different color.

### Neutral
- **Room Base** (#1f1712): the page ground and the scene slot behind it. A warm dark brown, not black; it is the room's shadow under lamp light. Also the text color on the amber action and inside a selection.
- **Room Lift** (#2b1f18): the same room one step brighter, reserved for surfaces that sit above the ground once the scene lands (a bezel region, a raised panel). The document does not use it yet.
- **Room Rule** (#3d2d24): the hairline. The 1px rule between stations and between credential rows, and the scrollbar thumb. It is two steps above the ground because Room Lift on Room Base is near-invisible as a 1px line; a rule that cannot be seen is not a rule.
- **Cream** (#f3e9d8): primary text, headings, sequence numbers, and link text. Warm, never pure white.
- **Dim Cream** (#c9b9a3): supporting text. The lead line under a heading, the role and date line on an entry, credential issuers and statuses, timeline dates, the languages line, the closing line, and list bullets. Tinted from cream toward the room, never gray.

### Reserved roles [to be resolved in Issue 6]
Sunset coral and sunset teal for the window and the surfaces its light reaches. Screen blue-white for the monitor faces. RGB pink and RGB blue for the keyboard keys and the case glass. The document has nothing that emits them, so they have no value yet. They are chosen when the window and the emitters are built, not before.

### Named Rules
**The Light Source Rule.** Every color other than the neutrals and amber must be traceable to something in the room that emits it. Coral and teal only where the window's light would reach. Blue-white only on screens. Pink and blue only on the keyboard and the case. If you cannot name the emitter, you cannot use the color.

**The Warm Dark Rule.** The base is Room Base and stays warm. No pure black, no cool near-black, no gray standing in for black. Depth comes from lifting toward Room Lift and Room Rule, not from dropping toward black.

**The One Amber Text Rule.** Amber is a light on things, not a text color. It fills the primary action, underlines links, rings focus, and colors the hero name. No other text is set in amber at rest.

## Typography

**Display Font:** Bricolage Grotesque, weight 600 only (with Segoe UI, system-ui, sans-serif fallbacks). Self-hosted through next/font in app/layout.tsx and exposed as the display custom property; no font CDN request.
**Body Font:** Inter, weights 400, 500, and 600 (with Segoe UI, system-ui, Helvetica Neue, Arial fallbacks). Self-hosted the same way.

**Character:** One face with some personality for the three heading tiers, one quiet workhorse for everything else. Bricolage's slightly irregular letterforms are the person's handwriting; Inter is the printed page it sits on. Both are tracked slightly tight at heading sizes and left alone at text sizes.

### Hierarchy
- **Display** (Bricolage 600, clamp(1.75rem, 2.5vw + 1.125rem, 3.5rem), 1.15, -0.01em): the positioning line in the hero, the page's one h1. Balanced wrapping, measure capped at 20ch so it breaks into two or three deliberate lines.
- **Headline** (Bricolage 600, clamp(1.5rem, 1.25vw + 1.125rem, 2rem), 1.2, -0.01em): station headings, the h2 at the top of every station. Balanced wrapping, 1.5rem below to the material.
- **Title** (Bricolage 600, 1.25rem, 1.25, -0.005em): entry titles and the sub-lists within a station (work entry h3, "Where I have worked", "Education", "Repositories worth a look") and the name of a headline-tier credential. Steps to 1.375rem from 48rem.
- **Lead** (Inter 400, 1.125rem, 1.5): the supporting line under a heading, set in Dim Cream. Steps to 1.25rem from 48rem. In the hero, measure capped at 34rem.
- **Body** (Inter 400, 1rem, 1.5): all running text and list items, measure capped at 70ch. Steps to 1.125rem from 48rem.
- **Label** (Inter 600, body size, 1.5): the emphasized line inside a list item, in sentence case: the h4 labels inside a work entry ("What changed", "How I built it"), timeline organizations, lifecycle phase names, education degrees, off-the-clock titles, and the names of non-headline credentials. Weight is the whole difference; no size change, no caps, no tracking.
- **Name** (Inter 600, 1.125rem): the name in the hero, set in Lamp Amber. Fixed size at every viewport; it is a signature, not a heading.

The secondary action ("Download resume") is Inter 500, the only use of the medium weight: enough to sit beside the filled action without competing with it.

### Named Rules
**The Two Families Rule.** One display family, one body family, nothing else. Bricolage carries the h1, h2, h3, and headline credential names; Inter carries everything below that. No italic serif accents. No monospace for labels, dates, codes, or anything that is not literally code. A credential's verification code is body text in Dim Cream.

**The No Eyebrow Rule.** Headings carry their own weight. No kicker, eyebrow, all-caps label, or section number above a heading. The h4 labels inside a work entry sit below the title and read as sentences; they are sub-headings, not kickers. Numbered markers exist only on the lifecycle and the experience timeline, which are actual sequences.

## Layout

A single column of content, at most 44rem wide (704px), centered, with 1.5rem side padding and 3rem bottom padding. The hero fills one viewport (100dvh), centers its content vertically, and left-aligns it; its lines sit 1rem apart and the actions 1.5rem below the supporting line. Every paragraph and list item is capped at 70ch with pretty wrapping; headings wrap balanced.

Vertical rhythm uses three steps and nothing between them at the section level:

- 1rem (space-1) between related lines: items in a sequence, credential rows, education entries, the hero's lines, the wrap gap in the contact list.
- 1.5rem (space-2) before an aside and from a heading to its material: below a station heading, below a lead line, above an entry's link line, above the practice notes, above the secondary credential list, the column gap in the off-the-clock grid.
- 3rem (space-3) between sections and between work entries: the top padding of every station, the gap from one station to the next, the gap from one entry to the next, above a title that follows other material, above the closing line.

More space sits above a heading than below it: a station has 3rem above its heading and 1.5rem below; an entry title has 3rem above and 0.25rem to its role line. Inside a component the gaps are smaller and fixed: 0.125rem between the lines of one item, 0.5rem between list bullets, 0.75rem between practice notes and between secondary credential rows.

One breakpoint at 48rem (768px). Above it, body, lead, and title step up one size; the timeline gains a right-aligned date column; a credential row becomes two columns with a 12rem verify column on the right; off the clock becomes a two-column grid. Below it, everything stacks in reading order in the single column.

Six stations follow in document order: wide (hero), main monitor (work), side monitor (how I work), wall (credentials), desk end (off the clock), window (contact). The scene slot is a fixed layer behind the document, currently the room's ground and nothing else. Where the column sits relative to the desk once the scene lands is decided with the scene, not here.

## Elevation & Depth

No box shadows anywhere. Depth is light: a surface closer to the lamp or the screens is a step brighter (Room Lift over Room Base), and the scene itself carries real depth through the camera. On the document today, the only depth cue is the hairline: a 1px Room Rule line where one station or one credential ends and the next begins. Emissive glow from screens, LED strips, and RGB is a property of the 3D scene and is not imitated with CSS halos on the document.

### Named Rules
**The No Halo Rule.** No zero-offset colored glows, no glass or blur as decoration, no drop shadows to lift a surface. If something should look lit, it is lit in the scene.

**The Hairline Rule.** Separation is a 1px line in Room Rule, or it is white space. Never a box, a background fill, a card, or a thicker border.

## Shapes

Flat, square-cornered surfaces. Nothing in the build declares a radius; the primary action, the focus ring, and the selection highlight all have hard corners. The room's objects are boxes, panels, and cylinders, and the document should feel like paper and screens, not pills and cards. Borders exist only as top hairlines on a station and on a credential row. Nothing is clipped, rotated, or masked. The one recurring silhouette is the 2rem number gutter on the two sequences.

## Components

The document has no inputs, no navigation bar, no chips, and no cards. It has actions, links, and a small set of list shapes, all flat.

### Actions
- **Shape:** square corners (0 radius), no border.
- **Primary** ("See the work"): Lamp Amber fill with Room Base text, Inter 600 at body size, padding 0.875rem 1.5rem. It is an anchor styled as a button; text decoration is removed. There is one per page, in the hero.
- **Hover:** the fill brightens to Lamp Amber Bright over 160ms on an ease-out curve (cubic-bezier(0.16, 1, 0.3, 1)). No movement, no shadow.
- **Focus:** the global ring, 2px solid Lamp Amber at 3px offset.
- **Secondary** ("Download resume"): a text link in Inter 500 with 0.875rem vertical padding so it aligns with the primary action beside it. Cream text, amber underline, no fill, no border.

### Text Links
- **Style:** cream text inheriting the surrounding color, 1px amber underline at 0.18em offset. Links look like the text they sit in, with the lamp under them.
- **Hover:** the underline thickens to 2px. No color change and no transition; the change is instant.
- **Focus:** 2px solid Lamp Amber outline at 3px offset, on every focusable element.

### Station
- **Structure:** a section with an h2 station heading in the headline tier, then its material. 3rem top padding; each station after the first also carries a 3rem top margin and a 1px Room Rule top border, so stations read as one column separated by hairlines rather than as blocks.
- **Lead line:** an optional Dim Cream lead paragraph directly under the heading, with 1.5rem below it.

### Work Entry
- **Structure:** an article with an h3 title in the title tier, a Dim Cream role and date line 0.25rem below it, a summary paragraph 1rem below that, then an h4 label "What changed" and a bulleted list of outcomes, an optional h4 label "How I built it" and a bulleted list of decisions, and an optional line of links. Labels are Inter 600 at body size with 1.5rem above and 0.5rem below; list items sit 0.5rem apart with Dim Cream bullets. Entries are 3rem apart. Outcomes always come before decisions.

### Numbered Sequence (timeline and lifecycle)
- **Style:** an ordered list with native markers removed and a CSS counter drawn in a 2rem first column, cream at 600, spanning the item's rows. These are the only numbered markers on the page.
- **Timeline item:** organization in Inter 600, role on the next line, date in Dim Cream. From 48rem the date moves to a right-aligned third column on the baseline.
- **Lifecycle item:** phase name in Inter 600, description in cream on the next line.
- **Rhythm:** items 1rem apart, 0.125rem between the lines of one item.

### Credential Row
- **Style:** a grid row with a 1px Room Rule top border and 1rem vertical padding (0.75rem in the secondary list). Name, issuer in Dim Cream, status in Dim Cream ("Earned", "valid through", or "In progress"), then a "Verify" link with an optional "Code" line in Dim Cream beneath it.
- **Headline tier:** the name is set in the title tier of the display face; the first headline row has no border and no top padding.
- **Secondary tier:** name in Inter 600 at body size, 1.5rem below the headline list.
- **Responsive:** from 48rem, two columns: name, issuer, and status stacked on the left, the verify link in a 12rem column on the right, 1.5rem column gap.

### Off-the-Clock Grid
- **Style:** a list with markers removed; each item is a title in Inter 600 over a detail line, 0.125rem apart. Items 1rem apart in one column; from 48rem, two equal columns with a 1.5rem gap. The languages line follows 1.5rem below in Dim Cream.

### Contact List
- **Style:** four links (email, LinkedIn, GitHub, resume) in a wrapping row, 1rem row gap and 1.5rem column gap, each a plain text link. A Dim Cream closing line sits 3rem below.

### Selection and Scrollbar
- **Selection:** Lamp Amber background with Room Base text.
- **Scrollbar:** Room Rule thumb on a Room Base track, and the color scheme is declared dark so form controls and the scrollbar match the room.

## Do's and Don'ts

### Do:
- **Do** keep the base at Room Base (#1f1712) and lift, never darken, to show depth.
- **Do** use Lamp Amber (#e8a54b) for the primary action, link underlines, focus rings, selection, and the hero name only, and keep it under a tenth of any screen.
- **Do** separate with a 1px Room Rule (#3d2d24) hairline or with white space, never with a fill, a box, or a shadow.
- **Do** set the h1, h2, h3, and headline credential names in Bricolage Grotesque 600, and everything else in Inter.
- **Do** write copy in first person, sentence case, plain verbs; the site talks like Pau.
- **Do** give every interactive element the global focus ring: 2px Lamp Amber at 3px offset.
- **Do** hold body measure at 70ch, balance headings, and use only the three spacing steps between sections.
- **Do** make one orchestrated camera move per station change and nothing else.

### Don't:
- **Don't** use pure black, cool near-black, or gray in place of the warm neutrals.
- **Don't** put coral, teal, blue-white, or RGB colors on anything that does not emit them in the room.
- **Don't** set text in amber at rest anywhere but the hero name.
- **Don't** add eyebrows, kickers, all-caps labels, or numbered section markers outside the lifecycle and timeline.
- **Don't** use italic serif accents or monospace for labels, dates, or codes.
- **Don't** add a radius, a box shadow, a card, a background fill behind content, or a Room Lift hairline (it disappears on Room Base).
- **Don't** animate individual elements in on scroll; hover effects only on things that are interactive.
- **Don't** reach for neon type, chrome, palm silhouettes, retro grids, or anything that reads as a Miami Vice theme.
- **Don't** add a loader, splash, or click-to-enter; the document renders first and the scene fades in.
