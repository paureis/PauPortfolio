---
name: Alvaro Reis portfolio
description: A stylized recreation of Pau's desk at dusk, with a real document underneath.
colors:
  room-base: "#1f1712"
  room-lift: "#2b1f18"
  text-cream: "#f3e9d8"
  text-dim: "#c9b9a3"
  lamp-amber: "#e8a54b"
typography:
  display:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 2vw + 1.25rem, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  lead:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
spacing:
  sm: "1rem"
  md: "1.5rem"
  lg: "3rem"
---

# Design System: Alvaro Reis portfolio

<!-- Recorded at Issue 1 from the placeholder hero and the visual system pinned in docs/PRD.md. The display face, the sunset and emitter colors, and every component are unresolved until Issue 2 runs the visual-world workshop on the real page and this file is rewritten from the built result. Treat the named rules as binding and the token list as a starting point. -->

## Overview

**Creative North Star: "The Desk at Dusk"**

The site is a room, not a page. Everything on screen is lit the way Pau's desk is lit at seven in the evening in Miramar: a desk lamp and two monitors doing most of the work, the RGB in the keyboard and the PC case adding small points of color, and a South Florida sunset through the window behind the side monitor. The visual system is that light. The dark base is a warm room in low light, never a black canvas. Cream text is what paper and screens look like under a lamp. Amber is the lamp itself, and it is the only accent that reaches every surface. Coral and teal belong to the window and appear only where its light would fall. Blue-white and RGB pink and blue belong to the objects that emit them and nowhere else.

The register is calm and specific. Content reads like a person wrote it, in first person and sentence case, and the type carries hierarchy through size and weight, never through labels, caps, or decoration. One camera move per station change is the site's motion; individual elements do not animate their way in. Miami Vice is a place the room is in, not a style the site wears: no neon type, chrome, palm silhouettes, or retro grids. The sunset through the window is the whole reference.

**Key Characteristics:**
- Warm dark base that reads as a lit room, never pure or tinted black.
- Cream text with one amber accent; every other color is tied to a light source in the scene.
- One display family with personality and one quiet body sans; no italic serif accents, no monospace for labels.
- Hierarchy from size and weight alone; no eyebrows, kickers, all-caps labels, or numbered markers outside true sequences.
- One orchestrated camera move per station; no per-element entrance animation; hover only on interactive things.

## Colors

The palette is a lit room: a warm dark ground, cream light, and the lamp's amber, with the scene's other light sources reserved for the surfaces that emit them.

