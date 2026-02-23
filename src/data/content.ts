export const siteConfig = {
  name: "Wenliang Zeng",
  email: "wenliang_zeng416@163.com",
  github: "https://github.com/Zengwenliang0416",
};

export const techStack = [
  "Python",
  "TypeScript",
  "JavaScript",
  "Swift",
  "Rust",
  "Java",
  "React",
  "Vue 3",
  "TailwindCSS",
  "FastAPI",
  "Node.js",
  "Spring Boot",
  "PyTorch",
  "GNN",
  "MCP Protocol",
  "Docker",
  "Kubernetes",
  "GitHub Actions",
  "MySQL",
  "MongoDB",
  "Redis",
  "PostgreSQL",
  "Deep Learning",
  "Django",
];

export interface Project {
  name: string;
  tech: string[];
  stars?: number;
  url: string;
  featured?: boolean;
  accent: string;
  gradient: [string, string];
  image?: string;
}

export const projects: Project[] = [
  {
    name: "mcp-server-sequential-thinking",
    tech: ["JavaScript", "MCP Protocol", "Node.js"],
    stars: 42,
    url: "https://github.com/Zengwenliang0416/mcp-server-sequential-thinking",
    featured: true,
    accent: "coral",
    gradient: ["#FF3C5F", "#FF8A5C"],
    image: "/images/projects/sequential-thinking.png",
  },
  {
    name: "claude-notifier",
    tech: ["Swift", "macOS", "Notifications API"],
    stars: 17,
    url: "https://github.com/Zengwenliang0416/claude-notifier",
    featured: true,
    accent: "lime",
    gradient: ["#BEFF00", "#63FF6C"],
    image: "/images/projects/claude-notifier.png",
  },
  {
    name: "banana-image-mcp",
    tech: ["Python", "MCP Protocol", "AI"],
    stars: 11,
    url: "https://github.com/Zengwenliang0416/banana-image-mcp",
    featured: true,
    accent: "indigo",
    gradient: ["#6C63FF", "#A78BFA"],
    image: "/images/projects/banana-image-mcp.png",
  },
  {
    name: "ParaCPI",
    tech: ["Python", "PyTorch", "GNN", "Deep Learning"],
    stars: 1,
    url: "https://github.com/Zengwenliang0416/ParaCPI",
    accent: "coral",
    gradient: ["#FF3C5F", "#6C63FF"],
    image: "/images/projects/paracpi.png",
  },
  {
    name: "my-plugins",
    tech: ["TypeScript", "Plugins"],
    stars: 1,
    url: "https://github.com/Zengwenliang0416/my-plugins",
    accent: "lime",
    gradient: ["#BEFF00", "#00FFD1"],
    image: "/images/projects/my-plugins.png",
  },
  {
    name: "Mermaid_General_Pic",
    tech: ["Vue 3", "Node.js", "Mermaid"],
    stars: 1,
    url: "https://github.com/Zengwenliang0416/Mermaid_General_Pic",
    accent: "indigo",
    gradient: ["#6C63FF", "#FF3C5F"],
    image: "/images/projects/mermaid-general-pic.png",
  },
  {
    name: "MarkPub",
    tech: ["Python", "Desktop", "Markdown"],
    stars: 1,
    url: "https://github.com/Zengwenliang0416/MarkPub",
    accent: "coral",
    gradient: ["#FF8A5C", "#FF3C5F"],
    image: "/images/projects/markpub.png",
  },
  {
    name: "CiteScholarEasy",
    tech: ["Python", "Google Scholar", "Citation"],
    stars: 1,
    url: "https://github.com/Zengwenliang0416/CiteScholarEasy",
    accent: "lime",
    gradient: ["#63FF6C", "#BEFF00"],
    image: "/images/projects/citescholareasy.png",
  },
];

export const publications = [
  {
    title: "GDilatedDTA",
    journal: "Biomedical Signal Processing and Control, Vol.92, 2024",
    authors:
      "Longxin Zhang, Wenliang Zeng, Jingsheng Chen, Jianguo Chen, Keqin Li",
    doi: "https://doi.org/10.1016/j.bspc.2024.106110",
    tags: ["GNN", "Drug Discovery", "Deep Learning"],
  },
  {
    title: "ParaCPI",
    journal:
      "IEEE/ACM Transactions on Computational Biology and Bioinformatics, Vol.21(5), 2024, pp.1565-1578",
    authors:
      "Longxin Zhang, Wenliang Zeng, Jingsheng Chen, Jianguo Chen, Keqin Li",
    doi: "https://doi.org/10.1109/TCBB.2024.3404889",
    tags: ["GCN", "Protein", "Drug Discovery"],
  },
];

export interface AchievementCategory {
  platform: string;
  items: string[];
  total: number;
}

export const achievements: AchievementCategory[] = [
  {
    platform: "Open Source",
    items: ["43+ Repos", "80+ Stars", "8+ Tools", "MCP Ecosystem"],
    total: 43,
  },
  {
    platform: "Academic",
    items: ["IEEE/ACM TCBB", "Elsevier BSPC"],
    total: 2,
  },
  {
    platform: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Swift", "Rust", "Java"],
    total: 6,
  },
];

export const totalAchievements = 51;

export interface ExpertiseCategory {
  title: string;
  items: string[];
}

export const expertise: ExpertiseCategory[] = [
  {
    title: "AI & Machine Learning",
    items: [
      "PyTorch",
      "Graph Neural Networks",
      "Deep Learning",
      "MCP Protocol",
      "LLM Integration",
    ],
  },
  {
    title: "Full Stack Development",
    items: [
      "React",
      "Vue 3",
      "Node.js",
      "FastAPI",
      "Spring Boot",
      "TailwindCSS",
    ],
  },
  {
    title: "Developer Tooling",
    items: [
      "MCP Servers",
      "CLI Tools",
      "Browser Extensions",
      "VS Code Plugins",
      "Automation",
    ],
  },
  {
    title: "Research & Data",
    items: [
      "Drug Discovery",
      "Bioinformatics",
      "Graph Convolution",
      "Data Pipelines",
      "Academic Publishing",
    ],
  },
];
