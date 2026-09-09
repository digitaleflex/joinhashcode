# Baseline — Analyse des issues existantes

## Constat principal
Les issues récentes montrent trois familles mélangées:
1. corrections de qualité/UX (#248, #250, #251, #253, #255, #333, #338)
2. fonctionnalités produit (#320–#322, #335, #337)
3. architecture/transverse (#306, #317–#319, #267, #329)

## Risque
Le backlog contient des décisions qui semblent provenir d'audits ponctuels. Elles ne doivent pas être exécutées aveuglément avant validation contre le code actuel.

## Priorité proposée

### P0 — vérifier avant toute nouvelle feature
- #267 autosave race condition
- #318 suppression de compte / données missions / RGPD
- #317 rate limiting missions
- #323 mesure réelle du funnel d'activation

### P1 — boucle produit
- #320 notification review admin
- #322 contenu M04–M06, seulement après validation du funnel #323
- #313 SLA review (à confirmer par audit)
- #314 feedback review agrégé (à confirmer)

### P2 — architecture/qualité
- #250 tokens light/dark
- #252 simplification Prisma: NE PAS exécuter avant audit Data complet
- #329 feature flags morts
- #325 guided tour: décision après métrique d'activation
- #338 accessibilité WCAG AA

### À challenger fortement
- #252: fusionner des modèles 1:1 peut réduire ou augmenter la complexité selon les usages réels; audit Prisma obligatoire.
- #335: rechercher par email dans une recherche utilisateur peut créer un risque de confidentialité/enumeration; revoir le besoin.
- #337: bulk accept/reject de join requests nécessite une politique métier claire.
- #321: webhooks Slack/Discord sont secondaires tant que la boucle review n'est pas mesurée.
- #319: import/export mission est utile pour ops, mais pas prioritaire face aux bugs de lifecycle.

## Prochaine étape
Exécuter les audits spécialisés et mettre à jour cette baseline avec:
- issue confirmée
- issue invalidée
- issue déjà résolue
- issue doublon
- issue à fusionner
- issue à re-prioriser.
