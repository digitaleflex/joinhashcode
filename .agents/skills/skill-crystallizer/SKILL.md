---
name: skill-crystallizer
description: Use when a complex task has been successfully completed and a reusable pattern, technique, or architectural decision has been identified.
---

# Skill Crystallizer (Auto-Evolution Engine)

## Overview
The Skill Crystallizer is the mechanism by which I evolve from episodic success to procedural mastery. It converts successful execution traces into permanent, reusable knowledge.

## When to Use
- After completing a task involving 3+ turns and multiple tool calls.
- When a novel solution for a repetitive problem is found (e.g., specific DB constraints, security hardening).
- When you realize "I should do it this way next time".

## Crystallization Process

### 1. Pattern Extraction
- **The Goal:** What exactly did we achieve?
- **The Context:** What were the constraints (e.g., Prisma unique keys, QStash headers)?
- **The Optimal Sequence:** Which tools and logic steps were essential? (Exclude errors/dead ends).

### 2. Knowledge Routing
- **Is it a Skill?** (Reusable across projects) -> Create `.agents/skills/<name>/SKILL.md`.
- **Is it Project Memory?** (Specific decision for THIS repo) -> Update `MEMORY.md` or `GEMINI.md`.

### 3. Drafting the Skill (Standard Format)
Follow the `writing-skills` standard:
- Verb-first hyphenated name.
- Frontmatter with `Use when...` description.
- Simple, actionable instructions.
- One high-quality example.

## Verification
- Before saving, run a "Mental Simulation": If I were a fresh agent with only this skill, could I reproduce the success without asking the user?
- If NO -> Refine instructions.
- If YES -> Propose to user: "I've crystallized the [Pattern Name]. Approval to persist?"

## Red Flags - DO NOT CRYSTALLIZE
- One-off bug fixes without a broader pattern.
- Standard library usage already well-documented online.
- Failed attempts or unstable logic.
