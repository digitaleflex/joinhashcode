# **Le Cockpit d'Ingénierie Augmenté : Transformer Gemini CLI en Environnement Professionnel**

_Ce document définit les standards et l'architecture de développement augmenté pour le projet HASHCODE._

## **1. Architecture et Gouvernance**

- **Hiérarchie :** Les paramètres de projet (`.gemini/settings.json`) priment sur les paramètres globaux.
- **Plan Mode :** Obligatoire pour toute modification complexe via `/plan`.
- **GEMINI.md :** Prompt système persistant définissant les règles architecturales.

## **2. Protocole MCP & Efficacité Cognitive**

- **Pipeline Cognitif à 4 Niveaux :**
  1. **Tier 1 — Action Directe :** Pour les corrections chirurgicales et UI simples.
  2. **Tier 2 — Sequential Thinking :** Obligatoire pour les audits de sécurité et changements d'architecture.
  3. **Tier 3 — Parallélisme Multi-Agents :** Pour les grosses roadmaps (3-5 agents simultanés).
  4. **Tier 4 — Neural Search :** Recherche externe via Exa/Firecrawl en cas de documentation locale insuffisante.
- **Privilégier le CLI :** Utiliser les commandes natives (git, npm) plutôt que des serveurs MCP lourds quand c'est possible.
- **Surgical Edits :** Utiliser `replace` au lieu de réécrire des fichiers complets pour économiser les tokens.

## **3. Sécurité (Shift-Left) & Décisions Architecturales**

- **Cycle-Aware Submissions :** Les challenges hebdomadaires utilisent une `cycleKey` (ISO-Week) pour permettre la répétitivité tout en gardant l'unicité des missions permanentes.
- **XP Integrity :** Les points d'XP sont attribués via des transactions atomiques uniquement lors de la _première_ approbation d'un cycle.
- **Hardened Crons :** Les endpoints internes exigent des secrets forts (16+ chars) ou une signature cryptographique.
- **SAST :** Utilisation de Semgrep (via MCP) pour l'audit en temps réel.

## **4. Workflows Avancés**

- **Slash Commands :** Utilisation de `/git:commit` pour les messages de commit standardisés.
- **Skills :** Utilisation de compétences spécialisées (TDD, Architecture) dans `.agents/skills/`.

---

_Source : Document "Stack Développement Augmenté Gemini CLI" (Mai 2026)_
