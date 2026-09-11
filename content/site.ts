// The site's content. Everything a visitor reads lives here, typed by
// content/types.ts and checked by content/validate.ts at build time.
// Update a project, add a credential, or change the tail line here and
// nowhere else; components render from this value only.
//
// Content rules that a change cannot break, from AGENTS.md: Talent Scout
// Pro stays at resume level (outcomes and decisions, no product detail,
// no links); no phone number anywhere; AZ-104 stays in progress until Pau
// flips it; an earned credential always has a date and a verification link.

import type { SiteContent } from "./types";

export const site: SiteContent = {
  profile: {
    name: "Alvaro Reis",
    shortName: "Pau",
    location: "Miramar, Florida",
    positioning: "AI engineer. I build agentic systems that ship to production",
    tail: "usually from this desk",
    supporting:
      "Sole engineer on a multi-tenant recruiting platform used by two healthcare organizations.",
  },

  stations: [
    { id: "wide", title: "Alvaro Reis", anchor: "top" },
    { id: "main-monitor", title: "Selected work", anchor: "work" },
    { id: "side-monitor", title: "How I work", anchor: "how-i-work" },
    { id: "wall", title: "Credentials", anchor: "credentials" },
    { id: "desk-end", title: "Off the clock", anchor: "off-the-clock" },
    { id: "window", title: "Contact", anchor: "contact" },
  ],

  work: [
    {
      id: "talent-scout-pro",
      title: "Talent Scout Pro",
      role: "Founder and sole engineer",
      summary:
        "A multi-tenant recruiting platform I built alone, end to end, and run in production for two healthcare organizations. It finds candidates across several sources and evaluates them against the criteria each employer sets.",
      outcomes: [
        "Sourcing time for a role went from about 12 hours of manual searching to under 8 minutes.",
        "Two healthcare organizations use it in production, each in its own isolated tenant.",
        "Zero client-reported errors since launch.",
      ],
      decisions: [
        "An event-driven pipeline on Azure Functions and Storage Queues, so discovery and evaluation scale independently and a failed step retries on its own.",
        "Redis-based distributed rate limiting across concurrent function instances, so third-party quotas hold under load.",
        "Tenant isolation enforced at the middleware and API layers with role-based access, not left to the interface.",
        "Deploys to production in under two minutes through GitHub Actions, with staging in the path.",
      ],
      visibility: "resume",
    },
    {
      id: "forward-thinkers-consulting",
      title: "Forward Thinkers Consulting",
      role: "Full-stack and AI engineer, contract",
      start: "2026-02",
      summary:
        "Contract engineering for a consulting firm that serves healthcare organizations. I take a recruiting platform into production for their clients and own the Azure environment it runs in.",
      outcomes: [
        "Production deployment for healthcare clients with US data residency, everything in East US 2.",
        "Single sign-on through Microsoft Entra ID, so client staff use the accounts they already have.",
        "The complete Azure environment, production and staging, provisioned from repeatable scripts: App Services, serverless SQL, Key Vault with managed identity, Redis, Container Apps, and monitoring.",
        "Their reporting moved from Pyramid Analytics views and OLAP cubes to Power BI, with self-service analytics for 25 stakeholders.",
      ],
      decisions: [
        "Secrets live in Key Vault and services reach them through managed identity, so there are no connection strings in config.",
        "Serverless Azure SQL in both environments, so staging costs almost nothing while it sits idle.",
        "Structured logging into Application Insights and Log Analytics from the first deploy, so a production problem is diagnosable without a debugger.",
      ],
      visibility: "public",
    },
    {
      id: "neo-consulting-group",
      title: "NEO Consulting Group",
      role: "Software engineering intern",
      start: "2025-06",
      end: "2025-08",
      summary:
        "A ten-week internship where I built and shipped an address-matching microservice that decides whether two addresses are the same place.",
      outcomes: [
        "About 40% fewer external API calls after adding Redis caching.",
        "Average latency down from about 800 ms to 450 ms.",
        "In production in under ten weeks, with zero-downtime deploys to Azure App Service through GitHub Actions.",
      ],
      decisions: [
        "Deterministic scoring first, using Google Address Validation and Geocoding, with an LLM fallback only for low-confidence matches. Most requests never touch the model.",
        "ASP.NET 8 minimal APIs with request validation, structured logging, and one JSON error contract across every endpoint.",
      ],
      visibility: "public",
    },
    {
      id: "cyberse",
      title: "Cyberse",
      role: "Founder",
      summary: "My web studio. I build websites for clients who need one that works and looks finished.",
      outcomes: ["Sites for clients, taken from a first conversation to a live domain, by one person."],
      decisions: [],
      links: [{ label: "cyberse.us", href: "https://cyberse.us" }],
      visibility: "public",
    },
  ],

  // Oldest first, so the strip reads left to right in time.
  timeline: [
    { organization: "Community Care Plan", role: "IT intern", start: "2021-07", end: "2021-08" },
    { organization: "NEO Consulting Group", role: "Software engineering intern", start: "2025-06", end: "2025-08" },
    { organization: "Forward Thinkers Consulting", role: "Full-stack and AI engineer, contract", start: "2026-02" },
  ],

  howIWork: {
    intro:
      "I ship through coding agents, and I hold them to the process I would hold a team to. Every change goes through five phases, and the reviewer starts with no prior context.",
    lifecycle: [
      {
        name: "Plan",
        description:
          "Agree on what the change is, what done looks like, and what it must not touch, before anything is written.",
      },
      {
        name: "Implement",
        description: "Build it in small committed steps, with the plan as the spec.",
      },
      {
        name: "Independent review",
        description:
          "A second agent, or a second model, reviews with no prior context. It sees the diff and the definition of done, not the conversation that produced them.",
      },
      {
        name: "Verify",
        description:
          "Run it. Tests, a build, a real URL. A claim about a test result that was not actually run does not count.",
      },
      {
        name: "Close out",
        description:
          "Merge, record what changed and why, and leave the project in a state a fresh session can pick up.",
      },
    ],
    practice: [
      "A library of more than twenty reusable agent skills I wrote for the work I do repeatedly: reviewing, verifying, deploying, writing up.",
      "Cross-model review. Claude, Codex, and Cursor each review the others' work, which removes the author's blind spots before merge.",
      "This site is built that way. Claude Code builds the web app, Codex builds the 3D scene and the data pipeline, and each reviews the other's pull requests cold. The repository is public so you can check.",
    ],
    // Pau chooses these. Empty until then; the section renders without them.
    repositories: [],
  },

  credentials: [
    {
      id: "aws-solutions-architect-associate",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      tier: "headline",
      status: "earned",
      earnedOn: "2026-02-17",
      expiresOn: "2029-02-17",
      verificationUrl: "https://aws.amazon.com/verification",
      verificationCode: "c9eacdd84ce54a6fb5dae7e7ae6028d1",
    },
    {
      id: "azure-ai-engineer-associate",
      name: "Microsoft Certified: Azure AI Engineer Associate",
      issuer: "Microsoft",
      tier: "headline",
      status: "earned",
      earnedOn: "2026-03-20",
      expiresOn: "2027-03-20",
      verificationUrl:
        "https://learn.microsoft.com/en-us/users/alvaroreis-9077/credentials/certification/azure-ai-engineer",
    },
    {
      id: "claude-certified-architect-professional",
      name: "Claude Certified Architect – Professional",
      issuer: "Anthropic",
      tier: "headline",
      status: "earned",
      earnedOn: "2026-08-12",
      expiresOn: "2027-08-12",
      verificationUrl: "https://www.credly.com/badges/2f174bab-cc89-4f80-994e-9ac45f7b08b7",
    },
    // TODO(Pau): the three Foundations credentials are earned but their
    // Credly links are not in hand yet. They stay out of the site until the
    // links arrive; adding a link and uncommenting is the whole change.
    // Validation rejects an earned credential without verificationUrl, so
    // uncommenting without the link fails the build on purpose.
    // {
    //   id: "claude-certified-architect-foundations",
    //   name: "Claude Certified Architect – Foundations",
    //   issuer: "Anthropic",
    //   tier: "supporting",
    //   status: "earned",
    //   earnedOn: "2026-08-05",
    //   verificationUrl: "",
    // },
    // {
    //   id: "claude-certified-developer-foundations",
    //   name: "Claude Certified Developer – Foundations",
    //   issuer: "Anthropic",
    //   tier: "supporting",
    //   status: "earned",
    //   earnedOn: "2026-08-01",
    //   verificationUrl: "",
    // },
    // {
    //   id: "claude-certified-associate-foundations",
    //   name: "Claude Certified Associate – Foundations",
    //   issuer: "Anthropic",
    //   tier: "supporting",
    //   status: "earned",
    //   earnedOn: "2026-07-29",
    //   verificationUrl: "",
    // },
    {
      id: "azure-administrator-associate",
      name: "Microsoft Certified: Azure Administrator Associate",
      issuer: "Microsoft",
      tier: "supporting",
      status: "in-progress",
    },
    {
      id: "aws-cloud-practitioner",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      tier: "supporting",
      status: "earned",
      earnedOn: "2025-09-19",
      expiresOn: "2029-02-17",
      verificationUrl: "https://aws.amazon.com/verification",
      verificationCode: "91ece9534dbe4841b118cf698f56e2cb",
    },
    {
      id: "comptia-a-plus",
      name: "CompTIA A+",
      issuer: "CompTIA",
      tier: "supporting",
      status: "earned",
      earnedOn: "2025-09-09",
      expiresOn: "2028-09-09",
      verificationUrl: "https://www.certmetrics.com/comptia/public/verification.aspx",
      verificationCode: "S0YK95P54MF1Q3L2",
    },
    {
      id: "azure-fundamentals",
      name: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      tier: "fundamentals",
      status: "earned",
      earnedOn: "2025-02-21",
      verificationUrl:
        "https://learn.microsoft.com/en-us/users/alvaroreis-9077/credentials/certification/azure-fundamentals",
    },
    {
      id: "azure-data-fundamentals",
      name: "Microsoft Certified: Azure Data Fundamentals",
      issuer: "Microsoft",
      tier: "fundamentals",
      status: "earned",
      earnedOn: "2024-08-16",
      verificationUrl:
        "https://learn.microsoft.com/en-us/users/alvaroreis-9077/credentials/certification/azure-data-fundamentals",
    },
    {
      id: "azure-ai-fundamentals",
      name: "Microsoft Certified: Azure AI Fundamentals",
      issuer: "Microsoft",
      tier: "fundamentals",
      status: "earned",
      earnedOn: "2024-02-05",
      verificationUrl:
        "https://learn.microsoft.com/en-us/users/alvaroreis-9077/credentials/certification/azure-ai-fundamentals",
    },
  ],

  education: [
    {
      school: "Georgia Institute of Technology",
      degree: "M.S. Computer Science",
      when: "Coursework begins spring 2027",
      detail: "Admitted to the online program.",
    },
    {
      school: "University of Central Florida",
      degree: "B.S. Information Technology",
      when: "2025",
      detail: "GPA 3.5.",
    },
  ],

  offTheClock: {
    intro: "When the pipeline isn't running, I probably am.",
    items: [
      { title: "Counter-Strike", detail: "Faceit level 10. The pink mouse on the desk is not decorative." },
      { title: "Soccer", detail: "Still the sport I would drop everything for." },
      { title: "Training", detail: "Lifting and running. The foam roller by the couch gets used." },
      {
        title: "South Florida",
        detail: "Miramar, between Miami and Fort Lauderdale. The sunset through the window is the reference for this whole site.",
      },
    ],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Spanish", level: "Fluent" },
    ],
  },

  contact: {
    intro: "Email is the fastest way to reach me. The resume has the phone number.",
    email: "alpau.reis@gmail.com",
    linkedin: "https://www.linkedin.com/in/alpaureis",
    github: "https://github.com/paureis",
    resume: "/Alvaro_Reis_Resume2026.pdf",
    closing: "That's the whole desk. Thanks for reading.",
  },
};

export const { profile } = site;
