import type { LocaleContent } from "./types";

export const zh: LocaleContent = {
  nav: {
    links: [
      { label: "关于", href: "#about" },
      { label: "专业", href: "#expertise" },
      { label: "项目", href: "#projects" },
      { label: "论文", href: "#publications" },
      { label: "联系", href: "#contact" },
    ],
    contact: "联系我",
  },
  hero: {
    greeting: "你好，我是",
    chineseName: "曾文亮",
    lines: ["FULL STACK", "DEVELOPER &", "AI TOOL", "BUILDER"],
    scrollHint: "滚动探索",
    roles: ["全栈开发者", "AI 工具构建者", "开源创作者"],
    description: "构建 AI 驱动的工具与生产级应用，连接学术研究与工程实践。",
    stats: [
      { value: 43, suffix: "+", label: "代码仓库" },
      { value: 80, suffix: "+", label: "GitHub Stars" },
      { value: 6, suffix: "", label: "编程语言" },
      { value: 2, suffix: "", label: "学术论文" },
    ],
  },
  intro: {
    heading: "关于我",
    bio: "一名热爱开源的全栈开发者和 AI 工具构建者。我将学术研究与生产工程相结合，创造赋能开发者、突破可能性边界的工具。",
  },
  achievementsSection: {
    heading: "成就",
    total: "总计",
  },
  expertiseSection: {
    heading: "专业领域",
    description:
      "将 AI 研究与生产工程跨学科融合——从图神经网络到全栈 Web 应用。",
  },
  cta: {
    heading: "准备好一起创造些什么了吗？",
    button: "联系我吧！！",
    marqueeText: "继续滚动",
  },
  projects: {
    heading: ["精选", "项目"],
    counter: (n) => `${n} 个项目`,
    moreHeading: "更多项目",
    featuredLabel: "精选",
    items: {
      "mcp-server-sequential-thinking": {
        title: "Sequential Thinking MCP",
        desc: "为 AI 代理提供结构化顺序思维的 MCP 服务器，用于复杂决策工作流的逐步推理协议。",
      },
      "claude-notifier": {
        title: "Claude Notifier",
        desc: "Claude Code 的 macOS 原生通知工具，长时间运行的 AI 任务完成时发送系统提醒。",
      },
      "banana-image-mcp": {
        title: "Banana Image MCP",
        desc: "AI 驱动的图像生成与处理流水线 MCP 服务器，与 Claude 无缝集成。",
      },
      ParaCPI: {
        title: "ParaCPI",
        desc: "用于药物发现中化合物-蛋白质相互作用预测的并行图卷积网络。",
      },
      "my-plugins": {
        title: "My Plugins",
        desc: "精心整理的开发者插件与扩展合集，提升开发效率。",
      },
      Mermaid_General_Pic: {
        title: "Mermaid 转图片",
        desc: "将 Mermaid 图表转换为图片的 Web 应用，支持实时预览、DPI 控制和多格式导出。",
      },
      MarkPub: {
        title: "MarkPub",
        desc: "一键将 Markdown 文章发布到 CSDN、掘金等多个博客平台的桌面应用。",
      },
      CiteScholarEasy: {
        title: "CiteScholar Easy",
        desc: "通过论文标题从 Google Scholar 下载 EndNote 引用格式，简化学术参考文献管理。",
      },
    },
  },
  techStack: {
    heading: ["技术", "栈"],
  },
  publications: {
    heading: ["学术", "论文"],
    eyebrow: "学术研究",
    items: {
      GDilatedDTA: {
        desc: "GDilatedDTA：用于药物-靶点结合亲和力预测的图膨胀卷积策略。",
      },
      ParaCPI: {
        desc: "ParaCPI：用于化合物-蛋白质相互作用预测的并行图卷积网络。",
      },
    },
  },
  contact: {
    eyebrow: "取得联系",
    heading: ["一起", "合作吧"],
    description: "欢迎交流合作机会，探讨 AI 工具开发与全栈技术。",
    emailBtn: "发送邮件",
    githubBtn: "GitHub 主页",
  },
  footer: {
    builtBy: "由",
    builtBySuffix: " 构建",
    address: "中国",
    newsletter: "联系方式",
    newsletterPlaceholder: "您的邮箱",
    copyright: "©2025 曾文亮",
  },
  meta: {
    title: "曾文亮 - 全栈开发者 & AI 工具构建者",
    description: "全栈开发者 | AI 工具构建者 | 开源贡献者",
  },
};
