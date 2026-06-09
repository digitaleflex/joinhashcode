# P18 — Enquête de satisfaction post-Quiz

**Priorité :** 🔵 Moyenne (P2 Validation)  
**Effort estimé :** ~1h  
**Pourquoi c'est important :** Mesurer si le moteur de diagnostic HASHCODE "tombe juste" aux yeux de l'utilisateur.

---

## Contexte
- **Cible :** Page de résultat du quiz.

---

## Ce qu'il faut faire

### Étape 1 — Micro-enquête
Insérer une carte d'enquête juste après la révélation du profil :
- "Le résultat te semble-t-il pertinent ?" (Oui/Non)
- "Le quiz t'a-t-il été utile ?" (Échelle 1-5)

### Étape 2 — Collecte
Enregistrer ces réponses dans une nouvelle table `QuizFeedback` ou enrichir `QuizResult`.

---

## Critères d'acceptation
- [ ] L'enquête s'affiche automatiquement après le quiz.
- [ ] Les données sont exploitables par l'équipe produit pour ajuster les algos.
