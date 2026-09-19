import slugify from 'limax';

const FULL_STACK_SUB_BLOCKS = [
  {
    title: 'Frontend fundamentals',
    description: 'HTML, CSS, JavaScript, browser behavior, accessibility, and the foundations of client-side work.',
  },
  {
    title: 'Frontend engineering',
    description: 'Frameworks, state, rendering, interaction patterns, and maintainable frontend applications.',
  },
  {
    title: 'Backend',
    description: 'Languages, frameworks, business logic, runtime behavior, and reliable server-side implementation.',
  },
  {
    title: 'API design',
    description: 'HTTP contracts, resource modeling, versioning, validation, and dependable service interfaces.',
  },
  {
    title: 'DB',
    description: 'Data modeling, storage engines, querying, transactions, caching, and persistence tradeoffs.',
  },
  {
    title: 'Security',
    description: 'Authentication, authorization, threat modeling, secure coding, and protecting application data.',
  },
  {
    title: 'Testing',
    description: 'Unit, integration, end-to-end, contract, and performance testing strategies.',
  },
  {
    title: 'DevOps/Cloud',
    description: 'Containers, infrastructure, CI/CD, cloud platforms, deployment, and operational automation.',
  },
  {
    title: 'Architecture',
    description: 'System boundaries, distributed workflows, scaling, resilience, and architectural tradeoffs.',
  },
  {
    title: 'Observability',
    description: 'Logs, metrics, traces, alerting, diagnostics, and understanding production behavior.',
  },
  {
    title: 'Engineering workflow',
    description: 'Development practices, source control, reviews, documentation, and team delivery workflows.',
  },
] as const;

type SubBlockDefinition = (typeof FULL_STACK_SUB_BLOCKS)[number];

const BLOG_BLOCK_DEFINITIONS = [
  {
    title: 'Full-stack',
    description: 'End-to-end software engineering, from user interfaces and APIs to infrastructure and operations.',
    children: FULL_STACK_SUB_BLOCKS,
  },
  {
    title: 'Agent',
    description: 'Agent systems, AI-assisted workflows, orchestration, evaluation, and production agent engineering.',
    children: [],
  },
] as const;

export const BLOG_BLOCKS = BLOG_BLOCK_DEFINITIONS.map((block) => ({
  ...block,
  slug: slugify(block.title),
  children: block.children.map((child: SubBlockDefinition) => ({
    ...child,
    slug: slugify(child.title),
  })),
}));

export const BLOG_SUB_BLOCKS = BLOG_BLOCKS.flatMap((block) => block.children);

export interface BlogBlockLink {
  title: string;
  description: string;
  slug: string;
}

export interface BlogBlockPage extends BlogBlockLink {
  parent?: Pick<BlogBlockLink, 'title' | 'slug'>;
  children: BlogBlockLink[];
  categoryTitles: string[];
}

export const BLOG_BLOCK_PAGES = BLOG_BLOCKS.flatMap((block): BlogBlockPage[] => [
  {
    title: block.title,
    description: block.description,
    slug: block.slug,
    children: block.children,
    categoryTitles: block.children.map((child) => child.title),
  },
  ...block.children.map((child) => ({
    ...child,
    parent: { title: block.title, slug: block.slug },
    children: [],
    categoryTitles: [child.title],
  })),
]);

export const BLOG_BLOCK_TITLES = FULL_STACK_SUB_BLOCKS.map((block) => block.title) as [
  (typeof FULL_STACK_SUB_BLOCKS)[number]['title'],
  ...(typeof FULL_STACK_SUB_BLOCKS)[number]['title'][],
];

export const getBlogBlockByTitle = (title?: string | null) => {
  const normalizedTitle = (title || '').trim();
  return (
    BLOG_BLOCKS.find((block) => block.title === normalizedTitle) ||
    BLOG_SUB_BLOCKS.find((block) => block.title === normalizedTitle)
  );
};
