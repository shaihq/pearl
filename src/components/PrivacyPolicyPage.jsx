import LandingShell from './landing/LandingShell'

// Plain legal-doc page — no hero treatment, no scroll animation, just a
// left-aligned reading column. max-w-xl matches the top nav's own max-w-xl
// (see LandingShell), so this page's text wraps at the same width the nav
// pill sits at above it, rather than sprawling the frame's full 1400px.
const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'Information we collect falls into one of two categories: "voluntarily provided" information and "automatically collected" information.',
      '"Voluntarily provided" information refers to any information you knowingly and actively provide us when using or participating in any of our services and promotions, such as your name, email address, and portfolio content.',
      '"Automatically collected" information refers to any information automatically sent by your devices in the course of accessing our products and services.',
    ],
  },
  {
    title: '2. Log Data',
    body: [
      "When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your device's Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details about your visit.",
      'Additionally, if you encounter certain errors while using the site, we may automatically collect data about the error and the circumstances surrounding its occurrence.',
    ],
  },
  {
    title: '3. Cookies',
    body: [
      'We use cookies to help improve your experience of our website. This "help" is in the form of enabling basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.',
      'We also use optional cookies to enable additional functionality — remembering your preferences, for instance. This type of cookie collection may require consent from you.',
    ],
  },
  {
    title: '4. How We Use Information',
    body: [
      'We may use a combination of voluntarily and automatically collected information to provide, operate, and maintain our services; publish and host the portfolios you build with us; communicate with you, including for customer service and support; and improve, personalize, and expand our services.',
    ],
  },
  {
    title: '5. Security of Your Personal Information',
    body: [
      'When we collect and process personal information, we put in place reasonable and appropriate security measures to try to protect it against unauthorized access, alteration, disclosure, or destruction. No method of transmission over the internet, or method of electronic storage, is 100% secure, so we cannot guarantee absolute security.',
    ],
  },
  {
    title: "6. Children's Privacy",
    body: [
      'We do not knowingly collect any personal information from children under the age of 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us — we will delete such information from our records promptly.',
    ],
  },
  {
    title: '7. Changes to This Policy',
    body: [
      'At our discretion, we may change this policy to reflect updates to our business processes, current acceptable practices, or legislative or regulatory changes. If we decide to change this policy, we will post the changes here and update the effective date above.',
    ],
  },
  {
    title: '8. Contact Us',
    body: [
      'For any questions or concerns regarding your privacy, you may contact us at privacy@designfolio.me.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LandingShell>
      <div className="relative z-10 max-w-xl mx-auto pt-32 sm:pt-40 pb-24 sm:pb-32 text-left">
        <h1 className="text-4xl sm:text-5xl font-[650] tracking-tight text-[var(--heading)]">Privacy Policy</h1>
        <p className="mt-4 text-[var(--muted)]">Effective date: August 28, 2026</p>

        <div className="mt-8 border-t border-[var(--border)]" />

        <div className="mt-10 flex flex-col gap-6 text-[#3d3d3d] leading-relaxed">
          <p>
            Your privacy is important to us. It is Designfolio's policy to respect your privacy and comply with any
            applicable law and regulation regarding any personal information we may collect about you, including
            across our website, designfolio.me, and other sites we own and operate.
          </p>
          <p>
            Personal information is any information about you which can be used to identify you. This includes
            information about you as a person (such as name, address, and date of birth), your devices, payment
            details, and even information about how you use a website or online service.
          </p>
          <p>
            In the event our site contains links to third-party sites and services, please be aware that those
            sites and services have their own privacy policies. After following a link to any third-party content,
            you should read their posted privacy policy information about how they collect and use personal
            information. This Privacy Policy does not apply to any of your activities after you leave our site.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="mt-12">
            <h2 className="text-2xl font-[650] tracking-tight text-[var(--heading)]">{section.title}</h2>
            <div className="mt-4 flex flex-col gap-4 text-[#3d3d3d] leading-relaxed">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LandingShell>
  )
}
