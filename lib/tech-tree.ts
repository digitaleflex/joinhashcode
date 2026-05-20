export interface TechSynergy {
  tool: string;
  recommends: string[];
}

export const TECH_TREE: Record<string, string[]> = {
  "Web": ["Next.js", "React", "Tailwind", "TypeScript", "Vercel", "Framer Motion"],
  "Cybersecurity": ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Docker"],
  "Cloud": ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "Serverless"],
  "IA": ["OpenAI", "Python", "PyTorch", "TensorFlow", "LangChain", "Hugging Face"],
  "Mobile": ["React Native", "Flutter", "Swift", "Kotlin", "Expo"],
  "Data": ["PostgreSQL", "Redis", "Supabase", "Prisma", "SQL", "BigQuery"],
  "Automation": ["GitHub Actions", "Python", "Node.js", "Zapier", "n8n"],
  "UI/UX": ["Figma", "Adobe XD", "Tailwind", "Storybook", "Spline"],
  "DevOps": ["Docker", "Kubernetes", "CI/CD", "Linux", "Nginx", "Monitoring"],
  "Blockchain": ["Solidity", "Ether.js", "Hardhat", "Rust", "Web3.js"]
};

export const SPECIALIZATION_QUIZ = [
  {
    question: "Où passes-tu le plus clair de ton temps ?",
    options: [
      { text: "Interface & Expérience", value: "frontend", domains: ["Web", "UI/UX"] },
      { text: "Logique & Architecture", value: "backend", domains: ["Web", "Data"] },
      { text: "Infrastructure & Systèmes", value: "ops", domains: ["DevOps", "Cloud", "Cybersecurity"] },
      { text: "Données & Intelligence", value: "data", domains: ["IA", "Data"] }
    ]
  },
  {
    question: "Quel est ton moteur de création ?",
    options: [
      { text: "L'esthétique et le pixel perfect", value: "visual", tools: ["Figma", "Tailwind"] },
      { text: "La performance et l'optimisation", value: "perf", tools: ["Prisma", "PostgreSQL", "Docker"] },
      { text: "La vitesse d'exécution", value: "speed", tools: ["Next.js", "Supabase", "Vercel"] },
      { text: "La sécurité et la robustesse", value: "security", tools: ["TypeScript", "Kali Linux", "CI/CD"] }
    ]
  },
  {
    question: "Quel outil est ton indispensable ?",
    options: [
      { text: "Le Terminal / Console", value: "terminal", domains: ["DevOps", "Cybersecurity"] },
      { text: "Le Navigateur (DevTools)", value: "browser", domains: ["Web"] },
      { text: "L'Éditeur de code (VS Code/Cursor)", value: "editor", domains: ["Web", "Mobile"] },
      { text: "Les Outils de Design (Figma)", value: "design", domains: ["UI/UX"] }
    ]
  }
];
