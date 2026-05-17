# **Le Cockpit d'Ingénierie Augmenté : Transformer Gemini CLI en Environnement Professionnel**

*Ce document définit les standards et l'architecture de développement augmenté pour le projet HASHCODE.*

## **1. Architecture et Gouvernance**
- **Hiérarchie :** Les paramètres de projet (`.gemini/settings.json`) priment sur les paramètres globaux.
- **Plan Mode :** Obligatoire pour toute modification complexe via `/plan`.
- **GEMINI.md :** Prompt système persistant définissant les règles architecturales.

## **2. Protocole MCP (Model Context Protocol)**
- **Filtrage :** Utilisation de `includeTools` pour éviter le "token bloat".
- **Privilégier le CLI :** Utiliser les commandes natives (git, npm) plutôt que des serveurs MCP lourds quand c'est possible.

## **3. Sécurité (Shift-Left)**
- **SAST :** Utilisation de Semgrep (via MCP) pour l'audit en temps réel.
- **Remédiation :** L'agent doit itérer jusqu'à ce que le scanner soit vierge.

## **4. Workflows Avancés**
- **Slash Commands :** Utilisation de `/git:commit` pour les messages de commit standardisés.
- **Skills :** Utilisation de compétences spécialisées (TDD, Architecture) dans `.agents/skills/`.

---
*Source : Document "Stack Développement Augmenté Gemini CLI" (Mai 2026)*
