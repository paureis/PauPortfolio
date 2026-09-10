# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and technical recruiters filling AI engineer, agentic systems, cloud, DevOps, and software engineering roles. They arrive from a "personal website" field on an application, a LinkedIn profile, or a GitHub profile. They give the link about thirty seconds, often on a phone over cellular, sometimes on a laptop between meetings. Their job is to decide whether Pau is worth a conversation.

Secondary: networking contacts in the Miami tech scene and anyone curious after seeing his GitHub or LinkedIn.

Pau himself is the maintainer. He updates a project, adds a credential, or changes a line of copy without touching component code.

## Product Purpose

A single-page portfolio for Alvaro "Pau" Reis, an AI engineer in Miramar, Florida. It exists because applications keep asking for a personal website and a resume cannot show how he works, what he is like, or that he can build something that looks finished. The one job: make a hiring manager want to talk to him within the thirty seconds they give the link, on whatever device they open it on.

Success looks like:

- A recruiter on a phone can read the positioning, see the headline project, and download the resume within thirty seconds without discovering anything.
- A hiring manager on a laptop remembers the monitor switch a day later.
- Nobody says "this looks AI-generated."
- The URL goes in every application's personal-website field without a second thought.

## Positioning

Hero line, working version: "AI engineer. I build agentic systems that ship to production, usually from this desk." Supporting line: "Sole engineer on a multi-tenant recruiting platform used by two healthcare organizations."

The claim a neighboring portfolio cannot truthfully copy: the site is a stylized 3D recreation of Pau's real desk, and it was built in public by two coding agents (Claude Code and OpenAI Codex) working in parallel under the same agentic lifecycle the site describes. The repository, commits, and cross-lane PR reviews are the proof. The site is its own evidence.

## Operating Context

Visitors read the page top to bottom as a sequence of six stations: wide desk view (hero), main monitor (selected work), side monitor (how I work, GitHub activity), wall (credentials), desk end (off the clock), window (contact). Scrolling is always the complete path; tab, click, and keyboard are shortcuts. The page underneath is a normal HTML document and is the whole site for anyone without WebGL, with reduced motion, or using a screen reader.

The 3D layer earns attention. It never carries information on its own.

Maintenance happens in the repository: all copy lives in one typed content source with build-time validation. GitHub activity refreshes nightly by a scheduled workflow. Deploys go to Azure Static Web Apps on push to main; every pull request gets a preview URL where the other agent reviews.

## Capabilities and Constraints

- Next.js static export, TypeScript, React Three Fiber, GSAP with ScrollTrigger, Lenis, plain CSS with custom properties. No backend, no database, no CMS, no contact form.
- Performance budgets: scene GLB under 4 MB compressed, textures under 6 MB across tiers, total JavaScript under 500 KB gzipped, first contentful paint under 1.5 s and largest contentful paint under 2.5 s on simulated 4G measured on the fallback content, no layout shift when the scene fades in. Lighthouse mobile performance at or above 85 and desktop at or above 95 with the scene loaded.
- Works in current Chrome, Safari, Firefox, and Edge on desktop and mobile.
- Content rules that reject a change regardless of quality: Talent Scout Pro is described at resume level only (outcomes and engineering decisions; no product name beyond "Talent Scout Pro," domain, screenshots, schema, prompt or evaluation design, pricing, or client names beyond "two healthcare organizations"). Talent Scout Pro and Forward Thinkers Consulting are separate entries. No phone number anywhere on the site. AZ-104 shows as "in progress" until Pau flips it, and no credential is marked earned without an earned date and a verification link. Every credential links to its verification page.
- Screen contents in the scene are the site's own content, never captures of real apps. Collectible figures are generic shapes; no licensed characters or third-party logos.
- No loader, splash screen, or "click to enter." HTML renders first; the scene fades in when ready.
- No light/dark toggle. The room has one time of day, around 7pm.
- No cookie banner; no tracking beyond privacy-friendly page counts.
- English only. Pau is fluent in English and Spanish, and the site says so, but there is no Spanish version.
- Contact is email, LinkedIn, GitHub, and a resume PDF download.
- Undecided: the custom domain. alvaroreis.dev is preferred, with paureis.dev and alpaureis.com as fallbacks, pending availability.
- Undecided: the exact tail of the hero line after "production." It stays playful and can change.

