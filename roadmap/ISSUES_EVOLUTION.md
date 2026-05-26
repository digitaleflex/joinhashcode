# Issue : Visualisation Radar de Profil (Spider Chart)

## 🎯 Objectif
Rendre l'évolution du profil utilisateur "vivante" en affichant un graphique radar basé sur les scores de Vibrancy (Builder, Creator, Strategist, Catalyst).

## 🛠️ Spécifications Techniques
- **Librairie :** Recharts (recommandé pour la compatibilité React) ou simple SVG/Framer Motion.
- **Source de données :** Champ `behavioralVibrancy` de l'objet `User`.
- **Composant :** Créer `components/dashboard/profile-radar-chart.tsx`.
- **Intégration :** L'afficher sur la page Dashboard et sur la page Profil publique.

## ✅ Critères de Succès
- [ ] Le graphique s'adapte en temps réel aux données de la DB.
- [ ] Design "Tactique" (couleurs néon, transparence, mono-police).
- [ ] Animation d'entrée lors du chargement.

---

# Issue : Mise en place Matchmaking Alpha

## 🎯 Objectif
Permettre aux utilisateurs de trouver des partenaires complémentaires pour les missions hybrides.

## 🛠️ Spécifications Techniques
- **Logique :** Query Prisma pour trouver des utilisateurs dont la classe primaire complète celle de l'utilisateur actuel.
- **UI :** Une petite carte "Partenaires suggérés" sur la page de détail d'une mission.
- **Action :** Bouton "Contacter" (redirection Telegram ou ouverture d'un mini-chat).

## ✅ Critères de Succès
- [ ] Algorithme de recommandation basique fonctionnel.
- [ ] Respect de la confidentialité (ne montre que le pseudo et la classe).
