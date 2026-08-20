import { Lock, PenTool, Rocket, Sparkles, Palette, TrendingUp, Trophy, Users } from 'lucide-react'

// Placeholder photos standing in for real cover art — same "cycled across
// slots, not curated per-post" approach as LandingPage's own MOCK_IMAGES.
const COVER_IMAGES = [
  '/db5f76c2a132da4d5112cf0a25466f36.jpg',
  '/4bd851154ac889867f6c8d15dcf3b35c.jpg',
  '/protectpassword.png',
  '/workme.webp',
  '/faizur.jpg',
]

// One shared byline rather than a roster — a small product blog with a
// single consistent voice reads more credible than invented headshots for
// every post. faizur.jpg is a real photo already in /public, standing in
// for an author headshot the same way COVER_IMAGES stands in for cover art.
const AUTHOR = { name: 'Ava Kessler', role: 'Content Lead', avatar: '/faizur.jpg' }

// Single source of truth for every post. The blog index (BlogPage) only
// reads slug/title/date/category/image/Icon; the post page (BlogPostPage)
// additionally reads readTime/author/intro/sections. intro is the
// quick-answer paragraph above the table of contents; sections drive both
// the TOC links and the article body, each id doubling as its anchor
// target (scroll-mt-* on the heading handles the sticky-nav offset).
export const BLOG_POSTS = [
  {
    slug: 'anatomy-of-a-portfolio-that-gets-interviews',
    title: 'The Anatomy of a Portfolio That Gets Interviews',
    date: 'Aug 18, 2026',
    readTime: '9 min read',
    category: 'Career',
    image: COVER_IMAGES[0],
    Icon: Trophy,
    author: AUTHOR,
    intro:
      "A portfolio that gets interviews isn't the one with the most projects or the slickest animations — it's the one a recruiter can understand in under a minute. That means a clear role on every project, a handful of numbers that prove impact, and a structure that leads with outcomes instead of tools.",
    sections: [
      {
        id: 'what-recruiters-scan-for-first',
        heading: 'What Recruiters Scan For First',
        paragraphs: [
          "Most portfolios get a skim, not a read. In that skim, recruiters are looking for three things: what you actually did (not your team), what changed because of it, and whether the work matches the role they're hiring for. If those three answers aren't visible without scrolling, the rest of the case study rarely gets read.",
        ],
      },
      {
        id: 'the-case-study-structure-that-works',
        heading: 'The Case Study Structure That Works',
        paragraphs: [
          'A structure that holds up across most portfolios: problem, your specific role, the process (briefly), the decision that mattered most, and the outcome. Everything else — every screen, every iteration — is supporting detail, not the spine of the story.',
        ],
      },
      {
        id: 'proof-over-polish',
        heading: 'Proof Over Polish',
        paragraphs: [
          "Polished mockups get a portfolio noticed; proof is what gets it trusted. A rough before/after screenshot with a real metric next to it does more work than a pixel-perfect frame with no context. If you don't have hard numbers, qualitative proof — a quote from a stakeholder, a usability finding you addressed — still beats none at all.",
        ],
      },
      {
        id: 'common-structural-mistakes',
        heading: 'Common Structural Mistakes',
        paragraphs: [
          "The most common one is leading with the final UI instead of the problem it solved. The second is describing a team effort in the first person without ever clarifying your specific contribution. Both are easy to fix once you notice them — usually just by adding one sentence near the top of the case study.",
        ],
      },
    ],
  },
  {
    slug: 'case-study-needs-metrics-not-just-mockups',
    title: 'Why Your Case Study Needs Metrics, Not Just Mockups',
    date: 'Aug 12, 2026',
    readTime: '7 min read',
    category: 'Case Studies',
    image: COVER_IMAGES[1],
    Icon: TrendingUp,
    author: AUTHOR,
    intro:
      "Mockups show what you built. Metrics show why it mattered. A case study with only the former reads like a gallery; add even one honest number and it starts reading like evidence.",
    sections: [
      {
        id: 'why-mockups-alone-dont-convince',
        heading: "Why Mockups Alone Don't Convince",
        paragraphs: [
          "A beautiful screen answers 'can this person design?' — a question most applicants can already answer yes to. It doesn't answer 'did this work,' which is the question that actually differentiates candidates in a stack of similar-looking portfolios.",
        ],
      },
      {
        id: 'the-metrics-worth-including',
        heading: 'The Metrics Worth Including',
        paragraphs: [
          'Conversion or completion-rate changes, time-on-task, support-ticket volume, adoption of a new flow — anything that shows behavior actually shifted. Business metrics (revenue, retention) count too, even when you were one contributor among several; just be honest about your share of the credit.',
        ],
      },
      {
        id: 'where-to-find-your-own-numbers',
        heading: 'Where to Find Your Own Numbers',
        paragraphs: [
          "If you never saw the analytics, ask the PM or your old manager — most are willing to share a rounded figure for a portfolio, even after you've left. Absent that, a moderated usability test you ran yourself, with a before/after task-success rate, is a legitimate substitute.",
        ],
      },
      {
        id: 'presenting-metrics-without-overselling',
        heading: 'Presenting Metrics Without Overselling',
        paragraphs: [
          'One clearly-labeled stat beats three vague ones. State the baseline, the change, and the timeframe — "task completion rose from 61% to 84% over a 6-week test" reads as credible in a way that "significantly improved usability" never will.',
        ],
      },
    ],
  },
  {
    slug: 'password-protecting-client-work',
    title: 'Password-Protecting Client Work Without Killing the Story',
    date: 'Aug 5, 2026',
    readTime: '6 min read',
    category: 'Privacy',
    image: COVER_IMAGES[2],
    Icon: Lock,
    author: AUTHOR,
    intro:
      "Most NDAs restrict who can see specific screens or client names — not whether the project can exist in your portfolio at all. Password-protecting a case study lets you keep the story public and the sensitive parts gated, instead of leaving your best work out entirely.",
    sections: [
      {
        id: 'why-ndas-dont-mean-hiding-the-work',
        heading: "Why NDAs Don't Mean Hiding the Work",
        paragraphs: [
          "Read the actual clause before assuming a project is off-limits. Most agreements protect confidential business data — roadmaps, real numbers, unreleased features — not the fact that you worked on the product or the design decisions you made along the way.",
        ],
      },
      {
        id: 'what-password-protection-actually-solves',
        heading: 'What Password Protection Actually Solves',
        paragraphs: [
          "It lets a case study appear in your public portfolio — findable, linkable, listed — while the specific screens or metrics a client asked you to keep private sit behind a password you hand out on request. Recruiters see enough to be convinced; the client's confidential details stay gated.",
        ],
      },
      {
        id: 'setting-it-up-without-losing-the-narrative',
        heading: 'Setting It Up Without Losing the Narrative',
        paragraphs: [
          'Keep the problem, your role, and your process in the public portion — that alone carries most of a case study\'s persuasive weight. Gate the parts that are genuinely sensitive: real screens, real data, unreleased branding.',
        ],
      },
      {
        id: 'when-to-share-the-password',
        heading: 'When to Share the Password',
        paragraphs: [
          "Hand it out once there's real interest — after a recruiter reaches out, not to every visitor by default. A short note next to the lock ('password available on request') signals there's more to see without exposing it to anyone who happens to land on the page.",
        ],
      },
    ],
  },
  {
    slug: 'five-portfolio-mistakes',
    title: '5 Portfolio Mistakes That Cost Candidates Interviews',
    date: 'Jul 28, 2026',
    readTime: '8 min read',
    category: 'Career',
    image: COVER_IMAGES[3],
    Icon: Rocket,
    author: AUTHOR,
    intro:
      'None of these mistakes are about talent — they\'re about presentation. Each one is common enough that fixing even two or three of them puts a portfolio ahead of most of the stack a recruiter sees that week.',
    sections: [
      {
        id: 'mistake-1-leading-with-tools-not-outcomes',
        heading: 'Mistake 1: Leading With Tools, Not Outcomes',
        paragraphs: [
          '"Designed in Figma, prototyped in ProtoPie" tells a recruiter nothing about whether the work succeeded. Lead with what changed for the user or the business instead — the tools can go in a footnote, if anywhere.',
        ],
      },
      {
        id: 'mistake-2-no-clear-role',
        heading: 'Mistake 2: No Clear Role',
        paragraphs: [
          '"Our team redesigned the checkout flow" leaves a recruiter guessing what you specifically did. One sentence — "I owned the flow design and ran the usability tests; a teammate handled visual polish" — resolves the ambiguity instantly.',
        ],
      },
      {
        id: 'mistake-3-screenshots-without-context',
        heading: 'Mistake 3: Screenshots Without Context',
        paragraphs: [
          "A grid of screens with no captions asks the viewer to reverse-engineer your thinking. A single line under each one — what it's showing and why it matters — does the work the screenshot alone can't.",
        ],
      },
      {
        id: 'mistake-4-burying-the-best-work',
        heading: 'Mistake 4: Burying the Best Work',
        paragraphs: [
          "If your strongest case study is fourth in the list, most visitors never reach it. Order projects by strength, not chronology — the first one someone opens should be the one you're proudest of.",
        ],
      },
      {
        id: 'mistake-5-no-way-to-reach-you',
        heading: 'Mistake 5: No Way to Reach You',
        paragraphs: [
          "A portfolio that convinces someone and then makes them hunt for a contact link loses momentum right when it matters most. Put your email or a contact button somewhere visible on every page, not just the homepage.",
        ],
      },
    ],
  },
  {
    slug: 'what-hiring-managers-look-for',
    title: 'What Hiring Managers Actually Look For in the First 10 Seconds',
    date: 'Jul 21, 2026',
    readTime: '6 min read',
    category: 'Hiring',
    image: COVER_IMAGES[4],
    Icon: Users,
    author: AUTHOR,
    intro:
      "Ten seconds isn't enough to read a case study — it's enough to decide whether to keep reading. What happens in that window is almost entirely about layout and framing, not the quality of the work itself.",
    sections: [
      {
        id: 'the-first-10-seconds',
        heading: 'The First 10 Seconds',
        paragraphs: [
          "In that window, a hiring manager forms an impression from the hero image, the title, and whatever's visible without scrolling. If that first screen doesn't signal relevance to the role, the rest of the portfolio often goes unread.",
        ],
      },
      {
        id: 'signal-vs-noise',
        heading: 'Signal vs. Noise',
        paragraphs: [
          'Signal is a clear project title, a one-line outcome, a recognizable UI. Noise is decorative animation, unexplained jargon, or a wall of text before any visual. The ratio of signal to noise on the first screen is what decides whether someone keeps scrolling.',
        ],
      },
      {
        id: 'what-makes-someone-stop-scrolling',
        heading: 'What Makes Someone Stop Scrolling',
        paragraphs: [
          'A specific, concrete outcome stops the scroll more reliably than a strong visual alone — "reduced onboarding drop-off by 22%" holds attention in a way "a cleaner onboarding experience" doesn\'t.',
        ],
      },
      {
        id: 'how-to-design-for-a-skim',
        heading: 'How to Design for a Skim',
        paragraphs: [
          "Assume every visitor reads headings and captions before body text, if they read body text at all. Write the headings so that skimming them alone tells the whole story — the paragraphs underneath are for whoever decides to stay longer.",
        ],
      },
    ],
  },
  {
    slug: 'messy-process-into-clear-narrative',
    title: 'Turning a Messy Design Process Into a Clear Narrative',
    date: 'Jul 14, 2026',
    readTime: '7 min read',
    category: 'Process',
    image: COVER_IMAGES[0],
    Icon: PenTool,
    author: AUTHOR,
    intro:
      "Real projects rarely move in a straight line — they loop back, change scope, and hit dead ends. A good case study doesn't hide that; it picks the turning points that matter and leaves the rest out.",
    sections: [
      {
        id: 'process-isnt-the-same-as-story',
        heading: "Process Isn't the Same as Story",
        paragraphs: [
          "Your process log has every version, every meeting, every dead-end sketch. Your case study needs maybe three of those moments — the ones that actually changed the direction of the work. Showing everything drowns the moments that matter.",
        ],
      },
      {
        id: 'picking-the-turning-points',
        heading: 'Picking the Turning Points',
        paragraphs: [
          'Ask what would have gone differently if you\'d made a different call at each stage. If the answer is "not much," it\'s a detail, not a turning point — leave it in your working files, not the case study.',
        ],
      },
      {
        id: 'showing-failure-without-undermining-yourself',
        heading: 'Showing Failure Without Undermining Yourself',
        paragraphs: [
          'A first idea that didn\'t work, shown briefly alongside why it didn\'t and what you learned, reads as judgment — not a weakness. Skip the self-deprecation; state the finding plainly and move to what you did next.',
        ],
      },
      {
        id: 'a-simple-narrative-template',
        heading: 'A Simple Narrative Template',
        paragraphs: [
          "Constraint, attempt, finding, decision, outcome — repeated once or twice for the moments that mattered — holds up as a structure for almost any process, no matter how nonlinear the real work was.",
        ],
      },
    ],
  },
  {
    slug: 'bootcamp-to-offer-timeline',
    title: 'From Bootcamp to Offer: A Realistic Portfolio Timeline',
    date: 'Jul 7, 2026',
    readTime: '8 min read',
    category: 'Career',
    image: COVER_IMAGES[1],
    Icon: Rocket,
    author: AUTHOR,
    intro:
      "A portfolio built in a weekend usually looks like it. This is the timeline that tends to actually produce interviews — spread over about eight weeks, most of it spent on one project done well rather than five done quickly.",
    sections: [
      {
        id: 'weeks-1-2-picking-your-anchor-project',
        heading: 'Weeks 1–2: Picking Your Anchor Project',
        paragraphs: [
          'Pick the one project — bootcamp capstone, freelance work, a self-initiated redesign — with the clearest problem and the most defensible outcome. Everything else in the portfolio supports this project; it doesn\'t need to compete with it.',
        ],
      },
      {
        id: 'weeks-3-6-building-the-case-study',
        heading: 'Weeks 3–6: Building the Case Study',
        paragraphs: [
          "This is where most of the real time goes: writing the narrative, gathering or estimating metrics, and cutting screens down to only the ones that earn their place. Expect several rewrites of the opening paragraph alone.",
        ],
      },
      {
        id: 'weeks-7-8-publishing-and-outreach',
        heading: 'Weeks 7–8: Publishing and Outreach',
        paragraphs: [
          'Publish before it feels finished — it never will. Start reaching out in parallel with polishing; the first few applications double as a test of whether the case study actually lands with a stranger.',
        ],
      },
      {
        id: 'what-realistic-timelines-actually-look-like',
        heading: 'What Realistic Timelines Actually Look Like',
        paragraphs: [
          "Eight weeks to a strong first case study, then roughly two more per month after that if you keep working. It's slower than most guides suggest, and it produces portfolios that hold up under a real interview follow-up question.",
        ],
      },
    ],
  },
  {
    slug: 'ai-job-matching-explained',
    title: 'AI Job Matching: How It Actually Works Under the Hood',
    date: 'Jun 29, 2026',
    readTime: '10 min read',
    category: 'Product',
    image: COVER_IMAGES[2],
    Icon: Sparkles,
    author: AUTHOR,
    intro:
      "Job matching in Designfolio reads your case studies the same way a recruiter would — role, tools, outcomes, seniority signals — and scores openings against that profile rather than against a fixed set of keywords.",
    sections: [
      {
        id: 'what-the-matching-engine-actually-reads',
        heading: 'What the Matching Engine Actually Reads',
        paragraphs: [
          "It parses your published case studies for role language, tools mentioned, the kind of problems you've solved, and the seniority implied by the scope of your work — not just a skills list you filled in once.",
        ],
      },
      {
        id: 'why-keywords-arent-enough',
        heading: "Why Keywords Aren't Enough",
        paragraphs: [
          'A resume matcher built on keywords treats "led a redesign" and "assisted with a redesign" as the same signal. Reading full case studies lets the engine tell the difference — the surrounding narrative usually makes seniority and ownership clear.',
        ],
      },
      {
        id: 'how-matches-get-ranked',
        heading: 'How Matches Get Ranked',
        paragraphs: [
          "Openings are scored on overlap in problem domain, tool familiarity, and seniority fit, then re-ranked by recency — a role posted this week outranks an identical-scoring one from a month ago, since it's more likely still open.",
        ],
      },
      {
        id: 'what-you-can-do-to-improve-your-matches',
        heading: 'What You Can Do to Improve Your Matches',
        paragraphs: [
          "The single biggest lever is publishing more complete case studies — a role and an outcome stated clearly matter far more to the engine than any manual preference toggle.",
        ],
      },
    ],
  },
  {
    slug: 'custom-sections-templates-cant',
    title: "Custom Sections: Telling the Story Templates Can't",
    date: 'Jun 22, 2026',
    readTime: '6 min read',
    category: 'Design',
    image: COVER_IMAGES[3],
    Icon: Palette,
    author: AUTHOR,
    intro:
      "Templates cover the 80% of a portfolio that's the same for everyone — hero, project grid, about. Custom sections are for the 20% that's specific to your story, and they're usually what a recruiter remembers afterward.",
    sections: [
      {
        id: 'where-templates-fall-short',
        heading: 'Where Templates Fall Short',
        paragraphs: [
          'A rigid template can\'t hold a before/after metrics comparison, a process timeline with an unusual number of stages, or a client testimonial pulled directly from Slack. Forcing those into a generic layout usually flattens the exact detail that made them worth including.',
        ],
      },
      {
        id: 'building-a-section-from-scratch',
        heading: 'Building a Section From Scratch',
        paragraphs: [
          "Start from the content, not the layout — decide what needs to be shown (a stat block, a comparison, a quote), then build the smallest section that shows it clearly. Drag-and-drop custom sections exist for exactly this case.",
        ],
      },
      {
        id: 'examples-worth-stealing',
        heading: 'Examples Worth Stealing',
        paragraphs: [
          'A side-by-side before/after slider for a redesign. A horizontal timeline for a multi-month rollout. A single oversized stat for the one number that mattered most. Each solves a specific storytelling problem a generic template doesn\'t anticipate.',
        ],
      },
      {
        id: 'keeping-custom-sections-consistent-with-the-rest',
        heading: 'Keeping Custom Sections Consistent With the Rest',
        paragraphs: [
          "Reuse the same type scale, spacing, and color tokens as the rest of your portfolio, even in a one-off section. Custom should mean 'built for this content,' not 'looks like a different site.'",
        ],
      },
    ],
  },
]