## Brand Commitments

- The site leads with "Alvaro Reis," matching the resume and certifications. "Pau" is the nickname and appears in the voice and playful lines. GitHub handle is paureis.
- Voice: first person, sentence case, plain verbs, written like a person. No marketing voice, no eyebrows, no all-caps labels, no numbered markers except on the lifecycle and the timeline, which are actual sequences.
- The real room is the reference: Pau's desk in Miramar at dusk, with a South Florida sunset through the window. Miami Vice is a place, not a theme. Nothing that reads as neon type, chrome, palm silhouettes, or retro grids.
- The site states that it was built with Claude Code and Codex in parallel, and the public repository backs that up.

## Evidence on Hand

- A current resume PDF exists and will be added to the repository when the contact section is built (Issue 2). It carries the phone number so the site does not have to.
- Verification URLs for every credential are known to Pau and will be supplied when the credentials content is written. Credentials: AWS Solutions Architect Associate, Azure AI Engineer Associate, Claude Certified Architect Professional (headline tier), plus fundamentals, with AZ-104 in progress (retake scheduled September 14, 2026). Education: UCF B.S. Information Technology 2025; Georgia Tech OMSCS starting Spring 2027.
- Work facts from the resume: Talent Scout Pro (sourcing time from 12 hours to under 8 minutes, two healthcare tenants, zero client-reported errors since launch; event-driven pipeline on Azure Functions and Storage Queues, Redis-based distributed rate limiting, tenant isolation, sub-two-minute deploys). Forward Thinkers Consulting (production deployment for healthcare clients, US data residency, Entra ID SSO, environment provisioning and cost). NEO Consulting Group internship (address-matching microservice, deterministic scoring with LLM fallback, 40% fewer external calls, latency from 800 to 450 ms). Cyberse, his web studio, links to cyberse.us. Experience timeline: Community Care Plan, NEO, Forward Thinkers.
- How I work: a five-phase agentic lifecycle (plan, implement, independent review, verify, close out), a library of 20-plus reusable agent skills, cross-model review across Claude, Codex, and Cursor.
- Off the clock: Counter-Strike at Faceit level 10, soccer, training, South Florida.
- Five reference photos of the real desk live in `reference/`, gitignored. They are the modeling source for the Blender scene and are never published or used to derive textures.
- Not on hand and not to be invented: the curated list of three or four GitHub repositories (pending Pau's choice), testimonials, client names beyond "two healthcare organizations," screenshots of Talent Scout Pro, a headshot.

## Product Principles

1. The document is the site. Every word is real HTML, readable in order with the canvas removed. The 3D layer is a reason to remember it, never the only place something lives.
2. Thirty seconds on a phone is the bar. Name, positioning, headline project, and resume come first and load first.
3. Outcomes before implementation. Every work entry leads with what changed for the people who used it, then the engineering decisions.
4. The site is proof of the process. It is built the way the "how I work" section says, in public, and never claims a credential, a score, or a result that was not actually earned or measured.
5. Written like a person. Pau's voice, not a template's, on every surface including error states and empty states.

## Accessibility & Inclusion

Every station, heading, and control is announced in reading order by screen readers; the 3D layer is invisible to them. The whole page is operable by keyboard with a visible focus indicator on every interactive element. Reduced motion replaces camera flights with crossfades and removes autonomous motion. Without WebGL or on scene load failure, the page shows a still of the wide shot and the complete document. Target: Lighthouse accessibility at or above 95 with WebGL disabled.
