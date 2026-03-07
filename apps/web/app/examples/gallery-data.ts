export type ExampleSurface = {
  slug: string;
  title: string;
  category: string;
  runtime: string;
  summary: string;
  payoff: string;
  highlights: string[];
  metrics: { value: string; label: string }[];
  tone: 'teal' | 'amber' | 'violet' | 'rose' | 'blue' | 'emerald';
};

export const premiumExamples: ExampleSurface[] = [
  {
    slug: 'operator-cockpit',
    title: 'Operator Cockpit',
    category: 'Internal product',
    runtime: 'React',
    summary:
      'A high-pressure command surface for support, risk, and dispatch teams that need speed without visual chaos.',
    payoff:
      'Shows that LotOS UI can ship a dense, premium internal tool without looking like generic admin software.',
    highlights: ['signal-first KPI rail', 'incident queue', 'action-centered detail canvas'],
    metrics: [
      { value: '03', label: 'response lanes' },
      { value: '14', label: 'live alerts' },
      { value: '99.2%', label: 'uptime' },
    ],
    tone: 'teal',
  },
  {
    slug: 'executive-briefing',
    title: 'Executive Briefing Room',
    category: 'Narrative dashboard',
    runtime: 'React / Docs shell',
    summary:
      'A polished KPI narrative surface for founders, investors, and board-facing updates.',
    payoff:
      'Proves the system can feel expensive and strategic, not only operational.',
    highlights: ['long-form storytelling', 'premium metric cards', 'boardroom hierarchy'],
    metrics: [
      { value: '7', label: 'decision blocks' },
      { value: '1', label: 'clear story' },
      { value: 'A+', label: 'visual finish' },
    ],
    tone: 'violet',
  },
  {
    slug: 'spreadsheet-upgrade',
    title: 'Spreadsheet Modernization Layer',
    category: 'Workflow modernization',
    runtime: 'Excel / Calc',
    summary:
      'Turns ugly operational spreadsheets into a cleaner command surface without forcing a full rewrite.',
    payoff:
      'Makes the spreadsheet lane sellable as premium transformation, not as a weird side experiment.',
    highlights: ['macro-driven facelift', 'command ribbons', 'same workbook, better perception'],
    metrics: [
      { value: '0', label: 'full rewrites' },
      { value: '1', label: 'same workbook' },
      { value: 'Fast', label: 'sales hook' },
    ],
    tone: 'amber',
  },
  {
    slug: 'premium-docs-shell',
    title: 'Premium Docs Shell',
    category: 'Product education',
    runtime: 'Next.js',
    summary:
      'A docs experience that teaches, sells, and builds trust without feeling like a template marketplace.',
    payoff:
      'Shows the public layer can be part of the product proof itself.',
    highlights: ['onboarding-first flow', 'component pages', 'runtime clarity'],
    metrics: [
      { value: '1st', label: 'trust layer' },
      { value: 'Docs', label: 'as product' },
      { value: 'Clear', label: 'upgrade path' },
    ],
    tone: 'blue',
  },
  {
    slug: 'vault-signature',
    title: 'Vault Signature Surface',
    category: 'Commercial product',
    runtime: 'Next.js + entitlements',
    summary:
      'A gated premium surface where buyers immediately feel the difference between public value and protected assets.',
    payoff:
      'Demonstrates premium depth without collapsing into boring SaaS account screens.',
    highlights: ['tier-aware access', 'private assets', 'commercial readiness'],
    metrics: [
      { value: '3', label: 'paid tiers' },
      { value: 'Locked', label: 'premium value' },
      { value: 'Ready', label: 'handoff' },
    ],
    tone: 'rose',
  },
  {
    slug: 'multi-runtime-map',
    title: 'Multi-Runtime Strategy Map',
    category: 'Platform planning',
    runtime: 'Web app',
    summary:
      'A filtered runtime cockpit that helps teams understand stable, alpha, and experimental tracks quickly.',
    payoff:
      'Turns roadmap breadth into a premium planning surface instead of a spreadsheet-shaped liability.',
    highlights: ['status-aware matrix', 'design direction selector', 'runtime filtering'],
    metrics: [
      { value: '10+', label: 'runtime tracks' },
      { value: 'Stable', label: 'React core' },
      { value: 'Honest', label: 'maturity map' },
    ],
    tone: 'emerald',
  },
];

export const examplesProofPoints = [
  'No external theme marketplace is required to make these surfaces feel premium.',
  'The same product language can support dashboards, docs, vaults, and spreadsheet upgrades.',
  'LotOS UI is strongest when it behaves like a system with hierarchy, not a bag of disconnected components.',
];
