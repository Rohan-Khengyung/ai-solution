export const MOCK_POSTS = [
  {
    _id: 'mock1',
    title: 'The Future of Generative AI in Enterprise Software',
    slug: 'future-generative-ai-enterprise',
    excerpt: 'Discover how generative AI is revolutionizing business processes, from automated content creation to intelligent decision-making systems.',
    content: `
      <p>Generative AI is no longer a futuristic concept—it's transforming enterprises today. From automated content creation to intelligent decision-making, businesses that adopt generative AI are seeing unprecedented efficiency gains.</p>
      <h2>The Rise of Foundation Models</h2>
      <p>Large language models (LLMs) like GPT-4 and Claude have democratized access to advanced AI capabilities. Companies can now fine-tune these models on their proprietary data to create custom assistants that understand their unique domain.</p>
      <h2>Real‑World Use Cases</h2>
      <ul>
        <li><strong>Automated report generation</strong> – Finance teams produce quarterly summaries in minutes.</li>
        <li><strong>Code assistants</strong> – Developers accelerate prototyping by 3×.</li>
        <li><strong>Customer support</strong> – AI resolves 70% of tickets without human intervention.</li>
      </ul>
      <p>The key is to start with a clear use case, measure ROI, and iterate. Our platform provides the building blocks to integrate generative AI safely and at scale.</p>
    `,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    author: 'Dr. Sarah Chen',
    tags: ['AI', 'Insights'],
    createdAt: '2026-05-15T10:00:00Z',
    published: true,
    views: 1240
  },
  {
    _id: 'mock2',
    title: 'Building Scalable AI Assistants: Lessons from 500+ Deployments',
    slug: 'scalable-ai-assistants-lessons',
    excerpt: 'Learn best practices for designing and deploying AI virtual assistants that handle millions of conversations while maintaining accuracy.',
    content: `
      <p>After deploying over 500 AI assistants across industries, we've distilled key lessons for building systems that handle millions of conversations.</p>
      <h2>Lesson 1: Design for Failure</h2>
      <p>AI assistants will inevitably encounter edge cases. Build graceful fallbacks with human handoff and continuous learning loops.</p>
      <h2>Lesson 2: Context is King</h2>
      <p>Integrate with CRM, ticketing, and knowledge base systems. The most effective assistants pull real‑time data from multiple sources.</p>
      <h2>Lesson 3: Monitor Everything</h2>
      <p>Track intent recognition accuracy, response latency, and user satisfaction. Use these metrics to retrain and improve weekly.</p>
      <p>Our automation platform includes these best practices out of the box, reducing time‑to‑value from months to weeks.</p>
    `,
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop',
    author: 'Michael Rodriguez',
    tags: ['Engineering', 'AI'],
    createdAt: '2026-05-10T14:30:00Z',
    published: true,
    views: 892
  },
  {
    _id: 'mock3',
    title: 'Case Study: How FinTech Corp Automated 80% of Customer Support',
    slug: 'fintech-automation-case-study',
    excerpt: 'A deep dive into how our automation platform helped a leading financial services company reduce response times and increase customer satisfaction.',
    content: `
      <p>FinTech Corp, a global payments processor with 2M+ daily transactions, faced soaring support costs. They implemented our AI Virtual Assistant and Automation Platform.</p>
      <h2>The Challenge</h2>
      <p>50+ support agents handling repetitive password resets, transaction status checks, and compliance questions. Average resolution time: 8 minutes.</p>
      <h2>The Solution</h2>
      <p>We deployed a custom AI assistant integrated with their ticketing and core banking systems. The assistant resolved 80% of tier‑1 issues autonomously.</p>
      <h2>The Results</h2>
      <ul>
        <li>78% reduction in support tickets escalated to humans</li>
        <li>62% lower cost per contact</li>
        <li>Customer satisfaction score increased from 3.8 to 4.7</li>
      </ul>
      <p>Read the full case study to see how we architected the solution and overcame security and compliance hurdles.</p>
    `,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    author: 'Emma Watson',
    tags: ['Case Study', 'Automation'],
    createdAt: '2026-05-05T09:15:00Z',
    published: true,
    views: 2103
  },
  {
    _id: 'mock4',
    title: 'The Rise of Low-Code AI: Empowering Business Teams',
    slug: 'low-code-ai-rise',
    excerpt: 'Explore how low-code AI platforms are democratizing access to artificial intelligence, enabling non-technical teams to build intelligent workflows.',
    content: `
      <p>Not every AI project requires a team of PhDs. Low‑code platforms allow business analysts and domain experts to build intelligent workflows using drag‑and‑drop interfaces.</p>
      <h2>What is Low-Code AI?</h2>
      <p>It combines pre‑built AI components (intent classifiers, entity extractors, image recognition) with visual workflow builders. Business users can create automations without writing code.</p>
      <h2>Benefits</h2>
      <ul>
        <li>Faster iteration – changes take hours, not weeks</li>
        <li>Less dependency on engineering resources</li>
        <li>Greater alignment with business needs</li>
      </ul>
      <p>Our Prototyping Solutions suite includes a low‑code AI canvas that has helped dozens of teams launch MVPs in under two weeks.</p>
    `,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    author: 'James Liu',
    tags: ['Product', 'Insights'],
    createdAt: '2026-04-28T11:45:00Z',
    published: true,
    views: 567
  },
  {
    _id: 'mock5',
    title: 'AI Ethics & Governance: Building Responsible Systems',
    slug: 'ai-ethics-governance',
    excerpt: 'A framework for ensuring fairness, transparency, and accountability in AI-powered business solutions.',
    content: `
      <p>As AI becomes mission‑critical, ethical risks like bias, lack of explainability, and data privacy must be addressed proactively.</p>
      <h2>Our Responsible AI Framework</h2>
      <ul>
        <li><strong>Fairness</strong> – Regular bias audits across protected attributes</li>
        <li><strong>Transparency</strong> – Explainable AI (XAI) techniques for model decisions</li>
        <li><strong>Privacy</strong> – Differential privacy and on‑prem deployment options</li>
        <li><strong>Accountability</strong> – Human‑in‑the‑loop for high‑stakes decisions</li>
      </ul>
      <p>We help clients implement these principles without sacrificing performance. Governance is not a blocker – it's a competitive advantage.</p>
    `,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop',
    author: 'Dr. Priya Sharma',
    tags: ['Insights', 'Engineering'],
    createdAt: '2026-04-20T16:20:00Z',
    published: true,
    views: 734
  },
  {
    _id: 'mock6',
    title: 'Inside Our New Automation Engine: A Technical Deep Dive',
    slug: 'automation-engine-deep-dive',
    excerpt: 'Engineers from our core team share the architecture, challenges, and innovations behind our latest automation platform release.',
    content: `
      <p>We recently rebuilt our automation engine from the ground up. Here's what changed and why it matters for our customers.</p>
      <h2>Event‑Driven Architecture</h2>
      <p>The new engine uses a reactive, event‑driven model that scales horizontally. We moved from polling to webhooks and message queues, reducing latency by 85%.</p>
      <h2>Low‑Code Workflow Builder</h2>
      <p>Our visual builder now supports loops, conditional branches, and parallel execution. Non‑programmers can create sophisticated automations with ease.</p>
      <h2>Enterprise‑Grade Security</h2>
      <p>We added fine‑grained RBAC, audit logs, and end‑to‑end encryption for data in transit and at rest.</p>
      <p>Early adopters have seen a 60% reduction in manual tasks and a 40% faster time to market for new automations.</p>
    `,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop',
    author: 'Alex Thompson',
    tags: ['Engineering', 'Automation'],
    createdAt: '2026-04-12T10:00:00Z',
    published: true,
    views: 1456
  }
];