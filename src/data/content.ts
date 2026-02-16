export const siteConfig = {
  name: 'Wenliang Zeng',
  title: 'Full-Stack Developer & AI Tooling Builder',
  email: 'wenliang_zeng416@163.com',
  github: 'https://github.com/Zengwenliang0416',
}

export const heroData = {
  greeting: 'Hello, I\'m',
  name: 'WENLIANG\nZENG',
  roles: ['Full-Stack Developer', 'AI Tooling Builder', 'Open Source Creator'],
  description: 'Building AI-powered tools and production-grade applications that bridge research with real-world engineering.',
}

export const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'Papers', href: '#papers' },
  { label: 'Contact', href: '#contact' },
]

export const stats = [
  { value: 43, suffix: '+', label: 'Repositories' },
  { value: 80, suffix: '+', label: 'GitHub Stars' },
  { value: 6, suffix: '', label: 'Languages' },
  { value: 2, suffix: '', label: 'Publications' },
]

export const techStack = [
  'Python', 'TypeScript', 'JavaScript', 'Swift', 'Rust', 'Java',
  'React', 'Vue 3', 'TailwindCSS', 'FastAPI', 'Node.js', 'Spring Boot',
  'PyTorch', 'GNN', 'MCP Protocol', 'Docker', 'Kubernetes', 'GitHub Actions',
  'MySQL', 'MongoDB', 'Redis', 'PostgreSQL', 'Deep Learning', 'Django',
]

export interface Project {
  name: string
  title: string
  desc: string
  tech: string[]
  stars?: number
  url: string
  featured?: boolean
  accent: string
  gradient: [string, string]
  image?: string
}

export const projects: Project[] = [
  {
    name: 'mcp-server-sequential-thinking',
    title: 'Sequential Thinking MCP',
    desc: 'MCP server enabling structured sequential thinking for AI agents. Step-by-step reasoning protocol for complex decision-making workflows.',
    tech: ['JavaScript', 'MCP Protocol', 'Node.js'],
    stars: 42,
    url: 'https://github.com/Zengwenliang0416/mcp-server-sequential-thinking',
    featured: true,
    accent: 'coral',
    gradient: ['#FF3C5F', '#FF8A5C'],
  },
  {
    name: 'claude-notifier',
    title: 'Claude Notifier',
    desc: 'macOS native notification tool for Claude Code. System alerts when long-running AI tasks complete.',
    tech: ['Swift', 'macOS', 'Notifications API'],
    stars: 17,
    url: 'https://github.com/Zengwenliang0416/claude-notifier',
    featured: true,
    accent: 'lime',
    gradient: ['#BEFF00', '#63FF6C'],
  },
  {
    name: 'banana-image-mcp',
    title: 'Banana Image MCP',
    desc: 'MCP server for AI-powered image generation and processing pipelines. Seamless integration with Claude.',
    tech: ['Python', 'MCP Protocol', 'AI'],
    stars: 11,
    url: 'https://github.com/Zengwenliang0416/banana-image-mcp',
    featured: true,
    accent: 'indigo',
    gradient: ['#6C63FF', '#A78BFA'],
  },
  {
    name: 'ParaCPI',
    title: 'ParaCPI',
    desc: 'Parallel graph convolutional network for compound-protein interaction prediction in drug discovery.',
    tech: ['Python', 'PyTorch', 'GNN', 'Deep Learning'],
    stars: 1,
    url: 'https://github.com/Zengwenliang0416/ParaCPI',
    accent: 'coral',
    gradient: ['#FF3C5F', '#6C63FF'],
  },
  {
    name: 'my-plugins',
    title: 'My Plugins',
    desc: 'Curated collection of developer plugins and extensions for enhanced productivity.',
    tech: ['TypeScript', 'Plugins'],
    stars: 1,
    url: 'https://github.com/Zengwenliang0416/my-plugins',
    accent: 'lime',
    gradient: ['#BEFF00', '#00FFD1'],
  },
  {
    name: 'Mermaid_General_Pic',
    title: 'Mermaid to Image',
    desc: 'Web app converting Mermaid diagrams to images with live preview, DPI control and multi-format export.',
    tech: ['Vue 3', 'Node.js', 'Mermaid'],
    stars: 1,
    url: 'https://github.com/Zengwenliang0416/Mermaid_General_Pic',
    accent: 'indigo',
    gradient: ['#6C63FF', '#FF3C5F'],
  },
  {
    name: 'MarkPub',
    title: 'MarkPub',
    desc: 'Desktop app for one-click publishing Markdown articles to multiple blog platforms like CSDN and Juejin.',
    tech: ['Python', 'Desktop', 'Markdown'],
    stars: 1,
    url: 'https://github.com/Zengwenliang0416/MarkPub',
    accent: 'coral',
    gradient: ['#FF8A5C', '#FF3C5F'],
  },
  {
    name: 'CiteScholarEasy',
    title: 'CiteScholar Easy',
    desc: 'Download EndNote citation formats from Google Scholar by paper titles. Streamline academic reference management.',
    tech: ['Python', 'Google Scholar', 'Citation'],
    stars: 1,
    url: 'https://github.com/Zengwenliang0416/CiteScholarEasy',
    accent: 'lime',
    gradient: ['#63FF6C', '#BEFF00'],
  },
]

export const publications = [
  {
    title: 'GDilatedDTA',
    desc: 'Drug-target binding affinity prediction using graph dilated convolution networks.',
    tags: ['GNN', 'Drug Discovery', 'Deep Learning'],
  },
  {
    title: 'ParaCPI',
    desc: 'Parallel graph convolutional network for compound-protein interaction prediction.',
    tags: ['GCN', 'Protein', 'Drug Discovery'],
  },
]
