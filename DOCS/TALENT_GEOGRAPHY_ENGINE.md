# SPEC : TALENT GEOGRAPHY ENGINE (V3.1)

Ce document définit la stratégie de cartographie des talents sans compromis sur la confidentialité (Zero GPS Policy).

---

## 🛡️ Philosophie : "Institutional Mapping"

Nous ne collectons jamais de coordonnées GPS personnelles. Nous mappons les talents à travers leurs ancrages institutionnels et urbains.

### Niveau 1 : Collecte de Données (Input)

- **Étudiants :** École, Filière, Niveau d'étude.
- **Professionnels :** Entreprise, Secteur, Fonction.
- **Localisation :** Ville actuelle uniquement.

### Niveau 2 : Talent Geography Engine (Logic)

Le système agrège les membres par nœuds institutionnels :

- **Nodes Écoles :** IFRI, ESGIS, EPITECH, etc.
- **Nodes Entreprises :** MTN, Canal+, Startups, etc.
- **Nodes Villes :** Cotonou, Abomey-Calavi, Dakar, etc.

---

## 🚀 Fonctionnalités Clés

### 1. Cluster Detection (Détection de Grappes)

Algorithme identifiant des groupes de talents par spécialité et proximité.
_Exemple : "Cluster détecté : 18 experts Cybersécurité à Abomey-Calavi"._

### 2. Campus Intelligence

Analyse automatisée de la force technique d'un campus.
_Exemple : "IFRI : Top spécialités = Cloud & Dev. Leader naturel détecté = José"._

### 3. Smart Events & Ambassadeurs

- Recommandation de Meetups dès qu'un cluster atteint un seuil critique (ex: 20 membres).
- Habilitation automatique de "Campus Ambassadors" pour les leaders de nodes.

---

## 🔗 Le Talent Graph

Le Geography Engine alimente le graphe global reliant :
`Membres ↔ Écoles ↔ Entreprises ↔ Compétences ↔ Projets`.

---

## ✅ Critères d'Acceptation

- [ ] Confidentialité totale : Pas de points sur une carte, mais des volumes par institution.
- [ ] Scalabilité : Supporte de 50 à 50 000 membres sans perte de performance.
- [ ] Utilité : Permet de répondre à "Quelle école produit les meilleurs experts Cloud ?".
