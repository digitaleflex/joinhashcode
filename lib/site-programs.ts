/**
 * Editorial source of truth for program domains (T0 inventory, static).
 * No counts, no courses invented — cards link to live pages (/labs, /academy).
 */

export const ACTIVE_PROGRAMS = [
  {
    title: "Cloud & DevOps",
    text: "Understand how modern software runs in production — from a first Linux server to automated delivery pipelines.",
    topics: ["Linux and cloud fundamentals", "CI/CD and automation concepts", "Infrastructure and engineering foundations"],
  },
  {
    title: "AI & Data",
    text: "From reading data to questioning models — build an intuition for data analysis and artificial intelligence.",
    topics: ["Data analysis foundations", "Introduction to machine learning", "Artificial intelligence exploration"],
  },
  {
    title: "Product & Strategy",
    text: "Learn to think in problems before solutions — product thinking, structured problem-solving and teamwork.",
    topics: ["Product thinking", "Problem-solving", "Design thinking", "Project fundamentals"],
  },
  {
    title: "Engineering Foundations",
    text: "The durable core of software engineering — algorithms, data and systems that outlive every framework.",
    topics: ["Algorithms", "Database fundamentals", "Software engineering foundations"],
  },
]

export const DEVELOPING_PROGRAMS = [
  "Web & Fullstack",
  "Mobile Development",
  "UX/UI & Graphic Design",
  "Content & Creative Strategy",
  "Community & Partnerships",
  "Software Architecture",
]

export const COMING_SOON_PROGRAMS = ["Cybersecurity", "Automation", "Web3"]