### Primary
- **Lamp Amber** (#e8a54b): the desk lamp. The single accent that may appear on any surface: the name in the hero, links, focus rings, and the primary action. Its scarcity is what makes it read as light.

### Neutral
- **Room Base** (#1f1712): the page ground. A warm dark brown, not black; it is the room's shadow under lamp light.
- **Room Lift** (#2b1f18): the same room one step brighter, for surfaces that sit above the ground such as a screen bezel region or a raised panel.
- **Cream** (#f3e9d8): primary text and headings. Warm, never pure white.
- **Dim Cream** (#c9b9a3): secondary text and supporting lines. Tinted from cream toward the room, never gray.

### Reserved roles [to be resolved in Issue 2]
Sunset coral and sunset teal for the window and the surfaces its light reaches. Screen blue-white for the monitor faces. RGB pink and RGB blue for the keyboard keys and the case glass. These roles are pinned by the PRD; their values are chosen when the window and the emitters are actually built.

### Named Rules
**The Light Source Rule.** Every color other than the neutrals and amber must be traceable to something in the room that emits it. Coral and teal only where the window's light would reach. Blue-white only on screens. Pink and blue only on the keyboard and the case. If you cannot name the emitter, you cannot use the color.

**The Warm Dark Rule.** The base is #1f1712 and stays warm. No pure black, no cool near-black, no gray standing in for black. Depth comes from lifting toward Room Lift, not from dropping toward black.

## Typography

**Display Font:** [to be resolved in Issue 2]. The PRD pins one display family with personality for headings and names. The placeholder renders the display role in the body stack until that face is chosen through the visual-world workshop; the closest installed font is not the answer.
**Body Font:** Inter (with Segoe UI, system-ui, Helvetica Neue, Arial fallbacks). One quiet sans.

**Character:** One voice with presence for headings and the name, one quiet workhorse for everything else. The pairing should feel like a person's handwriting on a printed page, not a template.

### Hierarchy
- **Display** (600, clamp(1.75rem, 2vw + 1.25rem, 2.75rem), 1.2, -0.01em): the positioning line and station headings. Balanced wrapping.
- **Lead** (400, 1.125rem, 1.5): the supporting line under a heading, set in Dim Cream.
- **Body** (400, 1rem, 1.5): all running text. Measure held to 65 to 75 characters.
- **Name** (600, 1.125rem): the name in the hero, set in Lamp Amber. This is the only place amber carries text at rest.

### Named Rules
**The Two Families Rule.** One display family, one body family, nothing else. No italic serif accents. No monospace for labels, dates, numbers, or anything that is not literally code.

**The No Eyebrow Rule.** Headings carry their own weight. No kicker, eyebrow, all-caps label, or section number above a heading. Numbered markers exist only on the lifecycle and the experience timeline, which are actual sequences.

## Layout

A single column of content, at most 44rem wide (704px), centered, with 1.5rem side padding and 3rem vertical padding. The hero fills one viewport height and centers its content vertically. Vertical rhythm uses three steps: 1rem between related lines, 1.5rem before a note or aside, 3rem between sections. More space sits above a heading than below it.

When the scene is present, content sits left of center on desktop so the desk reads in the right two thirds of the frame; on phones the content stacks in the single column and the scene is a still or absent. Six stations follow in document order: wide, main monitor, side monitor, wall, desk end, window. The document is the layout; the scene frames it.

## Elevation & Depth

No box shadows. Depth is light: a surface closer to the lamp or the screens is a step brighter (Room Lift over Room Base), and the scene itself carries real depth through the camera. Emissive glow from screens, LED strips, and RGB is a property of the 3D scene and is not imitated with CSS halos on the document.

### Named Rules
**The No Halo Rule.** No zero-offset colored glows, no glass or blur as decoration. If something should look lit, it is lit in the scene.

## Shapes

Flat, square-cornered surfaces. Nothing in the placeholder has a radius, and the room's objects are boxes, panels, and cylinders; the document should feel like paper and screens, not pills and cards. Radius, borders, and any recurring silhouette are decided in Issue 2 with the real page.

## Do's and Don'ts

### Do:
- **Do** keep the base at Room Base (#1f1712) and lift, never darken, to show depth.
- **Do** use Lamp Amber (#e8a54b) for the primary action, links, and focus rings, and keep it under a tenth of any screen.
- **Do** write copy in first person, sentence case, plain verbs; the site talks like Pau.
- **Do** give every interactive element a visible focus indicator in Lamp Amber.
- **Do** hold body measure between 65 and 75 characters and balance headings.
- **Do** make one orchestrated camera move per station change and nothing else.

### Don't:
- **Don't** use pure black, cool near-black, or gray in place of the warm neutrals.
- **Don't** put coral, teal, blue-white, or RGB colors on anything that does not emit them in the room.
- **Don't** add eyebrows, kickers, all-caps labels, or numbered section markers outside the lifecycle and timeline.
- **Don't** use italic serif accents or monospace for labels and data.
- **Don't** animate individual elements in on scroll; hover effects only on things that are interactive.
- **Don't** reach for neon type, chrome, palm silhouettes, retro grids, or anything that reads as a Miami Vice theme.
- **Don't** add a loader, splash, or click-to-enter; the document renders first and the scene fades in.
