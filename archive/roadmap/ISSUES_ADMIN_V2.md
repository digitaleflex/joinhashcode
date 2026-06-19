# Roadmap: Admin V2 (Neuromarketing & Pédagogie)

Ce document suit l'implémentation des fonctionnalités avancées du panel administrateur, validées sous l'angle du neuromarketing (engagement) et de la neuro-pédagogie (apprentissage).

## Sprint 1 : La Survie (Modération des Escouades)

**Objectif :** Éviter l'effet "vitre brisée" et la dissonance cognitive liés aux escouades fantômes ou bloquées.

- [ ] **Issue 1 : Transfert de Leadership Forcé**
  - Permettre à un Admin de changer le `owner` d'une organisation depuis la vue `admin/squads`.
  - API : Route admin pour by-passer les règles normales de transfert.
- [ ] **Issue 2 : Dissolution d'Escouade Forcée**
  - Permettre à un Admin de supprimer une organisation toxique ou inactive.
  - S'assurer que le bouton existe sur la vue de détail d'une escouade côté admin.

## Sprint 2 : L'Engagement (Mode God & Événements)

**Objectif :** Créer des pics d'attention (FOMO, récompense variable) pour contrer la courbe de l'oubli.

- [ ] **Issue 3 : Toggle Multiplicateur d'XP**
  - Interface dans l'admin pour activer un "Événement Spécial" (ex: XP x1.5 ou x2).
  - Modifier le moteur de réclamation de récompense (`claim.ts`) pour appliquer le multiplicateur si l'événement est actif (via une table de configuration ou Redis).

## Sprint 3 : La Justice (Sécurité Psychologique)

**Objectif :** Maintenir le biais d'équité en punissant les tricheurs et en protégeant les membres honnêtes.

- [ ] **Issue 4 : Système de Signalement (Reviewers)**
  - Bouton "Signaler à un Admin" sur une soumission (ex: plagiat IA flagrant).
- [ ] **Issue 5 : File de Modération (Admins)**
  - Nouvel onglet dans l'admin `/admin/reports` pour voir et traiter (valider/rejeter) les signalements.

## Sprint 4 : La Data (Évaluation Formative)

**Objectif :** Lisser la courbe de friction cognitive en identifiant les points de blocage.

- [ ] **Issue 6 : Analytics Dashboard Admin**
  - Taux moyen de cohésion globale.
  - Drop-off des missions (Ratio : Acceptées vs Soumises vs Complétées).
