# ROADMAP : HASHCODE TALENT OS (V2.7 - V3.0)

Ce document définit la stratégie d'implémentation du système d'intelligence de talent de HASHCODE Community.

---

## 📅 Séquence d'Exécution (Priorités)

L'implémentation doit suivre cet ordre logique pour garantir l'intégrité des données :

### 1. Phase "Fondations" : L'Impact Engine (Priorité Haute)

- **Pourquoi :** On ne peut pas matcher des gens sans savoir mesurer leur talent réel et leur fiabilité de manière incontestable.
- **Concepts clés :** IRT (Score θ), Glicko-2 (Indice σ).
- **Impact :** Remplace l'XP linéaire par une compétence latente.

### 2. Phase "Synergie" : Le Talent Matching Engine (Priorité Moyenne)

- **Pourquoi :** Utilise les données stabilisées de l'Impact Engine pour calculer la compatibilité.
- **Concepts clés :** Complémentarité Cognitive, 7 Piliers de Match.
- **Impact :** Automatise la formation d'escouades d'élite.

### 3. Phase "Pilotage" : Squad Health Score & V4 Prédictive

- **Pourquoi :** Offrir une vision temps réel de la viabilité des projets.
- **Impact :** Réduit le taux d'échec des missions complexes.

---

## 🚩 ISSUE 01 : [FEATURE] Impact Engine (IRT & Glicko-2)

### Description

Remplacer le système de points d'XP linéaire par un moteur d'impact basé sur des modèles probabilistes. Définir le **Niveau Latent (Score θ)** et l'**Indice de Confiance (σ)**.

### Spécifications

- **IRT (Score θ) :** Utiliser le modèle de Rasch pour pondérer la compétence par la difficulté des missions.
- **Glicko-2 (σ) :** Calculer la fiabilité (μ = niveau, σ = incertitude).
- **Formule Impact :** `(0.35*Prod) + (0.25*Qualité) + (0.15*Collab) + (0.15*Fiabilité) + (0.10*Lead)`.

### Database (Prisma)

Ajouter `theta`, `mu`, `sigma`, `volatility` et `impactScore` au modèle `User`.

---

## 🚩 ISSUE 02 : [ARCH] Talent Matching Engine (V1)

### Description

Développer le moteur de mise en relation des talents. Passer de la "Recherche" à la "Recommandation de Compatibilité".

### Les 7 Piliers du Match Score

1.  **Complémentarité Cognitive (40%) :** Équilibre Artisan/Architecte/Visionnaire/Fédérateur.
2.  **Alignement des Objectifs (15%) :** Convergence des ambitions.
3.  **Synergie Technique (15%) :** Stacks complémentaires.
4.  **Fiabilité (10%) :** Basée sur le Glicko-2 Trust Score.
5.  **Activité Récente (10%) :** Rythme de présence.
6.  **Disponibilité (5%) :** Synchronisation agendas.
7.  **Localisation (5%) :** Proximité géographique.

### Livrables

- `MatchingService.ts`
- Endpoint `GET /api/talents/match`
- Interface UI "Recommandations d'Élite".

---

## ✅ Critères de Validation Globale

- [ ] Le calcul du Score θ est auditable et cohérent avec la difficulté des missions.
- [ ] L'indice σ augmente correctement en cas d'inactivité.
- [ ] Les recommandations de match augmentent le taux de succès des escouades de 20% (Mesure Beta).
